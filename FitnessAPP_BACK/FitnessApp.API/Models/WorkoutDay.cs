using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessApp.API.Models
{
    public class WorkoutDay
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ProgramId { get; set; }
        
        [JsonIgnore]
        [ForeignKey("ProgramId")]
        public FitnessProgram? Program { get; set; }
        
        [Required]
        [StringLength(50, ErrorMessage = "Numele nu poate depăși 50 de caractere.")]
        public string Name { get; set; } = string.Empty; // "Ziua 1 - Piept & Triceps", "Ziua 2 - Spate & Biceps", etc.
        
        [Required]
        [Range(1, 7, ErrorMessage = "Ziua săptămânii trebuie să fie între 1 și 7.")]
        public int DayOfWeek { get; set; } // 1 = Luni, 2 = Marți, etc.
        
        [Range(10, 180, ErrorMessage = "Durata trebuie să fie între 10 și 180 de minute.")]
        public int DurationMinutes { get; set; } = 60;
        
        [StringLength(500, ErrorMessage = "Notele nu pot depăși 500 de caractere.")]
        public string? Notes { get; set; }
        
        // Relație many-to-many cu Exercise prin ExerciseWorkout
        public ICollection<ExerciseWorkout> ExerciseWorkouts { get; set; } = new List<ExerciseWorkout>();
    }
}