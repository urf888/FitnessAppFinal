using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessApp.API.Models
{
    public class Exercise
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100, ErrorMessage = "Numele nu poate depăși 100 de caractere.")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50, ErrorMessage = "Categoria nu poate depăși 50 de caractere.")]
        public string Category { get; set; } = string.Empty; // "piept", "spate", "picioare", "umeri", "brațe", "abdomen", "cardio", etc.
        
        [Required]
        [StringLength(20, ErrorMessage = "Nivelul de dificultate nu poate depăși 20 de caractere.")]
        public string DifficultyLevel { get; set; } = "intermediar"; // "începător", "intermediar", "avansat"
        
        [StringLength(1000, ErrorMessage = "Descrierea nu poate depăși 1000 de caractere.")]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Instrucțiunile nu pot depăși 500 de caractere.")]
        public string Instructions { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "URL-ul imaginii nu poate depăși 200 de caractere.")]
        public string? ImageUrl { get; set; }
        
        [StringLength(200, ErrorMessage = "URL-ul video nu poate depăși 200 de caractere.")]
        public string? VideoUrl { get; set; }
        
        [StringLength(100, ErrorMessage = "Mușchii țintă nu pot depăși 100 de caractere.")]
        public string TargetMuscles { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Mușchii secundari nu pot depăși 100 de caractere.")]
        public string SecondaryMuscles { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Echipamentul nu poate depăși 100 de caractere.")]
        public string Equipment { get; set; } = "nici unul"; // "nici unul", "gantere", "bandă elastică", "bare", etc.
        
        // Relație many-to-many cu WorkoutDay prin ExerciseWorkout
        [JsonIgnore]
        public ICollection<ExerciseWorkout> ExerciseWorkouts { get; set; } = new List<ExerciseWorkout>();
    }
}