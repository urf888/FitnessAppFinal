using System.ComponentModel.DataAnnotations;

namespace FitnessApp.API.Models.DTOs
{
    // DTO pentru crearea unei rețete
    public class CreateRecipeDto
    {
        [Required]
        [StringLength(100, ErrorMessage = "Titlul nu poate depăși 100 de caractere.")]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Descrierea nu poate depăși 1000 de caractere.")]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "URL-ul imaginii nu poate depăși 200 de caractere.")]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Range(1, 300, ErrorMessage = "Timpul de preparare trebuie să fie între 1 și 300 de minute.")]
        public int PrepTime { get; set; } = 30;
        
        [Range(1, 20, ErrorMessage = "Numărul de porții trebuie să fie între 1 și 20.")]
        public int Servings { get; set; } = 2;
        
        [Range(0, 2000, ErrorMessage = "Numărul de calorii trebuie să fie între 0 și 2000.")]
        public int Calories { get; set; }
        
        [Range(0, 200, ErrorMessage = "Cantitatea de proteine trebuie să fie între 0 și 200 grame.")]
        public int Protein { get; set; }
        
        [Range(0, 200, ErrorMessage = "Cantitatea de carbohidrați trebuie să fie între 0 și 200 grame.")]
        public int Carbs { get; set; }
        
        [Range(0, 200, ErrorMessage = "Cantitatea de grăsimi trebuie să fie între 0 și 200 grame.")]
        public int Fat { get; set; }
        
        [Range(0, 100, ErrorMessage = "Cantitatea de fibre trebuie să fie între 0 și 100 grame.")]
        public int Fiber { get; set; }
        
        [Range(0, 100, ErrorMessage = "Cantitatea de zahăr trebuie să fie între 0 și 100 grame.")]
        public int Sugar { get; set; }
        
        [Required]
        [StringLength(20, ErrorMessage = "Tipul dietei nu poate depăși 20 de caractere.")]
        public string DietType { get; set; } = "carnivor"; // carnivor, vegetarian, vegan
        
        [Required]
        [StringLength(20, ErrorMessage = "Obiectivul nu poate depăși 20 de caractere.")]
        public string Objective { get; set; } = "fit"; // masă, slăbit, fit
        
        [Required]
        [StringLength(20, ErrorMessage = "Conținutul proteic nu poate depăși 20 de caractere.")]
        public string ProteinContent { get; set; } = "normal"; // normal, ridicat
        
        [Required]
        public List<string> Ingredients { get; set; } = new List<string>();
        
        [Required]
        public List<string> Steps { get; set; } = new List<string>();
        
        public List<string> Tips { get; set; } = new List<string>();
    }

    // DTO pentru actualizarea unei rețete
    public class UpdateRecipeDto : CreateRecipeDto
    {
        // Folosește aceleași proprietăți ca CreateRecipeDto
    }

    // DTO pentru răspunsuri filtrate/rezumate ale rețetelor
    public class RecipeListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int PrepTime { get; set; }
        public int Calories { get; set; }
        public int Protein { get; set; }
        public int Carbs { get; set; }
        public int Fat { get; set; }
        public int Fiber { get; set; }
        public int Sugar { get; set; }
        public string DietType { get; set; } = string.Empty;
        public string Objective { get; set; } = string.Empty;
        public string ProteinContent { get; set; } = string.Empty;

        public List<string> Ingredients { get; set; } = new List<string>();
        public List<string> Steps { get; set; } = new List<string>();
        public List<string> Tips { get; set; } = new List<string>();
        
        // Adăugăm proprietate pentru a marca dacă rețeta este favorită
        public bool IsFavorite { get; set; } = false;
    }

    // DTO pentru filtrare și căutare
    public class RecipeFilterDto
    {
        public string? DietType { get; set; } // carnivor, vegetarian, vegan
        public string? Objective { get; set; } // masă, slăbit, fit
        public string? ProteinContent { get; set; } // normal, ridicat
        public int? MaxCalories { get; set; }
        public int? MinProtein { get; set; }
        public int? MaxPrepTime { get; set; }
        public string? SearchTerm { get; set; }
        
        // Adăugăm proprietate pentru filtrarea favoritelor
        public bool FavoritesOnly { get; set; } = false;
    }
}