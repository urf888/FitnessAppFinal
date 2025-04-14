using FitnessApp.API.Data;
using FitnessApp.API.Models;
using FitnessApp.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace FitnessApp.API.Services
{
    public interface IMealRecommendationService
    {
        // Generează recomandări de mese bazate pe profilul utilizatorului
        Task<DailyMealRecommendationDto> GenerateDailyMealPlanAsync(int userId);
        
        // Generează rețete bazate pe ingrediente selectate
        Task<List<RecipeRecommendationDto>> GenerateRecipesByIngredientsAsync(int userId, List<string> ingredients);
    }

    public class MealRecommendationService : IMealRecommendationService
    {
        private readonly IOpenAIService _openAIService;
        private readonly IProfileService _profileService;
        private readonly IRecipeService _recipeService;
        private readonly ILogger<MealRecommendationService> _logger;
        private readonly string _baseImagePath = "/images/recipe-types/";

        public MealRecommendationService(
            IOpenAIService openAIService,
            IProfileService profileService,
            IRecipeService recipeService,
            ILogger<MealRecommendationService> logger)
        {
            _openAIService = openAIService;
            _profileService = profileService;
            _recipeService = recipeService;
            _logger = logger;
        }

        public async Task<DailyMealRecommendationDto> GenerateDailyMealPlanAsync(int userId)
        {
            try
            {
                // Obține profilul utilizatorului
                var userProfile = await _profileService.GetProfileByUserIdAsync(userId);
                if (userProfile == null)
                {
                    throw new InvalidOperationException("Utilizatorul nu are un profil creat");
                }

                // Calculăm necesarul caloric zilnic
                double dailyCalories = CalculateDailyCalories(userProfile);
                
                // Construim prompt-ul pentru OpenAI
                string prompt = BuildDailyMealPlanPrompt(userProfile, dailyCalories);
                
                // Obținem răspunsul de la OpenAI
                string aiResponse = await _openAIService.GetCompletionAsync(prompt);
                
                // Parsăm răspunsul în DTO-ul nostru
                var mealPlan = ParseDailyMealPlanResponse(aiResponse, userProfile.Diet);
                
                return mealPlan;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la generarea planului de mese pentru utilizatorul {UserId}", userId);
                throw new Exception("Nu s-a putut genera planul de mese", ex);
            }
        }

        public async Task<List<RecipeRecommendationDto>> GenerateRecipesByIngredientsAsync(int userId, List<string> ingredients)
        {
            try
            {
                // Obține profilul utilizatorului
                var userProfile = await _profileService.GetProfileByUserIdAsync(userId);
                if (userProfile == null)
                {
                    throw new InvalidOperationException("Utilizatorul nu are un profil creat");
                }

                // Construim prompt-ul pentru OpenAI bazat pe ingrediente
                string prompt = BuildRecipesByIngredientsPrompt(userProfile, ingredients);
                
                // Obținem răspunsul de la OpenAI
                string aiResponse = await _openAIService.GetCompletionAsync(prompt);
                
                // Parsăm răspunsul în DTO-ul nostru
                var recipes = ParseRecipesByIngredientsResponse(aiResponse, userProfile.Diet);
                
                return recipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la generarea rețetelor bazate pe ingrediente pentru utilizatorul {UserId}", userId);
                throw new Exception("Nu s-au putut genera rețetele bazate pe ingrediente", ex);
            }
        }

        private string BuildDailyMealPlanPrompt(UserProfile profile, double dailyCalories)
        {
            StringBuilder promptBuilder = new StringBuilder();
            
            promptBuilder.AppendLine("Creează un plan zilnic de 3 mese principale (mic dejun, prânz și cină) și 2 gustări bazat pe următorul profil:");
            promptBuilder.AppendLine($"- Vârstă: {profile.Age} ani");
            promptBuilder.AppendLine($"- Greutate: {profile.Weight} kg");
            promptBuilder.AppendLine($"- Înălțime: {profile.Height} cm");
            promptBuilder.AppendLine($"- Sex: {profile.Sex}");
            promptBuilder.AppendLine($"- Nivel de activitate: {profile.ActivityLevel}");
            promptBuilder.AppendLine($"- Obiectiv: {profile.Objective}");
            promptBuilder.AppendLine($"- Dietă: {profile.Diet}");
            promptBuilder.AppendLine($"- Experiență fitness: {profile.Experience}");
            
            if (!string.IsNullOrEmpty(profile.AllergiesRestrictions))
            {
                promptBuilder.AppendLine($"- Alergii/Restricții: {profile.AllergiesRestrictions}");
            }
            
            promptBuilder.AppendLine($"Necesarul caloric zilnic estimat: {dailyCalories} calorii");
            
            promptBuilder.AppendLine("\nPentru fiecare masă, generează câte 3 opțiuni de rețete. Pentru fiecare rețetă, include:");
            promptBuilder.AppendLine("1. Titlu");
            promptBuilder.AppendLine("2. Descriere scurtă");
            promptBuilder.AppendLine("3. Timpul de preparare (în minute)");
            promptBuilder.AppendLine("4. Numărul de porții");
            promptBuilder.AppendLine("5. Valorile nutritive (calorii, proteine, carbohidrați, grăsimi, fibre, zahăr)");
            promptBuilder.AppendLine("6. Lista de ingrediente (cu cantități)");
            promptBuilder.AppendLine("7. Pașii de preparare");
            promptBuilder.AppendLine("8. Sfaturi și trucuri");
            
            promptBuilder.AppendLine("\nClasifică fiecare rețetă în funcție de:");
            promptBuilder.AppendLine("- Tipul de dietă: 'carnivor', 'vegetarian' sau 'vegan'");
            promptBuilder.AppendLine("- Obiectiv: 'masă' (pentru creșterea masei musculare), 'slăbit' sau 'fit' (pentru menținere)");
            promptBuilder.AppendLine("- Conținut proteic: 'normal' sau 'ridicat'");
            
            promptBuilder.AppendLine("\nRăspunde în format JSON cu următoarea structură:");
            promptBuilder.AppendLine("{");
            promptBuilder.AppendLine("  \"breakfast\": [{ rețetă1 }, { rețetă2 }, { rețetă3 }],");
            promptBuilder.AppendLine("  \"morningSnack\": [{ rețetă1 }, { rețetă2 }],");
            promptBuilder.AppendLine("  \"lunch\": [{ rețetă1 }, { rețetă2 }, { rețetă3 }],");
            promptBuilder.AppendLine("  \"afternoonSnack\": [{ rețetă1 }, { rețetă2 }],");
            promptBuilder.AppendLine("  \"dinner\": [{ rețetă1 }, { rețetă2 }, { rețetă3 }]");
            promptBuilder.AppendLine("}");
            
            return promptBuilder.ToString();
        }

        private string BuildRecipesByIngredientsPrompt(UserProfile profile, List<string> ingredients)
        {
            StringBuilder promptBuilder = new StringBuilder();
            
            promptBuilder.AppendLine("Creează 5 rețete utilizând următoarele ingrediente (nu este necesar să folosești toate ingredientele în fiecare rețetă, dar fiecare rețetă trebuie să conțină cel puțin 2 dintre acestea):");
            
            // Adăugăm ingredientele
            foreach (var ingredient in ingredients)
            {
                promptBuilder.AppendLine($"- {ingredient}");
            }
            
            promptBuilder.AppendLine("\nProfilul utilizatorului:");
            promptBuilder.AppendLine($"- Dietă: {profile.Diet}");
            promptBuilder.AppendLine($"- Obiectiv: {profile.Objective}");
            
            if (!string.IsNullOrEmpty(profile.AllergiesRestrictions))
            {
                promptBuilder.AppendLine($"- Alergii/Restricții: {profile.AllergiesRestrictions}");
            }
            
            promptBuilder.AppendLine("\nPentru fiecare rețetă, include:");
            promptBuilder.AppendLine("1. Titlu");
            promptBuilder.AppendLine("2. Descriere scurtă");
            promptBuilder.AppendLine("3. Timpul de preparare (în minute)");
            promptBuilder.AppendLine("4. Numărul de porții");
            promptBuilder.AppendLine("5. Valorile nutritive (calorii, proteine, carbohidrați, grăsimi, fibre, zahăr)");
            promptBuilder.AppendLine("6. Lista de ingrediente (cu cantități)");
            promptBuilder.AppendLine("7. Pașii de preparare");
            promptBuilder.AppendLine("8. Sfaturi și trucuri");
            
            promptBuilder.AppendLine("\nClasifică fiecare rețetă în funcție de:");
            promptBuilder.AppendLine("- Tipul de dietă: 'carnivor', 'vegetarian' sau 'vegan'");
            promptBuilder.AppendLine("- Obiectiv: 'masă' (pentru creșterea masei musculare), 'slăbit' sau 'fit' (pentru menținere)");
            promptBuilder.AppendLine("- Conținut proteic: 'normal' sau 'ridicat'");
            
            promptBuilder.AppendLine("\nRăspunde în format JSON cu un array de rețete.");
            
            return promptBuilder.ToString();
        }

        private DailyMealRecommendationDto ParseDailyMealPlanResponse(string aiResponse, string dietType)
        {
            try
            {
                // Încercăm să parsăm JSON-ul din răspuns
                var jsonResponse = JsonDocument.Parse(aiResponse).RootElement;
                
                var result = new DailyMealRecommendationDto
                {
                    Breakfast = ParseMealOptions(jsonResponse.GetProperty("breakfast"), dietType),
                    MorningSnack = ParseMealOptions(jsonResponse.GetProperty("morningSnack"), dietType),
                    Lunch = ParseMealOptions(jsonResponse.GetProperty("lunch"), dietType),
                    AfternoonSnack = ParseMealOptions(jsonResponse.GetProperty("afternoonSnack"), dietType),
                    Dinner = ParseMealOptions(jsonResponse.GetProperty("dinner"), dietType)
                };
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la parsarea răspunsului AI pentru planul de mese");
                throw new Exception("Nu s-a putut parsa răspunsul pentru planul de mese", ex);
            }
        }

        private List<RecipeRecommendationDto> ParseRecipesByIngredientsResponse(string aiResponse, string dietType)
        {
            try
            {
                // Încercăm să parsăm JSON-ul din răspuns
                var jsonArray = JsonDocument.Parse(aiResponse).RootElement;
                
                var recipes = new List<RecipeRecommendationDto>();
                
                // Parcurgem array-ul de rețete
                foreach (var jsonRecipe in jsonArray.EnumerateArray())
                {
                    var recipe = ParseRecipeFromJson(jsonRecipe, dietType);
                    recipes.Add(recipe);
                }
                
                return recipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la parsarea răspunsului AI pentru rețete bazate pe ingrediente");
                throw new Exception("Nu s-a putut parsa răspunsul pentru rețetele bazate pe ingrediente", ex);
            }
        }

        private List<RecipeRecommendationDto> ParseMealOptions(JsonElement jsonArray, string dietType)
        {
            var mealOptions = new List<RecipeRecommendationDto>();
            
            foreach (var jsonRecipe in jsonArray.EnumerateArray())
            {
                var recipe = ParseRecipeFromJson(jsonRecipe, dietType);
                mealOptions.Add(recipe);
            }
            
            return mealOptions;
        }

        private RecipeRecommendationDto ParseRecipeFromJson(JsonElement jsonRecipe, string dietType)
        {
            var recipe = new RecipeRecommendationDto();
            
            // Extragem proprietățile de bază
            recipe.Title = jsonRecipe.GetProperty("title").GetString() ?? "";
            recipe.Description = jsonRecipe.GetProperty("description").GetString() ?? "";
            recipe.PrepTime = jsonRecipe.GetProperty("prepTime").GetInt32();
            recipe.Servings = jsonRecipe.GetProperty("servings").GetInt32();
            
            // Valori nutritive
            recipe.Calories = jsonRecipe.GetProperty("calories").GetInt32();
            recipe.Protein = jsonRecipe.GetProperty("protein").GetInt32();
            recipe.Carbs = jsonRecipe.GetProperty("carbs").GetInt32();
            recipe.Fat = jsonRecipe.GetProperty("fat").GetInt32();
            recipe.Fiber = jsonRecipe.TryGetProperty("fiber", out var fiber) ? fiber.GetInt32() : 0;
            recipe.Sugar = jsonRecipe.TryGetProperty("sugar", out var sugar) ? sugar.GetInt32() : 0;
            
            // Clasificări
            recipe.DietType = jsonRecipe.GetProperty("dietType").GetString() ?? "carnivor";
            recipe.Objective = jsonRecipe.GetProperty("objective").GetString() ?? "fit";
            recipe.ProteinContent = jsonRecipe.GetProperty("proteinContent").GetString() ?? "normal";
            
            // Liste
            recipe.Ingredients = new List<string>();
            var ingredientsArray = jsonRecipe.GetProperty("ingredients");
            foreach (var ingredient in ingredientsArray.EnumerateArray())
            {
                recipe.Ingredients.Add(ingredient.GetString() ?? "");
            }
            
            recipe.Steps = new List<string>();
            var stepsArray = jsonRecipe.GetProperty("steps");
            foreach (var step in stepsArray.EnumerateArray())
            {
                recipe.Steps.Add(step.GetString() ?? "");
            }
            
            recipe.Tips = new List<string>();
            if (jsonRecipe.TryGetProperty("tips", out var tipsElement))
            {
                foreach (var tip in tipsElement.EnumerateArray())
                {
                    recipe.Tips.Add(tip.GetString() ?? "");
                }
            }
            
            // Adăugăm imaginea în funcție de tipul dietei
            recipe.ImageUrl = GetImagePathForDietType(recipe.DietType);
            
            return recipe;
        }

        private string GetImagePathForDietType(string dietType)
        {
            return dietType.ToLower() switch
            {
                "carnivor" => $"{_baseImagePath}carnivore.png",
                "vegetarian" => $"{_baseImagePath}vegetarian.png",
                "vegan" => $"{_baseImagePath}vegan.png",
                _ => $"{_baseImagePath}default.png",
            };
        }

        private double CalculateDailyCalories(UserProfile profile)
        {
            // Calculul BMR (Basal Metabolic Rate) folosind formula Harris-Benedict
            double bmr;
            
            if (profile.Sex.ToLower() == "masculin" || profile.Sex.ToLower() == "bărbat")
            {
                bmr = 88.362 + (13.397 * profile.Weight) + (4.799 * profile.Height) - (5.677 * profile.Age);
            }
            else
            {
                bmr = 447.593 + (9.247 * profile.Weight) + (3.098 * profile.Height) - (4.330 * profile.Age);
            }
            
            // Aplicăm factorul de activitate
            double activityFactor = profile.ActivityLevel.ToLower() switch
            {
                "sedentar" => 1.2,
                "ușor activ" => 1.375,
                "moderat activ" => 1.55,
                "foarte activ" => 1.725,
                "extrem de activ" => 1.9,
                _ => 1.2, // valoare implicită
            };
            
            double tdee = bmr * activityFactor; // Total Daily Energy Expenditure
            
            // Ajustăm în funcție de obiectiv
            double adjustedCalories = profile.Objective.ToLower() switch
            {
                "slăbire" => tdee - 500, // deficit pentru slăbire
                "masă musculară" => tdee + 500, // surplus pentru creșterea masei
                _ => tdee, // menținere
            };
            
            return Math.Round(adjustedCalories);
        }
    }
}