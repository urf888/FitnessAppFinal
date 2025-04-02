using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<UserProfile> UserProfiles { get; set; } = null!;
        public DbSet<FitnessProgram> FitnessPrograms { get; set; } = null!;
        
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
                
            // Seedare date (opțional)
            // Poți adăuga utilizatori sau programe implicite aici
            
            // Exemplu admin
            /*
            var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!");
            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    Username = "admin", 
                    Email = "admin@example.com", 
                    PasswordHash = adminPasswordHash,
                    Role = "admin"
                }
            );
            */
        }
    }
}