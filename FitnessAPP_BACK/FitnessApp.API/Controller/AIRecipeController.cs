using FitnessApp.API.Models;
using FitnessApp.API.Models.DTOs;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIRecipeController : ControllerBase
    {
        private readonly IAIRecipeService _aiRecipeService;
        private readonly IProfileService _profileService;
        private readonly ILogger<AIRecipeController> _logger;

        public AIRecipeController(
            IAIRecipeService aiRecipeService,
            IProfileService profileService,
            ILogger<AIRecipeController> logger)
        {
            _aiRecipeService = aiRecipeService;
            _profileService = profileService;
            _logger = logger;
        }

        // POST: api/AIRecipe/Recommend
        [HttpPost("Recommend")]
        [Authorize]
        public async Task<ActionResult<AIRecipeResponseDto>> GetRecipeRecommendation([FromBody] AIRecipePromptDto promptDto)
        {
            try
            {
                // Validăm datele primite
                if (string.IsNullOrEmpty(promptDto.Ingredients))
                {
                    return BadRequest("Trebuie să specificați cel puțin un ingredient.");
                }

                // Obținem ID-ul utilizatorului din token
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                {
                    return Unauthorized("Token-ul nu conține ID-ul utilizatorului.");
                }

                if (!int.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest("ID-ul utilizatorului din token nu este valid.");
                }

                // Obținem profilul utilizatorului
                var userProfile = await _profileService.GetProfileByUserIdAsync(userId);
                if (userProfile == null)
                {
                    return BadRequest("Utilizatorul nu are un profil creat. Vă rugăm să creați mai întâi un profil.");
                }

                // Obținem recomandarea de rețetă
                var recipeRecommendation = await _aiRecipeService.GetRecipeRecommendationAsync(
                    promptDto.Ingredients, 
                    userProfile);

                return Ok(new AIRecipeResponseDto { Recipe = recipeRecommendation });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea recomandării de rețete");
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // POST: api/AIRecipe/Save
        [HttpPost("Save")]
        [Authorize]
        public async Task<ActionResult<Recipe>> SaveRecipe([FromBody] SaveAIRecipeDto saveDto)
        {
            try
            {
                // Validăm datele primite
                if (string.IsNullOrEmpty(saveDto.RecipeText))
                {
                    return BadRequest("Textul rețetei nu poate fi gol.");
                }

                // Obținem ID-ul utilizatorului din token
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                {
                    return Unauthorized("Token-ul nu conține ID-ul utilizatorului.");
                }

                if (!int.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest("ID-ul utilizatorului din token nu este valid.");
                }

                // Salvăm rețeta în baza de date
                var savedRecipe = await _aiRecipeService.SaveRecipeAsync(saveDto.RecipeText, userId);

                return Ok(savedRecipe);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la salvarea rețetei");
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }
    }
}