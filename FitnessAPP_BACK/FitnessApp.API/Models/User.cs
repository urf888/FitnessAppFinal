using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitnessApp.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [JsonIgnore] // Nu expunem hash-ul parolei în răspunsurile API
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = "user"; // Valori posibile: "user", "admin"
        
        // Navigational property
        public UserProfile? Profile { get; set; }
    }
}