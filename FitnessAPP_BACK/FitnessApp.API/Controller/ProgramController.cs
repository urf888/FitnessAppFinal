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
            [FromQuery] string? programType = null)
        {
            if (gender == null && diet == null && programType == null)
                return Ok(await _programService.GetAllProgramsAsync());
            
            return Ok(await _programService.GetFilteredProgramsAsync(gender, diet, programType));
        }

        // GET: api/Program/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FitnessProgram>> GetProgram(int id)
        {
            var program = await _programService.GetProgramByIdAsync(id);
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
    }
}