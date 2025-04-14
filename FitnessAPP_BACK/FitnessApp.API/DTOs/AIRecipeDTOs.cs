using System.ComponentModel.DataAnnotations;

namespace FitnessApp.API.Models.DTOs
{
    public class AIRecipePromptDto
    {
        [Required]
        public string Ingredients { get; set; } = string.Empty;
    }

    public class AIRecipeResponseDto
    {
        public string Recipe { get; set; } = string.Empty;
    }

    public class SaveAIRecipeDto
    {
        [Required]
        public string RecipeText { get; set; } = string.Empty;
        
        public int? UserId { get; set; }
    }

    // DTO pentru parsarea textului rețetei în câmpuri structurate
    public class ParsedRecipeDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int PrepTime { get; set; } = 30;
        public int Servings { get; set; } = 2;
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fat { get; set; }
        public List<string> Ingredients { get; set; } = new List<string>();
        public List<string> Steps { get; set; } = new List<string>();
        public List<string> Tips { get; set; } = new List<string>();
        public string DietType { get; set; } = "carnivor";
        public string Objective { get; set; } = "fit";
        public string ProteinContent { get; set; } = "normal";
    }
}