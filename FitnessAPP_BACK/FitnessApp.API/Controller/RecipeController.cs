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
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;
        private readonly ILogger<RecipeController> _logger;

        public RecipeController(IRecipeService recipeService, ILogger<RecipeController> logger)
        {
            _recipeService = recipeService;
            _logger = logger;
        }

        // În RecipeController.cs
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetAllRecipes()
        {
            try
            {
                var recipes = await _recipeService.GetAllRawRecipesAsync();
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea tuturor rețetelor");
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }
        
        // GET: api/Recipe
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeListDto>>> GetRecipes([FromQuery] RecipeFilterDto filter)
        {
            try
            {
                // Obținem ID-ul utilizatorului din token, dacă este autentificat
                int? userId = null;
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var parsedUserId))
                {
                    userId = parsedUserId;
                }
                
                var recipes = await _recipeService.GetAllRecipesAsync(filter, userId);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor");
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(int id)
        {
            try
            {
                var recipe = await _recipeService.GetRecipeByIdAsync(id);
                if (recipe == null)
                {
                    return NotFound($"Rețeta cu ID-ul {id} nu a fost găsită.");
                }

                return Ok(recipe);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetei cu ID-ul {RecipeId}", id);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/DietType/vegan
        [HttpGet("DietType/{dietType}")]
        public async Task<ActionResult<IEnumerable<RecipeListDto>>> GetRecipesByDietType(string dietType)
        {
            if (!_recipeService.IsValidDietType(dietType))
            {
                return BadRequest($"Tipul de dietă '{dietType}' nu este valid. Valori acceptate: carnivor, vegetarian, vegan");
            }

            try
            {
                var recipes = await _recipeService.GetRecipesByDietTypeAsync(dietType);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor după tipul de dietă {DietType}", dietType);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/Objective/slabit
        [HttpGet("Objective/{objective}")]
        public async Task<ActionResult<IEnumerable<RecipeListDto>>> GetRecipesByObjective(string objective)
        {
            if (!_recipeService.IsValidObjective(objective))
            {
                return BadRequest($"Obiectivul '{objective}' nu este valid. Valori acceptate: masă, slăbit, fit");
            }

            try
            {
                var recipes = await _recipeService.GetRecipesByObjectiveAsync(objective);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor după obiectivul {Objective}", objective);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/ProteinContent/ridicat
        [HttpGet("ProteinContent/{proteinContent}")]
        public async Task<ActionResult<IEnumerable<RecipeListDto>>> GetRecipesByProteinContent(string proteinContent)
        {
            if (!_recipeService.IsValidProteinContent(proteinContent))
            {
                return BadRequest($"Conținutul proteic '{proteinContent}' nu este valid. Valori acceptate: normal, ridicat");
            }

            try
            {
                var recipes = await _recipeService.GetRecipesByProteinContentAsync(proteinContent);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor după conținutul proteic {ProteinContent}", proteinContent);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/Recommended
        [HttpGet("Recommended")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<RecipeListDto>>> GetRecommendedRecipes([FromQuery] int count = 3)
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

                var recipes = await _recipeService.GetRecommendedRecipesAsync(userId, count);
                return Ok(recipes);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor recomandate");
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/Search?term=pui
        [HttpGet("Search")]
        public async Task<ActionResult<IEnumerable<RecipeListDto>>> SearchRecipes([FromQuery] string term)
        {
            if (string.IsNullOrEmpty(term))
            {
                return BadRequest("Termenul de căutare nu poate fi gol.");
            }

            try
            {
                var recipes = await _recipeService.SearchRecipesAsync(term);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la căutarea rețetelor după termenul {SearchTerm}", term);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // POST: api/Recipe
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Recipe>> CreateRecipe([FromBody] CreateRecipeDto recipeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var recipe = await _recipeService.CreateRecipeAsync(recipeDto);
                return CreatedAtAction(nameof(GetRecipe), new { id = recipe.Id }, recipe);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la crearea rețetei");
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // PUT: api/Recipe/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<Recipe>> UpdateRecipe(int id, [FromBody] UpdateRecipeDto recipeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _recipeService.RecipeExistsAsync(id))
            {
                return NotFound($"Rețeta cu ID-ul {id} nu a fost găsită.");
            }

            try
            {
                var updatedRecipe = await _recipeService.UpdateRecipeAsync(id, recipeDto);
                if (updatedRecipe == null)
                {
                    return NotFound($"Rețeta cu ID-ul {id} nu a fost găsită.");
                }

                return Ok(updatedRecipe);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la actualizarea rețetei cu ID-ul {RecipeId}", id);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // DELETE: api/Recipe/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteRecipe(int id)
        {
            if (!await _recipeService.RecipeExistsAsync(id))
            {
                return NotFound($"Rețeta cu ID-ul {id} nu a fost găsită.");
            }

            try
            {
                var result = await _recipeService.DeleteRecipeAsync(id);
                if (!result)
                {
                    return NotFound($"Rețeta cu ID-ul {id} nu a fost găsită.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la ștergerea rețetei cu ID-ul {RecipeId}", id);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }
        
        // Endpoint-uri noi pentru favorite
        
        // POST: api/Recipe/favorite/{id}
        [HttpPost("favorite/{id}")]
        [Authorize]
        public async Task<ActionResult> AddFavorite(int id)
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
                
                // Verificăm dacă rețeta există
                if (!await _recipeService.RecipeExistsAsync(id))
                {
                    return NotFound($"Rețeta cu ID-ul {id} nu a fost găsită.");
                }
                
                var result = await _recipeService.AddFavoriteAsync(userId, id);
                if (result)
                {
                    return Ok(new { success = true, message = "Rețeta a fost adăugată la favorite." });
                }
                else
                {
                    return BadRequest("Nu s-a putut adăuga rețeta la favorite.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la adăugarea rețetei cu ID-ul {RecipeId} la favorite", id);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // DELETE: api/Recipe/favorite/{id}
        [HttpDelete("favorite/{id}")]
        [Authorize]
        public async Task<ActionResult> RemoveFavorite(int id)
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
                
                var result = await _recipeService.RemoveFavoriteAsync(userId, id);
                if (result)
                {
                    return Ok(new { success = true, message = "Rețeta a fost eliminată din favorite." });
                }
                else
                {
                    return NotFound("Rețeta nu a fost găsită în lista de favorite.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la eliminarea rețetei cu ID-ul {RecipeId} din favorite", id);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/favorites
        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<RecipeListDto>>> GetFavorites()
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
                
                var recipes = await _recipeService.GetFavoriteRecipesAsync(userId);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea rețetelor favorite");
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }

        // GET: api/Recipe/{id}/isFavorite
        [HttpGet("{id}/isFavorite")]
        [Authorize]
        public async Task<ActionResult<bool>> IsFavorite(int id)
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
                
                // Verificăm dacă rețeta există
                if (!await _recipeService.RecipeExistsAsync(id))
                {
                    return NotFound($"Rețeta cu ID-ul {id} nu a fost găsită.");
                }
                
                var isFavorite = await _recipeService.IsFavoriteAsync(userId, id);
                return Ok(isFavorite);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la verificarea dacă rețeta cu ID-ul {RecipeId} este favorită", id);
                return StatusCode(500, "A apărut o eroare internă. Vă rugăm să încercați din nou mai târziu.");
            }
        }
    }
}