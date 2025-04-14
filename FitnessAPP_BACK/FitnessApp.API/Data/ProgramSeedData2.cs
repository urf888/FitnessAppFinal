using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Data
{
    public static class ProgramSeedDataExtensions
    {
        public static void SeedPrograms2(this ModelBuilder modelBuilder)
        {
            // Program 1: Pentru slăbit - Femeie - Ziua 3 (Full Body HIIT)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 101,
                WorkoutDayId = 3,
                ExerciseId = 14, // Burpees
                Order = 1,
                Sets = 3,
                Reps = 12,
                RestSeconds = 30,
                Notes = "Execută fără pauză între repetări, doar între seturi"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 102,
                WorkoutDayId = 3,
                ExerciseId = 5, // Genuflexiuni
                Order = 2,
                Sets = 3,
                Reps = 15,
                RestSeconds = 30,
                Notes = "Execută rapid, dar cu formă corectă"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 103,
                WorkoutDayId = 3,
                ExerciseId = 7, // Crunch-uri
                Order = 3,
                Sets = 3,
                Reps = 20,
                RestSeconds = 30,
                Notes = "Concentrează-te pe contracția abdominală"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 104,
                WorkoutDayId = 3,
                ExerciseId = 2, // Flotări
                Order = 4,
                Sets = 3,
                Reps = 10,
                RestSeconds = 30,
                Notes = "Flotări normale sau de pe genunchi, în funcție de nivel"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 105,
                WorkoutDayId = 3,
                ExerciseId = 13, // Alergare
                Order = 5,
                Sets = 1,
                Duration = "2 minute",
                RestSeconds = 60,
                Notes = "Alergare pe loc sau sărituri cu coarda"
            });

            // Program 1: Pentru slăbit - Femeie - Ziua 4 (Mobilitate și Stretching)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 106,
                WorkoutDayId = 4,
                ExerciseId = 15, // Stretching pentru Ischiocruralii
                Order = 1,
                Sets = 3,
                Duration = "30 secunde",
                RestSeconds = 15,
                Notes = "Întinde-te doar până la punctul confortabil"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 107,
                WorkoutDayId = 4,
                ExerciseId = 8, // Planșă
                Order = 2,
                Sets = 3,
                Duration = "45 secunde",
                RestSeconds = 30,
                Notes = "Menține poziția corectă a corpului pe toată durata"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 108,
                WorkoutDayId = 4,
                ExerciseId = 5, // Genuflexiuni - folosit ca stretching dinamic
                Order = 3,
                Sets = 2,
                Reps = 15,
                RestSeconds = 30,
                Notes = "Execută lent, concentrându-te pe mobilitatea șoldului"
            });

            // Program 2: Pentru masă musculară - Bărbat - Ziua 2 (Spate și Biceps)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 109,
                WorkoutDayId = 6,
                ExerciseId = 3, // Tracțiuni la Bară
                Order = 1,
                Sets = 4,
                Reps = 8,
                RestSeconds = 90,
                Notes = "Executare până la eșec, folosește bandă elastică pentru asistență dacă e necesar"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 110,
                WorkoutDayId = 6,
                ExerciseId = 4, // Vâslit cu Halteră
                Order = 2,
                Sets = 4,
                Reps = 12,
                RestSeconds = 60,
                Weight = 20, // kg per halteră
                Notes = "Menține spatele drept, trage halterele spre abdomen"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 111,
                WorkoutDayId = 6,
                ExerciseId = 9, // Flexii cu Haltera (pentru biceps)
                Order = 3,
                Sets = 4,
                Reps = 12,
                RestSeconds = 60,
                Weight = 15, // kg per halteră
                Notes = "Execută controlat, fără balans"
            });

            // Program 2: Pentru masă musculară - Bărbat - Ziua 3 (Picioare)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 112,
                WorkoutDayId = 7,
                ExerciseId = 5, // Genuflexiuni
                Order = 1,
                Sets = 5,
                Reps = 8,
                RestSeconds = 120,
                Weight = 80, // kg total (bară + greutăți)
                Notes = "Încălzește-te cu seturi progresive. Coboară până treci de paralel."
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 113,
                WorkoutDayId = 7,
                ExerciseId = 6, // Lunges
                Order = 2,
                Sets = 3,
                Reps = 10,
                RestSeconds = 90,
                Weight = 40, // kg total (bară + greutăți sau gantere)
                Notes = "Execută 10 repetări pe fiecare picior"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 114,
                WorkoutDayId = 7,
                ExerciseId = 15, // Stretching pentru Ischiocruralii (adaptat ca exercițiu pentru ischiocruralii)
                Order = 3,
                Sets = 3,
                Reps = 12,
                RestSeconds = 90,
                Weight = 50, // kg (la aparat)
                Notes = "Folosește aparatul pentru flexii de genunchi"
            });

            // Program 2: Pentru masă musculară - Bărbat - Ziua 4 (Umeri și Abdomen)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 115,
                WorkoutDayId = 8,
                ExerciseId = 12, // Împins la Umeri
                Order = 1,
                Sets = 4,
                Reps = 10,
                RestSeconds = 90,
                Weight = 25, // kg per haltere sau bară
                Notes = "Alternează între împins cu halteră și împins cu ganterele"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 116,
                WorkoutDayId = 8,
                ExerciseId = 11, // Ridicări Laterale
                Order = 2,
                Sets = 4,
                Reps = 15,
                RestSeconds = 60,
                Weight = 10, // kg per ganteră
                Notes = "Execută controlat, fără balans"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 117,
                WorkoutDayId = 8,
                ExerciseId = 7, // Crunch-uri
                Order = 3,
                Sets = 4,
                Reps = 20,
                RestSeconds = 60,
                Notes = "Concentrează-te pe contracția abdominală completă"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 118,
                WorkoutDayId = 8,
                ExerciseId = 8, // Planșă
                Order = 4,
                Sets = 3,
                Duration = "60 secunde",
                RestSeconds = 60,
                Notes = "Menține poziția corectă, fără lăsarea șoldurilor"
            });

            // Program 2: Pentru masă musculară - Bărbat - Ziua 5 (Full Body)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 119,
                WorkoutDayId = 9,
                ExerciseId = 1, // Împins la Piept cu Haltere
                Order = 1,
                Sets = 3,
                Reps = 12,
                RestSeconds = 60,
                Weight = 25, // kg per halteră
                Notes = "Concentrează-te pe partea din piept care necesită atenție suplimentară"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 120,
                WorkoutDayId = 9,
                ExerciseId = 4, // Vâslit cu Halteră
                Order = 2,
                Sets = 3,
                Reps = 12,
                RestSeconds = 60,
                Weight = 25, // kg per halteră
                Notes = "Concentrează-te pe partea din spate care necesită atenție suplimentară"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 121,
                WorkoutDayId = 9,
                ExerciseId = 5, // Genuflexiuni
                Order = 3,
                Sets = 3,
                Reps = 15,
                RestSeconds = 60,
                Weight = 60, // kg total
                Notes = "Concentrează-te pe aspectele ce necesită îmbunătățire"
            });

            // Program 3: Fitness General - Unisex - Ziua 1 (Full Body Strength)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 122,
                WorkoutDayId = 10,
                ExerciseId = 2, // Flotări
                Order = 1,
                Sets = 3,
                Reps = 10,
                RestSeconds = 60,
                Notes = "Execută cu formă corectă, modifică în funcție de nivel"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 123,
                WorkoutDayId = 10,
                ExerciseId = 5, // Genuflexiuni
                Order = 2,
                Sets = 3,
                Reps = 15,
                RestSeconds = 60,
                Notes = "Coboară până când coapsele sunt paralele cu solul"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 124,
                WorkoutDayId = 10,
                ExerciseId = 4, // Vâslit cu Halteră (adaptat ca vâslit cu ganteră)
                Order = 3,
                Sets = 3,
                Reps = 12,
                RestSeconds = 60,
                Notes = "Folosește ganterele dacă sunt disponibile, sau improvizează cu obiecte de acasă"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 125,
                WorkoutDayId = 10,
                ExerciseId = 7, // Crunch-uri
                Order = 4,
                Sets = 3,
                Reps = 15,
                RestSeconds = 45,
                Notes = "Concentrează-te pe abdomen, nu pe gât"
            });

            // Program 3: Fitness General - Unisex - Ziua 2 (Cardio & Core)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 126,
                WorkoutDayId = 11,
                ExerciseId = 13, // Alergare
                Order = 1,
                Sets = 1,
                Duration = "10 minute",
                Notes = "Alergare ușoară sau mers alert pentru încălzire"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 127,
                WorkoutDayId = 11,
                ExerciseId = 14, // Burpees
                Order = 2,
                Sets = 3,
                Reps = 10,
                RestSeconds = 30,
                Notes = "Execută la ritm propriu, adaptează după nivel"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 128,
                WorkoutDayId = 11,
                ExerciseId = 8, // Planșă
                Order = 3,
                Sets = 3,
                Duration = "30 secunde",
                RestSeconds = 30,
                Notes = "Menține poziția corectă a șoldurilor"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 129,
                WorkoutDayId = 11,
                ExerciseId = 7, // Crunch-uri
                Order = 4,
                Sets = 3,
                Reps = 20,
                RestSeconds = 30,
                Notes = "Controlează mișcarea, evită impulsul"
            });

            // Program 3: Fitness General - Unisex - Ziua 3 (Mobilitate & Forță)
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 130,
                WorkoutDayId = 12,
                ExerciseId = 15, // Stretching pentru Ischiocruralii
                Order = 1,
                Sets = 2,
                Duration = "30 secunde",
                RestSeconds = 15,
                Notes = "Încălzire pentru mobilitatea șoldurilor și a picioarelor"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 131,
                WorkoutDayId = 12,
                ExerciseId = 6, // Lunges
                Order = 2,
                Sets = 3,
                Reps = 10,
                RestSeconds = 45,
                Notes = "10 repetări pe fiecare picior, pas mare înainte"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 132,
                WorkoutDayId = 12,
                ExerciseId = 11, // Ridicări Laterale
                Order = 3,
                Sets = 3,
                Reps = 12,
                RestSeconds = 45,
                Notes = "Folosește greutăți ușoare sau sticle cu apă"
            });

            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 133,
                WorkoutDayId = 12,
                ExerciseId = 9, // Flexii cu Haltera (adaptat pentru flexii cu ganteră)
                Order = 4,
                Sets = 3,
                Reps = 12,
                RestSeconds = 45,
                Notes = "Folosește ganterele sau obiecte de acasă ca greutăți"
            });
        }
    }
}