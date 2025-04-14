using FitnessApp.API.Data;
using FitnessApp.API.Models;
using FitnessApp.API.Models.DTOs;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace FitnessApp.API.Services
{
    public interface IAIRecipeService
    {
        Task<string> GetRecipeRecommendationAsync(string ingredients, UserProfile userProfile);
        Task<Recipe> SaveRecipeAsync(string recipeText, int userId);
        ParsedRecipeDto ParseRecipeText(string recipeText, string dietType, string objective);
    }

    public class AIRecipeService : IAIRecipeService
    {
        private readonly IOpenAIService _openAIService;
        private readonly IProfileService _profileService;
        private readonly ILogger<AIRecipeService> _logger;
        private readonly AppDbContext _context;

        public AIRecipeService(
            IOpenAIService openAIService,
            IProfileService profileService,
            AppDbContext context,
            ILogger<AIRecipeService> logger)
        {
            _openAIService = openAIService;
            _profileService = profileService;
            _context = context;
            _logger = logger;
        }

        public async Task<string> GetRecipeRecommendationAsync(string ingredients, UserProfile userProfile)
        {
            try
            {
                // Construim prompt-ul pentru OpenAI
                string prompt = ConstructRecipePrompt(ingredients, userProfile);
                
                // Trimitem prompt-ul către OpenAI
                string response = await _openAIService.GetCompletionAsync(prompt);
                
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea recomandării de rețete");
                throw new Exception("Nu s-a putut obține recomandarea de rețete", ex);
            }
        }

        public async Task<Recipe> SaveRecipeAsync(string recipeText, int userId)
        {
            try
            {
                // Obținem profilul utilizatorului pentru a-i cunoaște dieta și obiectivul
                var userProfile = await _profileService.GetProfileByUserIdAsync(userId);
                if (userProfile == null)
                {
                    throw new InvalidOperationException("Nu s-a găsit un profil pentru acest utilizator");
                }

                string dietType = MapDietToRecipeDietType(userProfile.Diet);
                string objective = MapObjectiveToRecipeObjective(userProfile.Objective);

                // Parsăm textul rețetei
                var parsedRecipe = ParseRecipeText(recipeText, dietType, objective);

                // Creăm un nou obiect Recipe
                var recipe = new Recipe
                {
                    Title = parsedRecipe.Title,
                    Description = parsedRecipe.Description,
                    PrepTime = parsedRecipe.PrepTime,
                    Servings = parsedRecipe.Servings,
                    Calories = parsedRecipe.Calories,
                    Protein = parsedRecipe.Protein,
                    Carbs = parsedRecipe.Carbs,
                    Fat = parsedRecipe.Fat,
                    Ingredients = parsedRecipe.Ingredients,
                    Steps = parsedRecipe.Steps,
                    Tips = parsedRecipe.Tips,
                    DietType = parsedRecipe.DietType,
                    Objective = parsedRecipe.Objective,
                    ProteinContent = parsedRecipe.ProteinContent,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                // Salvăm rețeta în baza de date
                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync();

                return recipe;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la salvarea rețetei");
                throw new Exception("Nu s-a putut salva rețeta", ex);
            }
        }

        public ParsedRecipeDto ParseRecipeText(string recipeText, string dietType, string objective)
        {
            var parsedRecipe = new ParsedRecipeDto
            {
                DietType = dietType,
                Objective = objective,
                ProteinContent = DetermineProteinContent(objective)
            };

            // Parsăm titlul
            var titleMatch = Regex.Match(recipeText, @"Titlu:\s*(.+)");
            if (titleMatch.Success)
            {
                parsedRecipe.Title = titleMatch.Groups[1].Value.Trim();
            }

            // Parsăm descrierea
            var descriptionMatch = Regex.Match(recipeText, @"Descriere:\s*(.+?)(?=\n\n|\n[A-Z]|$)", RegexOptions.Singleline);
            if (descriptionMatch.Success)
            {
                parsedRecipe.Description = descriptionMatch.Groups[1].Value.Trim();
            }

            // Parsăm timpul de preparare
            var prepTimeMatch = Regex.Match(recipeText, @"Timp de preparare:\s*(\d+)");
            if (prepTimeMatch.Success && int.TryParse(prepTimeMatch.Groups[1].Value, out int prepTime))
            {
                parsedRecipe.PrepTime = prepTime;
            }

            // Parsăm porțiile
            var servingsMatch = Regex.Match(recipeText, @"Porții:\s*(\d+)");
            if (servingsMatch.Success && int.TryParse(servingsMatch.Groups[1].Value, out int servings))
            {
                parsedRecipe.Servings = servings;
            }

            // Parsăm informațiile nutriționale
            var caloriesMatch = Regex.Match(recipeText, @"Calorii:\s*(\d+)");
            if (caloriesMatch.Success && int.TryParse(caloriesMatch.Groups[1].Value, out int calories))
            {
                parsedRecipe.Calories = calories;
            }

            var proteinMatch = Regex.Match(recipeText, @"Proteine:\s*(\d+)");
            if (proteinMatch.Success && int.TryParse(proteinMatch.Groups[1].Value, out int protein))
            {
                parsedRecipe.Protein = protein;
            }

            var carbsMatch = Regex.Match(recipeText, @"Carbohidrați:\s*(\d+)");
            if (carbsMatch.Success && int.TryParse(carbsMatch.Groups[1].Value, out int carbs))
            {
                parsedRecipe.Carbs = carbs;
            }

            var fatMatch = Regex.Match(recipeText, @"Grăsimi:\s*(\d+)");
            if (fatMatch.Success && int.TryParse(fatMatch.Groups[1].Value, out int fat))
            {
                parsedRecipe.Fat = fat;
            }

            // Parsăm ingredientele
            var ingredientsSection = Regex.Match(recipeText, @"Ingrediente:(.*?)(?=\n\nMod de preparare:|\n\nPași:|\n\nSfaturi:|\n\nPreparare:|\n\nInstrucțiuni:|\z)", RegexOptions.Singleline);
            if (ingredientsSection.Success)
            {
                var ingredients = ingredientsSection.Groups[1].Value.Trim()
                    .Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(i => i.TrimStart('-', ' ').Trim())
                    .Where(i => !string.IsNullOrWhiteSpace(i))
                    .ToList();

                parsedRecipe.Ingredients = ingredients;
            }

            // Parsăm pașii de preparare
            var stepsSection = Regex.Match(recipeText, @"Mod de preparare:(.*?)(?=\n\nSfaturi:|\z)", RegexOptions.Singleline);
            if (stepsSection.Success)
            {
                var steps = stepsSection.Groups[1].Value.Trim()
                    .Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => Regex.Replace(s, @"^\d+\.\s*", "").Trim())
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .ToList();

                parsedRecipe.Steps = steps;
            }

            // Parsăm sfaturile
            var tipsSection = Regex.Match(recipeText, @"Sfaturi:(.*?)(?=\z)", RegexOptions.Singleline);
            if (tipsSection.Success)
            {
                var tips = tipsSection.Groups[1].Value.Trim()
                    .Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(t => t.TrimStart('-', ' ').Trim())
                    .Where(t => !string.IsNullOrWhiteSpace(t))
                    .ToList();

                parsedRecipe.Tips = tips;
            }

            // Determinăm conținutul proteic
            parsedRecipe.ProteinContent = DetermineProteinContent(objective, parsedRecipe.Protein);

            return parsedRecipe;
        }

        private string ConstructRecipePrompt(string ingredients, UserProfile userProfile)
        {
            // Adăugăm informațiile relevante din profilul utilizatorului
            string dietType = MapDietToRecipeDietType(userProfile.Diet);
            string objective = MapObjectiveToRecipeObjective(userProfile.Objective);
            
            // Procesăm alergiile/restricțiile
            string allergiesRestrictions = string.IsNullOrEmpty(userProfile.AllergiesRestrictions) 
                ? "Nu sunt specificate alergii sau restricții dietetice." 
                : userProfile.AllergiesRestrictions;
            
            // Construim prompt-ul
            return $@"Creează o rețetă sănătoasă folosind următoarele ingrediente: {ingredients}.

RESTRICȚII IMPORTANTE:
- Rețeta trebuie să fie adaptată pentru o dietă de tip {dietType} și să susțină obiectivul de {objective}.
- Utilizatorul are următoarele alergii/restricții dietetice: {allergiesRestrictions}
- NU folosi ingrediente care s-ar putea potrivi cu restricțiile/alergiile menționate anterior.

Adaugă și informații nutriționale aproximative (calorii, proteine, carbohidrați, grăsimi).
Formatează răspunsul în următorul mod:

Titlu: [Numele rețetei]
Descriere: [O scurtă descriere a rețetei]
Timp de preparare: [Timpul în minute]
Porții: [Numărul de porții]
Informații nutriționale (per porție):
- Calorii: [număr] kcal
- Proteine: [număr] g
- Carbohidrați: [număr] g
- Grăsimi: [număr] g

Ingrediente:
- [Ingredient 1]
- [Ingredient 2]
...

Mod de preparare:
1. [Pas 1]
2. [Pas 2]
...

Sfaturi:
- [Sfat 1]
- [Sfat 2]
...";
        }

        // Metodă pentru maparea dietei din profilul utilizatorului la tipul de dietă din rețetă
        private string MapDietToRecipeDietType(string profileDiet)
        {
            return profileDiet.ToLower() switch
            {
                "omnivore" => "carnivor",
                "vegetarian" => "vegetarian",
                "vegan" => "vegan",
                _ => "carnivor"  // valoare implicită
            };
        }

        // Metodă pentru maparea obiectivului din profilul utilizatorului la obiectivul rețetei
        private string MapObjectiveToRecipeObjective(string profileObjective)
        {
            return profileObjective.ToLower() switch
            {
                "slăbire" => "slăbit",
                "pierdere în greutate" => "slăbit",
                "masă musculară" => "masă",
                "creșterea masei musculare" => "masă",
                "tonifiere" => "fit",
                "menținere" => "fit",
                _ => "fit"  // valoare implicită
            };
        }

        // Metodă pentru determinarea conținutului proteic
        private string DetermineProteinContent(string objective, int proteinAmount = 0)
        {
            // Dacă obiectivul este de creștere în masă, probabil dorim un conținut proteic ridicat
            if (objective.ToLower() == "masă")
            {
                return "ridicat";
            }
            
            // Dacă avem cantitatea de proteine și este peste un prag, considerăm conținutul ridicat
            if (proteinAmount > 30)
            {
                return "ridicat";
            }
            
            return "normal";
        }
    }
}