using FitnessApp.API.Models;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;

        public ExerciseController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        // GET: api/Exercise
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exercise>>> GetExercises(
            [FromQuery] string? category = null,
            [FromQuery] string? difficulty = null,
            [FromQuery] string? equipment = null)
        {
            // Filtrare după categorie
            if (!string.IsNullOrEmpty(category))
                return Ok(await _exerciseService.GetExercisesByCategoryAsync(category));
                
            // Filtrare după nivel de dificultate
            if (!string.IsNullOrEmpty(difficulty))
                return Ok(await _exerciseService.GetExercisesByDifficultyAsync(difficulty));
                
            // Filtrare după echipament
            if (!string.IsNullOrEmpty(equipment))
                return Ok(await _exerciseService.GetExercisesByEquipmentAsync(equipment));
                
            // Dacă nu este specificat niciun filtru, returnam toate exercițiile
            return Ok(await _exerciseService.GetAllExercisesAsync());
        }

        // GET: api/Exercise/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Exercise>> GetExercise(int id)
        {
            var exercise = await _exerciseService.GetExerciseByIdAsync(id);
            if (exercise == null)
                return NotFound();

            return Ok(exercise);
        }

        // POST: api/Exercise
        [HttpPost]
        [Authorize(Roles = "admin")] // Doar administratorii pot adăuga exerciții
        public async Task<ActionResult<Exercise>> CreateExercise([FromBody] Exercise exercise)
        {
            try
            {
                var createdExercise = await _exerciseService.CreateExerciseAsync(exercise);
                return CreatedAtAction(nameof(GetExercise), new { id = createdExercise.Id }, createdExercise);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Exercise/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")] // Doar administratorii pot actualiza exerciții
        public async Task<ActionResult<Exercise>> UpdateExercise(int id, [FromBody] Exercise exercise)
        {
            if (id != exercise.Id)
                return BadRequest("ID mismatch");

            var updatedExercise = await _exerciseService.UpdateExerciseAsync(id, exercise);
            if (updatedExercise == null)
                return NotFound();

            return Ok(updatedExercise);
        }

        // DELETE: api/Exercise/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")] // Doar administratorii pot șterge exerciții
        public async Task<ActionResult> DeleteExercise(int id)
        {
            var result = await _exerciseService.DeleteExerciseAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}