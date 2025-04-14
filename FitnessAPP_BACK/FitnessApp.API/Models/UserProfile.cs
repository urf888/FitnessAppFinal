using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FitnessApp.API.Models
{
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [JsonIgnore] // Previne referințe circulare în serializarea JSON
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        [Range(12, 100, ErrorMessage = "Vârsta trebuie să fie între 12 și 100 de ani.")]
        public int Age { get; set; }

        [Required]
        [Range(30, 300, ErrorMessage = "Greutatea trebuie să fie între 30 și 300 kg.")]
        public double Weight { get; set; }

        [Required]
        [Range(100, 250, ErrorMessage = "Înălțimea trebuie să fie între 100 și 250 cm.")]
        public double Height { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "Sexul nu poate depăși 20 de caractere.")]
        public string Sex { get; set; } = string.Empty;

        [Required]
        [StringLength(50, ErrorMessage = "Nivelul de activitate nu poate depăși 50 de caractere.")]
        public string ActivityLevel { get; set; } = string.Empty;

        [Required]
        [StringLength(50, ErrorMessage = "Obiectivul nu poate depăși 50 de caractere.")]
        public string Objective { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Alergiile/restricțiile nu pot depăși 500 de caractere.")]
        public string? AllergiesRestrictions { get; set; }

        [Range(30, 300, ErrorMessage = "Obiectivul de greutate trebuie să fie între 30 și 300 kg.")]
        public double WeightGoal { get; set; }

        // Adăugare câmp pentru dietă
        [StringLength(50, ErrorMessage = "Dieta nu poate depăși 50 de caractere.")]
        public string Diet { get; set; } = string.Empty;

        // Adăugare câmp pentru experiența în fitness
        [StringLength(50, ErrorMessage = "Experiența nu poate depăși 50 de caractere.")]
        public string Experience { get; set; } = string.Empty;
    }
}