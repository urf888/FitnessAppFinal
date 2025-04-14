using FitnessApp.API.Models.DTOs;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Toate endpoint-urile necesită autentificare
    public class MealRecommendationController : ControllerBase
    {
        private readonly IMealRecommendationService _mealRecommendationService;
        private readonly ILogger<MealRecommendationController> _logger;

        public MealRecommendationController(
            IMealRecommendationService mealRecommendationService,
            ILogger<MealRecommendationController> logger)
        {
            _mealRecommendationService = mealRecommendationService;
            _logger = logger;
        }

        /// <summary>
        /// Generează un plan de mese zilnic personalizat pentru utilizatorul autentificat
        /// </summary>
        /// <returns>Un plan de mese zilnic cu opțiuni pentru fiecare masă</returns>
        [HttpGet("daily-plan")]
        public async Task<ActionResult<DailyMealRecommendationDto>> GetDailyMealPlan()
        {
            try
            {
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

                var mealPlan = await _mealRecommendationService.GenerateDailyMealPlanAsync(userId);
                return Ok(mealPlan);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Operație invalidă la generarea planului de mese");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la generarea planului de mese");
                return StatusCode(500, "A apărut o eroare la generarea planului de mese. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        /// <summary>
        /// Generează rețete bazate pe ingredientele specificate
        /// </summary>
        /// <param name="request">Cererea care conține lista de ingrediente</param>
        /// <returns>O listă de rețete recomandate</returns>
        [HttpPost("by-ingredients")]
        public async Task<ActionResult<RecipeRecommendationsResponseDto>> GetRecipesByIngredients([FromBody] RecipesByIngredientsRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
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

                if (request.Ingredients.Count == 0)
                {
                    return BadRequest("Trebuie să specificați cel puțin un ingredient.");
                }

                var recipes = await _mealRecommendationService.GenerateRecipesByIngredientsAsync(userId, request.Ingredients);
                
                var response = new RecipeRecommendationsResponseDto
                {
                    Recipes = recipes
                };
                
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Operație invalidă la generarea rețetelor bazate pe ingrediente");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la generarea rețetelor bazate pe ingrediente");
                return StatusCode(500, "A apărut o eroare la generarea rețetelor. Vă rugăm să încercați din nou mai târziu.");
            }
        }
    }
}