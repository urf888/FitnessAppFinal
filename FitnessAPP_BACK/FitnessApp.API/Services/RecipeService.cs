using FitnessApp.API.Data;
using FitnessApp.API.Models;
using FitnessApp.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly AppDbContext _context;
        private readonly IProfileService _profileService;
        private readonly ILogger<RecipeService> _logger;

        // Lista de tipuri de dietă valide
        private static readonly string[] ValidDietTypes = { "carnivor", "vegetarian", "vegan" };

        // Lista de obiective valide
        private static readonly string[] ValidObjectives = { "masă", "slăbit", "fit" };

        // Lista de conținut proteic valid
        private static readonly string[] ValidProteinContents = { "normal", "ridicat" };

        public RecipeService(
            AppDbContext context,
            IProfileService profileService,
            ILogger<RecipeService> logger)
        {
            _context = context;
            _profileService = profileService;
            _logger = logger;
        }
        public async Task<IEnumerable<Recipe>> GetAllRawRecipesAsync()
        {
            try
            {
                return await _context.Recipes.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea tuturor rețetelor");
                throw new Exception("Nu s-au putut obține toate rețetele", ex);
            }
        }
        
        public async Task<IEnumerable<RecipeListDto>> GetAllRecipesAsync(RecipeFilterDto? filter = null, int? userId = null)
        {
            try
            {
                IQueryable<Recipe> query = _context.Recipes;

                // Aplicare filtre dacă există
                if (filter != null)
                {
                    // Filtru după tipul de dietă
                    if (!string.IsNullOrEmpty(filter.DietType) && IsValidDietType(filter.DietType))
                    {
                        query = query.Where(r => r.DietType.ToLower() == filter.DietType.ToLower());
                    }

                    // Filtru după obiectiv
                    if (!string.IsNullOrEmpty(filter.Objective) && IsValidObjective(filter.Objective))
                    {
                        query = query.Where(r => r.Objective.ToLower() == filter.Objective.ToLower());
                    }

                    // Filtru după conținut proteic
                    if (!string.IsNullOrEmpty(filter.ProteinContent) && IsValidProteinContent(filter.ProteinContent))
                    {
                        query = query.Where(r => r.ProteinContent.ToLower() == filter.ProteinContent.ToLower());
                    }

                    // Filtru după calorii maxime
                    if (filter.MaxCalories.HasValue)
                    {
                        query = query.Where(r => r.Calories <= filter.MaxCalories.Value);
                    }

                    // Filtru după proteine minime
                    if (filter.MinProtein.HasValue)
                    {
                        query = query.Where(r => r.Protein >= filter.MinProtein.Value);
                    }

                    // Filtru după timp maxim de preparare
                    if (filter.MaxPrepTime.HasValue)
                    {
                        query = query.Where(r => r.PrepTime <= filter.MaxPrepTime.Value);
                    }

                    // Filtrare după termen de căutare
                    if (!string.IsNullOrEmpty(filter.SearchTerm))
                    {
                        string searchTerm = filter.SearchTerm.ToLower();
                        query = query.Where(r =>
                            r.Title.ToLower().Contains(searchTerm) ||
                            r.Description.ToLower().Contains(searchTerm));
                    }
                    
                    // Filtru pentru favorite - dacă este specificat
                    if (filter.FavoritesOnly && userId.HasValue)
                    {
                        var favoriteRecipeIds = await _context.UserFavoriteRecipes
                            .Where(f => f.UserId == userId.Value)
                            .Select(f => f.RecipeId)
                            .ToListAsync();
                            
                        query = query.Where(r => favoriteRecipeIds.Contains(r.Id));
                    }
                }

                // Dacă avem un utilizator, obținem informații despre favorite
                List<int> userFavorites = new List<int>();
                if (userId.HasValue)
                {
                    userFavorites = await _context.UserFavoriteRecipes
                        .Where(f => f.UserId == userId.Value)
                        .Select(f => f.RecipeId)
                        .ToListAsync();
                }

                // Proiectare rezultate către DTO
                var recipes = await query
                    .Select(r => new RecipeListDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        ImageUrl = r.ImageUrl,
                        PrepTime = r.PrepTime,
                        Calories = r.Calories,
                        Protein = r.Protein,
                        DietType = r.DietType,
                        Objective = r.Objective,
                        ProteinContent = r.ProteinContent,
                        IsFavorite = userFavorites.Contains(r.Id)
                    })
                    .ToListAsync();

                return recipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor");
                throw new Exception("Nu s-au putut obține rețetele", ex);
            }
        }

        public async Task<Recipe?> GetRecipeByIdAsync(int id)
        {
            try
            {
                return await _context.Recipes.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetei cu ID-ul {RecipeId}", id);
                throw new Exception($"Nu s-a putut obține rețeta cu ID-ul {id}", ex);
            }
        }

        public async Task<IEnumerable<RecipeListDto>> GetRecipesByDietTypeAsync(string dietType)
        {
            if (!IsValidDietType(dietType))
            {
                throw new ArgumentException($"Tipul de dietă '{dietType}' nu este valid. Valori acceptate: {string.Join(", ", ValidDietTypes)}");
            }

            try
            {
                var recipes = await _context.Recipes
                    .Where(r => r.DietType.ToLower() == dietType.ToLower())
                    .Select(r => new RecipeListDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        ImageUrl = r.ImageUrl,
                        PrepTime = r.PrepTime,
                        Calories = r.Calories,
                        Protein = r.Protein,
                        DietType = r.DietType,
                        Objective = r.Objective,
                        ProteinContent = r.ProteinContent
                    })
                    .ToListAsync();

                return recipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor după tipul de dietă {DietType}", dietType);
                throw new Exception($"Nu s-au putut obține rețetele pentru tipul de dietă {dietType}", ex);
            }
        }

        public async Task<IEnumerable<RecipeListDto>> GetRecipesByObjectiveAsync(string objective)
        {
            if (!IsValidObjective(objective))
            {
                throw new ArgumentException($"Obiectivul '{objective}' nu este valid. Valori acceptate: {string.Join(", ", ValidObjectives)}");
            }

            try
            {
                var recipes = await _context.Recipes
                    .Where(r => r.Objective.ToLower() == objective.ToLower())
                    .Select(r => new RecipeListDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        ImageUrl = r.ImageUrl,
                        PrepTime = r.PrepTime,
                        Calories = r.Calories,
                        Protein = r.Protein,
                        DietType = r.DietType,
                        Objective = r.Objective,
                        ProteinContent = r.ProteinContent
                    })
                    .ToListAsync();

                return recipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor după obiectivul {Objective}", objective);
                throw new Exception($"Nu s-au putut obține rețetele pentru obiectivul {objective}", ex);
            }
        }

        public async Task<IEnumerable<RecipeListDto>> GetRecipesByProteinContentAsync(string proteinContent)
        {
            if (!IsValidProteinContent(proteinContent))
            {
                throw new ArgumentException($"Conținutul proteic '{proteinContent}' nu este valid. Valori acceptate: {string.Join(", ", ValidProteinContents)}");
            }

            try
            {
                var recipes = await _context.Recipes
                    .Where(r => r.ProteinContent.ToLower() == proteinContent.ToLower())
                    .Select(r => new RecipeListDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        ImageUrl = r.ImageUrl,
                        PrepTime = r.PrepTime,
                        Calories = r.Calories,
                        Protein = r.Protein,
                        DietType = r.DietType,
                        Objective = r.Objective,
                        ProteinContent = r.ProteinContent
                    })
                    .ToListAsync();

                return recipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor după conținutul proteic {ProteinContent}", proteinContent);
                throw new Exception($"Nu s-au putut obține rețetele pentru conținutul proteic {proteinContent}", ex);
            }
        }

        public async Task<IEnumerable<RecipeListDto>> GetRecommendedRecipesAsync(int userId, int count = 3)
        {
            try
            {
                // Obținem profilul utilizatorului
                var userProfile = await _profileService.GetProfileByUserIdAsync(userId);
                if (userProfile == null)
                {
                    throw new InvalidOperationException("Utilizatorul nu are un profil creat");
                }

                // Mapăm dieta din profil
                string diet = userProfile.Diet.ToLower();
                // Mapăm obiectivul din profil
                string objective = MapObjectiveToRecipeObjective(userProfile.Objective);

                // Obținem rețete care se potrivesc cu dieta și obiectivul utilizatorului
                var query = _context.Recipes.AsQueryable();

                // Filtru după dietă - trebuie să se potrivească exact
                if (diet == "omnivore")
                {
                    // Dacă utilizatorul este omnivor, poate consuma orice rețetă
                    query = query.Where(r => r.DietType == "carnivor" || r.DietType == "vegetarian" || r.DietType == "vegan");
                }
                else if (diet == "vegetarian")
                {
                    // Dacă utilizatorul este vegetarian, poate consuma rețete vegetariene și vegane
                    query = query.Where(r => r.DietType == "vegetarian" || r.DietType == "vegan");
                }
                else if (diet == "vegan")
                {
                    // Dacă utilizatorul este vegan, poate consuma doar rețete vegane
                    query = query.Where(r => r.DietType == "vegan");
                }

                // Filtrare după obiectiv
                query = query.Where(r => r.Objective == objective);

                // Pentru utilizatorii care doresc să crească masa musculară, prioritizam conținutul proteic ridicat
                if (objective == "masă")
                {
                    query = query.OrderByDescending(r => r.ProteinContent == "ridicat")
                              .ThenByDescending(r => r.Protein);
                }
                // Pentru utilizatorii care doresc să slăbească, prioritizam caloriile mai mici
                else if (objective == "slăbit")
                {
                    query = query.OrderBy(r => r.Calories)
                              .ThenByDescending(r => r.Protein);
                }
                // Pentru menținere, prioritizam echilibrul nutrițional
                else
                {
                    query = query.OrderBy(r => Math.Abs((r.Protein * 4 + r.Carbs * 4 + r.Fat * 9) - r.Calories));
                }

                // Verificăm dacă rețetele sunt favorite pentru utilizator
                var favoriteRecipeIds = await _context.UserFavoriteRecipes
                    .Where(f => f.UserId == userId)
                    .Select(f => f.RecipeId)
                    .ToListAsync();

                // Obținem rețetele recomandate
                var recommendedRecipes = await query
                    .Take(count)
                    .Select(r => new RecipeListDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        ImageUrl = r.ImageUrl,
                        PrepTime = r.PrepTime,
                        Calories = r.Calories,
                        Protein = r.Protein,
                        DietType = r.DietType,
                        Objective = r.Objective,
                        ProteinContent = r.ProteinContent,
                        IsFavorite = favoriteRecipeIds.Contains(r.Id)
                    })
                    .ToListAsync();

                return recommendedRecipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor recomandate pentru utilizatorul {UserId}", userId);
                throw new Exception($"Nu s-au putut obține rețetele recomandate", ex);
            }
        }

        public async Task<Recipe> CreateRecipeAsync(CreateRecipeDto recipeDto)
        {
            // Validare tipul dietei
            if (!IsValidDietType(recipeDto.DietType))
            {
                throw new ArgumentException($"Tipul de dietă '{recipeDto.DietType}' nu este valid. Valori acceptate: {string.Join(", ", ValidDietTypes)}");
            }

            // Validare obiectiv
            if (!IsValidObjective(recipeDto.Objective))
            {
                throw new ArgumentException($"Obiectivul '{recipeDto.Objective}' nu este valid. Valori acceptate: {string.Join(", ", ValidObjectives)}");
            }

            // Validare conținut proteic
            if (!IsValidProteinContent(recipeDto.ProteinContent))
            {
                throw new ArgumentException($"Conținutul proteic '{recipeDto.ProteinContent}' nu este valid. Valori acceptate: {string.Join(", ", ValidProteinContents)}");
            }

            try
            {
                var newRecipe = new Recipe
                {
                    Title = recipeDto.Title,
                    Description = recipeDto.Description,
                    ImageUrl = recipeDto.ImageUrl,
                    PrepTime = recipeDto.PrepTime,
                    Servings = recipeDto.Servings,
                    Calories = recipeDto.Calories,
                    Protein = recipeDto.Protein,
                    Carbs = recipeDto.Carbs,
                    Fat = recipeDto.Fat,
                    Fiber = recipeDto.Fiber,
                    Sugar = recipeDto.Sugar,
                    DietType = recipeDto.DietType,
                    Objective = recipeDto.Objective,
                    ProteinContent = recipeDto.ProteinContent,
                    Ingredients = recipeDto.Ingredients,
                    Steps = recipeDto.Steps,
                    Tips = recipeDto.Tips,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _context.Recipes.Add(newRecipe);
                await _context.SaveChangesAsync();

                return newRecipe;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la crearea rețetei {RecipeTitle}", recipeDto.Title);
                throw new Exception("Nu s-a putut crea rețeta", ex);
            }
        }

        public async Task<Recipe?> UpdateRecipeAsync(int id, UpdateRecipeDto recipeDto)
        {
            // Validare tipul dietei
            if (!IsValidDietType(recipeDto.DietType))
            {
                throw new ArgumentException($"Tipul de dietă '{recipeDto.DietType}' nu este valid. Valori acceptate: {string.Join(", ", ValidDietTypes)}");
            }

            // Validare obiectiv
            if (!IsValidObjective(recipeDto.Objective))
            {
                throw new ArgumentException($"Obiectivul '{recipeDto.Objective}' nu este valid. Valori acceptate: {string.Join(", ", ValidObjectives)}");
            }

            // Validare conținut proteic
            if (!IsValidProteinContent(recipeDto.ProteinContent))
            {
                throw new ArgumentException($"Conținutul proteic '{recipeDto.ProteinContent}' nu este valid. Valori acceptate: {string.Join(", ", ValidProteinContents)}");
            }

            try
            {
                var existingRecipe = await _context.Recipes.FindAsync(id);
                if (existingRecipe == null)
                {
                    return null;
                }

                // Actualizăm proprietățile
                existingRecipe.Title = recipeDto.Title;
                existingRecipe.Description = recipeDto.Description;
                existingRecipe.ImageUrl = recipeDto.ImageUrl;
                existingRecipe.PrepTime = recipeDto.PrepTime;
                existingRecipe.Servings = recipeDto.Servings;
                existingRecipe.Calories = recipeDto.Calories;
                existingRecipe.Protein = recipeDto.Protein;
                existingRecipe.Carbs = recipeDto.Carbs;
                existingRecipe.Fat = recipeDto.Fat;
                existingRecipe.Fiber = recipeDto.Fiber;
                existingRecipe.Sugar = recipeDto.Sugar;
                existingRecipe.DietType = recipeDto.DietType;
                existingRecipe.Objective = recipeDto.Objective;
                existingRecipe.ProteinContent = recipeDto.ProteinContent;
                existingRecipe.Ingredients = recipeDto.Ingredients;
                existingRecipe.Steps = recipeDto.Steps;
                existingRecipe.Tips = recipeDto.Tips;
                existingRecipe.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                return existingRecipe;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la actualizarea rețetei cu ID-ul {RecipeId}", id);
                throw new Exception($"Nu s-a putut actualiza rețeta cu ID-ul {id}", ex);
            }
        }

        public async Task<bool> DeleteRecipeAsync(int id)
        {
            try
            {
                var recipe = await _context.Recipes.FindAsync(id);
                if (recipe == null)
                {
                    return false;
                }

                _context.Recipes.Remove(recipe);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la ștergerea rețetei cu ID-ul {RecipeId}", id);
                throw new Exception($"Nu s-a putut șterge rețeta cu ID-ul {id}", ex);
            }
        }

        public async Task<bool> RecipeExistsAsync(int id)
        {
            return await _context.Recipes.AnyAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<RecipeListDto>> SearchRecipesAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return new List<RecipeListDto>();
            }

            try
            {
                searchTerm = searchTerm.ToLower();
                var recipes = await _context.Recipes
                    .Where(r =>
                        r.Title.ToLower().Contains(searchTerm) ||
                        r.Description.ToLower().Contains(searchTerm))
                    .Select(r => new RecipeListDto
                    {
                        Id = r.Id,
                        Title = r.Title,
                        Description = r.Description,
                        ImageUrl = r.ImageUrl,
                        PrepTime = r.PrepTime,
                        Calories = r.Calories,
                        Protein = r.Protein,
                        DietType = r.DietType,
                        Objective = r.Objective,
                        ProteinContent = r.ProteinContent
                    })
                    .ToListAsync();

                return recipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la căutarea rețetelor după termenul {SearchTerm}", searchTerm);
                throw new Exception($"Nu s-au putut căuta rețetele după termenul {searchTerm}", ex);
            }
        }

        public bool IsValidDietType(string dietType)
        {
            return ValidDietTypes.Contains(dietType.ToLower());
        }

        public bool IsValidObjective(string objective)
        {
            return ValidObjectives.Contains(objective.ToLower());
        }

        public bool IsValidProteinContent(string proteinContent)
        {
            return ValidProteinContents.Contains(proteinContent.ToLower());
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

        // Implementarea metodelor pentru favorite
        public async Task<bool> AddFavoriteAsync(int userId, int recipeId)
        {
            try
            {
                // Verificăm dacă rețeta există
                if (!await RecipeExistsAsync(recipeId))
                {
                    return false;
                }
                
                // Verificăm dacă relația deja există
                var existingFavorite = await _context.UserFavoriteRecipes
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.RecipeId == recipeId);
                    
                if (existingFavorite != null)
                {
                    // Rețeta este deja favorită
                    return true;
                }
                
                // Adăugăm rețeta la favorite
                var favorite = new UserFavoriteRecipe
                {
                    UserId = userId,
                    RecipeId = recipeId,
                    CreatedAt = DateTime.Now
                };
                
                _context.UserFavoriteRecipes.Add(favorite);
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la adăugarea rețetei cu ID-ul {RecipeId} la favoritele utilizatorului {UserId}", recipeId, userId);
                throw new Exception($"Nu s-a putut adăuga rețeta la favorite", ex);
            }
        }

        public async Task<bool> RemoveFavoriteAsync(int userId, int recipeId)
        {
            try
            {
                // Găsim relația
                var favorite = await _context.UserFavoriteRecipes
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.RecipeId == recipeId);
                    
                if (favorite == null)
                {
                    // Rețeta nu este în favorite
                    return false;
                }
                
                // Eliminăm din favorite
                _context.UserFavoriteRecipes.Remove(favorite);
                await _context.SaveChangesAsync();
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la eliminarea rețetei cu ID-ul {RecipeId} din favoritele utilizatorului {UserId}", recipeId, userId);
                throw new Exception($"Nu s-a putut elimina rețeta din favorite", ex);
            }
        }

        public async Task<bool> IsFavoriteAsync(int userId, int recipeId)
        {
            try
            {
                // Verificăm dacă rețeta este favorită
                return await _context.UserFavoriteRecipes
                    .AnyAsync(f => f.UserId == userId && f.RecipeId == recipeId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la verificarea dacă rețeta cu ID-ul {RecipeId} este favorită pentru utilizatorul {UserId}", recipeId, userId);
                throw new Exception($"Nu s-a putut verifica dacă rețeta este favorită", ex);
            }
        }

        public async Task<IEnumerable<RecipeListDto>> GetFavoriteRecipesAsync(int userId)
        {
            try
            {
                // Obținem rețetele favorite ale utilizatorului
                var favoriteRecipes = await _context.UserFavoriteRecipes
                    .Where(f => f.UserId == userId)
                    .Include(f => f.Recipe)
                    .Select(f => new RecipeListDto
                    {
                        Id = f.Recipe.Id,
                        Title = f.Recipe.Title,
                        Description = f.Recipe.Description,
                        ImageUrl = f.Recipe.ImageUrl,
                        PrepTime = f.Recipe.PrepTime,
                        Calories = f.Recipe.Calories,
                        Protein = f.Recipe.Protein,
                        DietType = f.Recipe.DietType,
                        Objective = f.Recipe.Objective,
                        ProteinContent = f.Recipe.ProteinContent,
                        IsFavorite = true
                    })
                    .ToListAsync();
                    
                return favoriteRecipes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor favorite pentru utilizatorul {UserId}", userId);
                throw new Exception($"Nu s-au putut obține rețetele favorite", ex);
            }
        }
    }
}