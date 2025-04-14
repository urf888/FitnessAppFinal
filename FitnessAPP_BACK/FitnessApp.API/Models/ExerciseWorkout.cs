using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.API.Models
{
    public class ExerciseWorkout
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ExerciseId { get; set; }
        
        [ForeignKey("ExerciseId")]
        public Exercise? Exercise { get; set; }
        
        [Required]
        public int WorkoutDayId { get; set; }
        
        [ForeignKey("WorkoutDayId")]
        public WorkoutDay? WorkoutDay { get; set; }
        
        [Range(1, 10, ErrorMessage = "Ordinea trebuie să fie între 1 și 10.")]
        public int Order { get; set; } = 1; // Ordinea în care exercițiile sunt afișate/efectuate
        
        [Range(1, 10, ErrorMessage = "Numărul de seturi trebuie să fie între 1 și 10.")]
        public int Sets { get; set; } = 3; // Numărul de seturi
        
        [Range(1, 100, ErrorMessage = "Numărul de repetări trebuie să fie între 1 și 100.")]
        public int Reps { get; set; } = 10; // Numărul de repetări
        
        [StringLength(50, ErrorMessage = "Durata nu poate depăși 50 de caractere.")]
        public string? Duration { get; set; } // Pentru exerciții bazate pe timp în loc de repetări
        
        [Range(0, 1000, ErrorMessage = "Greutatea trebuie să fie între 0 și 1000 kg.")]
        public double? Weight { get; set; } // Greutate recomandată, dacă e cazul
        
        [StringLength(200, ErrorMessage = "Notele nu pot depăși 200 de caractere.")]
        public string? Notes { get; set; } // Note specifice pentru acest exercițiu în acest antrenament
        
        [StringLength(50, ErrorMessage = "Tehnica nu poate depăși 50 de caractere.")]
        public string? Technique { get; set; } // "drop set", "superset", "circuit", etc.
        
        [Range(0, 300, ErrorMessage = "Pauza trebuie să fie între 0 și 300 de secunde.")]
        public int RestSeconds { get; set; } = 60; // Pauza recomandată între seturi
    }
}