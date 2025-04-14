using System.ComponentModel.DataAnnotations;

namespace FitnessApp.API.Models.DTOs
{
    /// <summary>
    /// DTO pentru recomandările de rețete
    /// </summary>
    public class RecipeRecommendationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PrepTime { get; set; }
        public int Servings { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fat { get; set; }
        public int Fiber { get; set; }
        public int Sugar { get; set; }
        public string DietType { get; set; } = string.Empty;
        public string Objective { get; set; } = string.Empty;
        public string ProteinContent { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> Ingredients { get; set; } = new List<string>();
        public List<string> Steps { get; set; } = new List<string>();
        public List<string> Tips { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO pentru planul de mese zilnic
    /// </summary>
    public class DailyMealRecommendationDto
    {
        public List<RecipeRecommendationDto> Breakfast { get; set; } = new List<RecipeRecommendationDto>();
        public List<RecipeRecommendationDto> MorningSnack { get; set; } = new List<RecipeRecommendationDto>();
        public List<RecipeRecommendationDto> Lunch { get; set; } = new List<RecipeRecommendationDto>();
        public List<RecipeRecommendationDto> AfternoonSnack { get; set; } = new List<RecipeRecommendationDto>();
        public List<RecipeRecommendationDto> Dinner { get; set; } = new List<RecipeRecommendationDto>();
    }

    /// <summary>
    /// DTO pentru cererea de generare de rețete bazate pe ingrediente
    /// </summary>
    public class RecipesByIngredientsRequestDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "Trebuie să specificați cel puțin un ingredient.")]
        public List<string> Ingredients { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO pentru un răspuns care conține o listă de rețete recomandate
    /// </summary>
    public class RecipeRecommendationsResponseDto
    {
        public List<RecipeRecommendationDto> Recipes { get; set; } = new List<RecipeRecommendationDto>();
    }
}