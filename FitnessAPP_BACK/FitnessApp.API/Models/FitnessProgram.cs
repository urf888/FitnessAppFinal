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
        
        public string Description { get; set; } = string.Empty;
        
        public string ImageUrl { get; set; } = string.Empty;
    }
}