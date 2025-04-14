using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace FitnessApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserProfile> UserProfiles { get; set; } = null!;
        public DbSet<FitnessProgram> FitnessPrograms { get; set; } = null!;
        public DbSet<Exercise> Exercises { get; set; } = null!;
        public DbSet<WorkoutDay> WorkoutDays { get; set; } = null!;
        public DbSet<ExerciseWorkout> ExerciseWorkouts { get; set; } = null!;
        public DbSet<Recipe> Recipes { get; set; } = null!;
        public DbSet<UserFavoriteRecipe> UserFavoriteRecipes { get; set; } = null!;
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configurarea relației one-to-one între User și UserProfile
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Șterge profilul când se șterge utilizatorul
                
            // Asigurăm că email-ul este unic
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<UserFavoriteRecipe>()
                .HasIndex(ufr => new { ufr.UserId, ufr.RecipeId })
                .IsUnique();
                
            // Configurare relații pentru modelele noi
            
            // FitnessProgram -> WorkoutDay (one-to-many)
            modelBuilder.Entity<FitnessProgram>()
                .HasMany(p => p.WorkoutDays)
                .WithOne(d => d.Program)
                .HasForeignKey(d => d.ProgramId)
                .OnDelete(DeleteBehavior.Cascade);
                
            // WorkoutDay -> ExerciseWorkout -> Exercise (many-to-many)
            modelBuilder.Entity<ExerciseWorkout>()
                .HasOne(ew => ew.WorkoutDay)
                .WithMany(d => d.ExerciseWorkouts)
                .HasForeignKey(ew => ew.WorkoutDayId)
                .OnDelete(DeleteBehavior.Cascade);
                
            modelBuilder.Entity<ExerciseWorkout>()
                .HasOne(ew => ew.Exercise)
                .WithMany(e => e.ExerciseWorkouts)
                .HasForeignKey(ew => ew.ExerciseId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Index pentru îmbunătățirea performanței
            modelBuilder.Entity<Exercise>()
                .HasIndex(e => e.Category);
                
            modelBuilder.Entity<WorkoutDay>()
                .HasIndex(d => d.DayOfWeek);

            // Configurare pentru Recipe - conversia listelor în JSON
            modelBuilder.Entity<Recipe>()
                .Property(r => r.Ingredients)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()) ?? new List<string>());

            modelBuilder.Entity<Recipe>()
                .Property(r => r.Steps)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()) ?? new List<string>());

            modelBuilder.Entity<Recipe>()
                .Property(r => r.Tips)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()) ?? new List<string>());

            // Indecși pentru Recipe pentru îmbunătățirea performanței
            modelBuilder.Entity<Recipe>()
                .HasIndex(r => r.DietType);

            modelBuilder.Entity<Recipe>()
                .HasIndex(r => r.Objective);

            modelBuilder.Entity<Recipe>()
                .HasIndex(r => r.ProteinContent);
                
            // Adăugare date inițiale pentru exerciții și programe
            modelBuilder.SeedExercises();
            modelBuilder.SeedPrograms();
            
            // Adăugăm exerciții suplimentare pentru zilele de antrenament
            modelBuilder.SeedPrograms2();
        }
    }
}