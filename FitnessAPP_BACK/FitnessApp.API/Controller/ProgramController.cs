using FitnessApp.API.Models;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgramController : ControllerBase
    {
        private readonly IProgramService _programService;

        public ProgramController(IProgramService programService)
        {
            _programService = programService;
        }

        // GET: api/Program
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FitnessProgram>>> GetPrograms(
            [FromQuery] string? gender = null, 
            [FromQuery] string? diet = null, 
            [FromQuery] string? programType = null,
            [FromQuery] string? difficultyLevel = null,
            [FromQuery] int? ageMin = null,
            [FromQuery] int? ageMax = null)
        {
            if (gender == null && diet == null && programType == null && 
                difficultyLevel == null && ageMin == null && ageMax == null)
                return Ok(await _programService.GetAllProgramsAsync());
            
            return Ok(await _programService.GetFilteredProgramsAsync(
                gender, diet, programType, difficultyLevel, ageMin, ageMax));
        }

        // GET: api/Program/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FitnessProgram>> GetProgram(int id, [FromQuery] bool includeWorkouts = false)
        {
            var program = await _programService.GetProgramByIdAsync(id, includeWorkouts);
            if (program == null)
                return NotFound();

            return Ok(program);
        }

        // POST: api/Program
        [HttpPost]
        [Authorize(Roles = "admin")]  // Doar administratorii pot adăuga programe
        public async Task<ActionResult<FitnessProgram>> CreateProgram([FromBody] FitnessProgram program)
        {
            try
            {
                var createdProgram = await _programService.CreateProgramAsync(program);
                return CreatedAtAction(nameof(GetProgram), new { id = createdProgram.Id }, createdProgram);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Program/5
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]  // Doar administratorii pot actualiza programe
        public async Task<ActionResult<FitnessProgram>> UpdateProgram(int id, [FromBody] FitnessProgram program)
        {
            if (id != program.Id)
                return BadRequest("ID mismatch");

            var updatedProgram = await _programService.UpdateProgramAsync(id, program);
            if (updatedProgram == null)
                return NotFound();

            return Ok(updatedProgram);
        }

        // DELETE: api/Program/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]  // Doar administratorii pot șterge programe
        public async Task<ActionResult> DeleteProgram(int id)
        {
            var result = await _programService.DeleteProgramAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // ENDPOINTS PENTRU ZILE DE ANTRENAMENT

        // GET: api/Program/5/WorkoutDays
        [HttpGet("{programId}/WorkoutDays")]
        public async Task<ActionResult<IEnumerable<WorkoutDay>>> GetWorkoutDays(int programId)
        {
            var program = await _programService.GetProgramByIdAsync(programId);
            if (program == null)
                return NotFound();

            var workoutDays = await _programService.GetWorkoutDaysForProgramAsync(programId);
            return Ok(workoutDays);
        }

        // GET: api/Program/WorkoutDay/5
        [HttpGet("WorkoutDay/{id}")]
        public async Task<ActionResult<WorkoutDay>> GetWorkoutDay(int id, [FromQuery] bool includeExercises = false)
        {
            var workoutDay = await _programService.GetWorkoutDayByIdAsync(id, includeExercises);
            if (workoutDay == null)
                return NotFound();

            return Ok(workoutDay);
        }

        // POST: api/Program/5/WorkoutDay
        [HttpPost("{programId}/WorkoutDay")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<WorkoutDay>> AddWorkoutDay(int programId, [FromBody] WorkoutDay workoutDay)
        {
            try
            {
                var addedWorkoutDay = await _programService.AddWorkoutDayToProgramAsync(programId, workoutDay);
                return CreatedAtAction(nameof(GetWorkoutDay), new { id = addedWorkoutDay.Id }, addedWorkoutDay);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Program/WorkoutDay/5
        [HttpPut("WorkoutDay/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<WorkoutDay>> UpdateWorkoutDay(int id, [FromBody] WorkoutDay workoutDay)
        {
            if (id != workoutDay.Id)
                return BadRequest("ID mismatch");

            var updatedWorkoutDay = await _programService.UpdateWorkoutDayAsync(id, workoutDay);
            if (updatedWorkoutDay == null)
                return NotFound();

            return Ok(updatedWorkoutDay);
        }

        // DELETE: api/Program/WorkoutDay/5
        [HttpDelete("WorkoutDay/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteWorkoutDay(int id)
        {
            var result = await _programService.DeleteWorkoutDayAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // ENDPOINTS PENTRU EXERCIȚII ÎN ZILE DE ANTRENAMENT

        // POST: api/Program/WorkoutDay/5/Exercise
        [HttpPost("WorkoutDay/{workoutDayId}/Exercise")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ExerciseWorkout>> AddExerciseToWorkoutDay(int workoutDayId, [FromBody] ExerciseWorkout exerciseWorkout)
        {
            try
            {
                var addedExerciseWorkout = await _programService.AddExerciseToWorkoutDayAsync(workoutDayId, exerciseWorkout);
                return CreatedAtAction(nameof(GetWorkoutDay), new { id = workoutDayId, includeExercises = true }, addedExerciseWorkout);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Program/ExerciseWorkout/5
        [HttpPut("ExerciseWorkout/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ExerciseWorkout>> UpdateExerciseWorkout(int id, [FromBody] ExerciseWorkout exerciseWorkout)
        {
            if (id != exerciseWorkout.Id)
                return BadRequest("ID mismatch");

            var updatedExerciseWorkout = await _programService.UpdateExerciseWorkoutAsync(id, exerciseWorkout);
            if (updatedExerciseWorkout == null)
                return NotFound();

            return Ok(updatedExerciseWorkout);
        }

        // DELETE: api/Program/ExerciseWorkout/5
        [HttpDelete("ExerciseWorkout/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteExerciseFromWorkoutDay(int id)
        {
            var result = await _programService.DeleteExerciseFromWorkoutDayAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}