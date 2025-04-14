using FitnessApp.API.Models;
using FitnessApp.API.Models.DTOs;

namespace FitnessApp.API.Services
{
    public interface IRecipeService
    {
        Task<IEnumerable<Recipe>> GetAllRawRecipesAsync();
        
        // Obține toate rețetele (eventual filtrate), cu parametru opțional pentru userId
        Task<IEnumerable<RecipeListDto>> GetAllRecipesAsync(RecipeFilterDto? filter = null, int? userId = null);
        
        // Obține o rețetă după ID
        Task<Recipe?> GetRecipeByIdAsync(int id);
        
        // Obține rețete după tipul de dietă
        Task<IEnumerable<RecipeListDto>> GetRecipesByDietTypeAsync(string dietType);
        
        // Obține rețete după obiectiv
        Task<IEnumerable<RecipeListDto>> GetRecipesByObjectiveAsync(string objective);
        
        // Obține rețete după conținutul proteic
        Task<IEnumerable<RecipeListDto>> GetRecipesByProteinContentAsync(string proteinContent);
        
        // Obține rețete recomandate pentru un anumit profil de utilizator
        Task<IEnumerable<RecipeListDto>> GetRecommendedRecipesAsync(int userId, int count = 3);
        
        // Creează o rețetă nouă
        Task<Recipe> CreateRecipeAsync(CreateRecipeDto recipeDto);
        
        // Actualizează o rețetă existentă
        Task<Recipe?> UpdateRecipeAsync(int id, UpdateRecipeDto recipeDto);
        
        // Șterge o rețetă
        Task<bool> DeleteRecipeAsync(int id);
        
        // Verifică dacă o rețetă cu un anumit ID există
        Task<bool> RecipeExistsAsync(int id);
        
        // Caută rețete după termen
        Task<IEnumerable<RecipeListDto>> SearchRecipesAsync(string searchTerm);
        
        // Validează dietType
        bool IsValidDietType(string dietType);
        
        // Validează objective
        bool IsValidObjective(string objective);
        
        // Validează proteinContent
        bool IsValidProteinContent(string proteinContent);
        
        // Metode noi pentru favorite
        Task<bool> AddFavoriteAsync(int userId, int recipeId);
        Task<bool> RemoveFavoriteAsync(int userId, int recipeId);
        Task<bool> IsFavoriteAsync(int userId, int recipeId);
        Task<IEnumerable<RecipeListDto>> GetFavoriteRecipesAsync(int userId);
    }
}