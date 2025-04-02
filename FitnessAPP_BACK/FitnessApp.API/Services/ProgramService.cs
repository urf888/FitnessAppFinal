using FitnessApp.API.Data;
using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Services
{
    public interface IProgramService
    {
        Task<IEnumerable<FitnessProgram>> GetAllProgramsAsync();
        Task<FitnessProgram?> GetProgramByIdAsync(int id);
        Task<IEnumerable<FitnessProgram>> GetFilteredProgramsAsync(string? gender, string? diet, string? programType);
        Task<FitnessProgram> CreateProgramAsync(FitnessProgram program);
        Task<FitnessProgram?> UpdateProgramAsync(int id, FitnessProgram program);
        Task<bool> DeleteProgramAsync(int id);
    }

    public class ProgramService : IProgramService
    {
        private readonly AppDbContext _context;

        public ProgramService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FitnessProgram>> GetAllProgramsAsync()
        {
            return await _context.FitnessPrograms.ToListAsync();
        }

        public async Task<FitnessProgram?> GetProgramByIdAsync(int id)
        {
            return await _context.FitnessPrograms.FindAsync(id);
        }

        public async Task<IEnumerable<FitnessProgram>> GetFilteredProgramsAsync(string? gender, string? diet, string? programType)
        {
            IQueryable<FitnessProgram> query = _context.FitnessPrograms;

            if (!string.IsNullOrEmpty(gender))
                query = query.Where(p => p.Gender == gender);

            if (!string.IsNullOrEmpty(diet))
                query = query.Where(p => p.Diet == diet);
                
            if (!string.IsNullOrEmpty(programType))
                query = query.Where(p => p.ProgramType == programType);

            return await query.ToListAsync();
        }

        public async Task<FitnessProgram> CreateProgramAsync(FitnessProgram program)
        {
            _context.FitnessPrograms.Add(program);
            await _context.SaveChangesAsync();
            return program;
        }

        public async Task<FitnessProgram?> UpdateProgramAsync(int id, FitnessProgram program)
        {
            var existingProgram = await _context.FitnessPrograms.FindAsync(id);
            if (existingProgram == null)
                return null;

            existingProgram.Name = program.Name;
            existingProgram.Gender = program.Gender;
            existingProgram.Diet = program.Diet;
            existingProgram.ProgramType = program.ProgramType;
            existingProgram.Description = program.Description;
            existingProgram.ImageUrl = program.ImageUrl;

            await _context.SaveChangesAsync();
            return existingProgram;
        }

        public async Task<bool> DeleteProgramAsync(int id)
        {
            var program = await _context.FitnessPrograms.FindAsync(id);
            if (program == null)
                return false;

            _context.FitnessPrograms.Remove(program);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}