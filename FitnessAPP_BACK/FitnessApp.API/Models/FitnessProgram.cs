using System.ComponentModel.DataAnnotations;

namespace FitnessApp.API.Models
{
    public class FitnessProgram
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100, ErrorMessage = "Numele nu poate depăși 100 de caractere.")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20, ErrorMessage = "Genul nu poate depăși 20 de caractere.")]
        public string Gender { get; set; } = string.Empty;  // "femeie", "barbat", "unisex"
        
        [Required]
        [StringLength(20, ErrorMessage = "Dieta nu poate depăși 20 de caractere.")]
        public string Diet { get; set; } = string.Empty;    // "carnivor", "vegan", "vegetarian"
        
        [Required]
        [StringLength(20, ErrorMessage = "Tipul programului nu poate depăși 20 de caractere.")]
        public string ProgramType { get; set; } = string.Empty;  // "fit", "slabit", "masa"
        
        [StringLength(1000, ErrorMessage = "Descrierea nu poate depăși 1000 de caractere.")]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "URL-ul imaginii nu poate depăși 200 de caractere.")]
        public string ImageUrl { get; set; } = string.Empty;
        
        // Proprietăți noi adăugate
        [StringLength(20, ErrorMessage = "Nivelul de dificultate nu poate depăși 20 de caractere.")]
        public string DifficultyLevel { get; set; } = "intermediar"; // "începător", "intermediar", "avansat"
        
        [Range(1, 52, ErrorMessage = "Durata programului trebuie să fie între 1 și 52 de săptămâni.")]
        public int DurationWeeks { get; set; } = 8;
        
        [Range(1, 7, ErrorMessage = "Numărul de antrenamente pe săptămână trebuie să fie între 1 și 7.")]
        public int WorkoutsPerWeek { get; set; } = 4;
        
        [Range(15, 120, ErrorMessage = "Intervalul de vârstă minim trebuie să fie între 15 și 120 de ani.")]
        public int? AgeRangeMin { get; set; } // Vârsta minimă recomandată (opțional)
        
        [Range(15, 120, ErrorMessage = "Intervalul de vârstă maxim trebuie să fie între 15 și 120 de ani.")]
        public int? AgeRangeMax { get; set; } // Vârsta maximă recomandată (opțional)
        
        [StringLength(500, ErrorMessage = "Obiectivele nu pot depăși 500 de caractere.")]
        public string Goals { get; set; } = string.Empty; // Obiectivele specifice ale programului
        
        [StringLength(500, ErrorMessage = "Echipamentul necesar nu poate depăși 500 de caractere.")]
        public string RequiredEquipment { get; set; } = string.Empty; // Echipamentul necesar
        
        // Relație one-to-many cu WorkoutDay
        public ICollection<WorkoutDay> WorkoutDays { get; set; } = new List<WorkoutDay>();
    }
}