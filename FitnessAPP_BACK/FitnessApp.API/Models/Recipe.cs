using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessApp.API.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }
        
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
        
        // Tipul dietei: "carnivor", "vegetarian", "vegan"
        [Required]
        [StringLength(20, ErrorMessage = "Tipul dietei nu poate depăși 20 de caractere.")]
        public string DietType { get; set; } = "carnivor";
        
        // Obiectivul: "masă", "slăbit", "fit" 
        [Required]
        [StringLength(20, ErrorMessage = "Obiectivul nu poate depăși 20 de caractere.")]
        public string Objective { get; set; } = "fit";
        
        // Conținut proteic: "normal", "ridicat"
        [Required]
        [StringLength(20, ErrorMessage = "Conținutul proteic nu poate depăși 20 de caractere.")]
        public string ProteinContent { get; set; } = "normal";
        
        // Lista de ingrediente
        public List<string> Ingredients { get; set; } = new List<string>();
        
        // Pașii de preparare
        public List<string> Steps { get; set; } = new List<string>();
        
        // Sfaturi și trucuri
        public List<string> Tips { get; set; } = new List<string>();
        
        // Data adăugării
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Data ultimei modificări
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}