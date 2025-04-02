using System.ComponentModel.DataAnnotations;

namespace FitnessApp.API.Models
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Numele de utilizator trebuie să aibă între 3 și 50 de caractere.")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Parola trebuie să aibă cel puțin 6 caractere.")]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public User User { get; set; } = null!;
    }
}