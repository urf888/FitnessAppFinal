using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitnessApp.API.Models
{
    public class UserFavoriteRecipe
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int RecipeId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [ForeignKey("RecipeId")]
        public Recipe? Recipe { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}