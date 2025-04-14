using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FitnessApp.API.Models;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;
        private readonly ILogger<RecommendationController> _logger;

        public RecommendationController(
            IRecommendationService recommendationService,
            ILogger<RecommendationController> logger)
        {
            _recommendationService = recommendationService;
            _logger = logger;
        }

        // GET: api/Recommendation/personalized
        [HttpGet("personalized")]
        [Authorize]
        public async Task<ActionResult<FitnessProgram>> GetPersonalizedProgram()
        {
            try
            {
                // Extrage ID-ul utilizatorului din token
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                    return Unauthorized("Token-ul nu conține ID-ul utilizatorului.");

                if (!int.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("ID-ul utilizatorului din token nu este valid.");

                _logger.LogInformation("Cerere pentru program personalizat de la userId: {UserId}", userId);
                
                // Obține programul personalizat
                var personalizedProgram = await _recommendationService.GetPersonalizedProgramAsync(userId);
                
                return Ok(personalizedProgram);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Eroare operațională la generarea programului personalizat");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare neașteptată la generarea programului personalizat");
                return StatusCode(500, "A apărut o eroare la generarea programului personalizat. Încercați din nou mai târziu.");
            }
        }

        // GET: api/Recommendation
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FitnessProgram>>> GetRecommendations([FromQuery] int count = 3)
        {
            try
            {
                // Extrage ID-ul utilizatorului din token
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                    return Unauthorized("Token-ul nu conține ID-ul utilizatorului.");

                if (!int.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("ID-ul utilizatorului din token nu este valid.");

                _logger.LogInformation("Cerere pentru recomandări de la userId: {UserId}", userId);
                
                // Obține recomandările
                var recommendedPrograms = await _recommendationService.GetRecommendedProgramsAsync(userId, count);
                
                return Ok(recommendedPrograms);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Eroare operațională la obținerea recomandărilor");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare neașteptată la obținerea recomandărilor");
                return StatusCode(500, "A apărut o eroare la obținerea recomandărilor. Încercați din nou mai târziu.");
            }
        }
    }
}