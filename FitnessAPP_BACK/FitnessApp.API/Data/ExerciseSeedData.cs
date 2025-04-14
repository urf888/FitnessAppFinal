using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Data
{
    public static class ExerciseSeedData
    {
        public static void SeedExercises(this ModelBuilder modelBuilder)
        {
            // Exerciții pentru Piept
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 1,
                Name = "Împins la Piept cu Haltere",
                Category = "piept",
                DifficultyLevel = "intermediar",
                Description = "Exercițiu compus pentru piept, umeri și triceps.",
                Instructions = "1. Așezați-vă pe o bancă plată, cu picioarele pe podea. 2. Țineți halterele deasupra pieptului, cu palmele îndreptate înainte. 3. Coborâți halterele până când ating părțile laterale ale pieptului. 4. Împingeți halterele înapoi în poziția inițială.",
                TargetMuscles = "pectorali, deltoid anterior",
                SecondaryMuscles = "triceps",
                Equipment = "haltere, bancă"
            });

            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 2,
                Name = "Flotări",
                Category = "piept",
                DifficultyLevel = "începător",
                Description = "Exercițiu de bază pentru partea superioară a corpului care utilizează greutatea corporală.",
                Instructions = "1. Începeți în poziția de planșă, cu mâinile plasate puțin mai lat decât lățimea umerilor. 2. Coborâți corpul menținând o linie dreaptă de la cap la călcâie. 3. Opriți-vă când pieptul este la câțiva centimetri de sol. 4. Împingeți înapoi în poziția inițială.",
                TargetMuscles = "pectorali, deltoid anterior",
                SecondaryMuscles = "triceps, abdomen, mușchii spatelui",
                Equipment = "niciunul"
            });

            // Exerciții pentru Spate
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 3,
                Name = "Tracțiuni la Bară",
                Category = "spate",
                DifficultyLevel = "intermediar",
                Description = "Exercițiu compus pentru lățimea spatelui și forța părții superioare a corpului.",
                Instructions = "1. Agățați-vă de bară cu palmele îndreptate în afară și mâinile plasate mai lat decât lățimea umerilor. 2. Trageți corpul în sus până când bărbia trece de bară. 3. Coborâți încet înapoi în poziția inițială.",
                TargetMuscles = "latissimus dorsi, rhomboid",
                SecondaryMuscles = "biceps, deltoid posterior, rotund",
                Equipment = "bară de tracțiuni"
            });

            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 4,
                Name = "Vâslit cu Halteră",
                Category = "spate",
                DifficultyLevel = "intermediar",
                Description = "Exercițiu pentru dezvoltarea părții mijlocii a spatelui și a forței de prindere.",
                Instructions = "1. Aplecați-vă în față cu picioarele la lățimea umerilor, ținând o halteră în fiecare mână. 2. Trageți halterele în sus către abdomen, menținând coatele aproape de corp. 3. Strângeți omoplații la sfârșit, apoi coborâți greutățile controlat.",
                TargetMuscles = "latissimus dorsi, rhomboid, trapez",
                SecondaryMuscles = "biceps, deltoid posterior",
                Equipment = "haltere"
            });

            // Exerciții pentru Picioare
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 5,
                Name = "Genuflexiuni",
                Category = "picioare",
                DifficultyLevel = "intermediar",
                Description = "Exercițiu compus pentru dezvoltarea forței picioarelor și a părții inferioare a corpului.",
                Instructions = "1. Stați cu picioarele la lățimea umerilor. 2. Coborâți șoldurile ca și cum v-ați așeza pe un scaun, menținând genunchii în linie cu degetele de la picioare. 3. Coborâți până când coapsele sunt paralele cu solul sau mai jos. 4. Împingeți prin călcâie pentru a reveni la poziția inițială.",
                TargetMuscles = "cvadriceps, gluteus maximus",
                SecondaryMuscles = "ischiocruralii, adductori, mușchii spatelui",
                Equipment = "niciunul sau bară"
            });

            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 6,
                Name = "Lunges",
                Category = "picioare",
                DifficultyLevel = "intermediar",
                Description = "Exercițiu unilateral pentru picioare care vizează cvadricepsii, fesierii și ischiocruralii.",
                Instructions = "1. Stați în picioare cu picioarele la lățimea șoldurilor. 2. Faceți un pas mare înainte cu un picior. 3. Coborâți corpul până când ambii genunchi sunt îndoiți la aproximativ 90 de grade. 4. Împingeți prin piciorul din față pentru a reveni la poziția inițială.",
                TargetMuscles = "cvadriceps, gluteus maximus",
                SecondaryMuscles = "ischiocruralii, mușchii gambei",
                Equipment = "niciunul sau gantere"
            });

            // Exerciții pentru Abdomen
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 7,
                Name = "Crunch-uri",
                Category = "abdomen",
                DifficultyLevel = "începător",
                Description = "Exercițiu de bază pentru zona abdominală superioară.",
                Instructions = "1. Întindeți-vă pe spate cu genunchii îndoiți și picioarele pe sol. 2. Puneți mâinile pe piept sau pe lângă cap. 3. Ridicați umerii și partea superioară a spatelui de pe sol, menținând zona lombară pe sol. 4. Coborâți încet înapoi la poziția de start.",
                TargetMuscles = "rectus abdominis",
                SecondaryMuscles = "oblicii",
                Equipment = "niciunul"
            });

            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 8,
                Name = "Planșă",
                Category = "abdomen",
                DifficultyLevel = "începător",
                Description = "Exercițiu izometric pentru întregul corp care vizează în principal miezul.",
                Instructions = "1. Începeți în poziția de flotare, dar sprijinindu-vă pe antebrațe în loc de mâini. 2. Mențineți corpul într-o linie dreaptă de la cap la călcâie. 3. Încordați abdomenul și fesierii. 4. Țineți poziția pentru timpul dorit.",
                TargetMuscles = "rectus abdominis, transversus abdominis",
                SecondaryMuscles = "oblicii, mușchii spatelui, umerii",
                Equipment = "niciunul"
            });

            // Exerciții pentru Brațe
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 9,
                Name = "Flexii cu Haltera",
                Category = "brațe",
                DifficultyLevel = "începător",
                Description = "Exercițiu clasic pentru dezvoltarea bicepsului.",
                Instructions = "1. Stați în picioare cu halterele în mâini, brațele întinse și palmele îndreptate înainte. 2. Îndoiți coatele și ridicați halterele spre umeri. 3. Strângeți bicepsul în partea de sus. 4. Coborâți halterele încet înapoi în poziția inițială.",
                TargetMuscles = "biceps brachii",
                SecondaryMuscles = "brahialis, brahioradialis",
                Equipment = "haltere"
            });

            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 10,
                Name = "Extensii de Triceps",
                Category = "brațe",
                DifficultyLevel = "începător",
                Description = "Exercițiu pentru dezvoltarea mușchilor triceps.",
                Instructions = "1. Stați în picioare sau așezați cu o halteră ținută cu ambele mâini. 2. Ridicați haltera deasupra capului, cu brațele complet întinse. 3. Coborâți haltera în spatele capului îndoind coatele. 4. Extindeți brațele pentru a ridica haltera înapoi în poziția inițială.",
                TargetMuscles = "triceps brachii",
                SecondaryMuscles = "deltoid anterior, deltoid posterior",
                Equipment = "halteră"
            });

            // Exerciții pentru Umeri
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 11,
                Name = "Ridicări Laterale",
                Category = "umeri",
                DifficultyLevel = "începător",
                Description = "Exercițiu de izolare pentru deltoidul lateral.",
                Instructions = "1. Stați în picioare cu halterele în mâini de-a lungul corpului. 2. Ridicați halterele lateral până la nivelul umerilor, menținând brațele aproape drepte. 3. Coborâți încet înapoi în poziția inițială.",
                TargetMuscles = "deltoid lateral",
                SecondaryMuscles = "trapez, deltoid anterior, deltoid posterior",
                Equipment = "haltere"
            });

            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 12,
                Name = "Împins la Umeri",
                Category = "umeri",
                DifficultyLevel = "intermediar",
                Description = "Exercițiu compus pentru dezvoltarea umerilor.",
                Instructions = "1. Stați în picioare sau așezați ținând halterele la nivelul umerilor. 2. Împingeți halterele în sus până când brațele sunt complet extinse. 3. Coborâți halterele înapoi la nivelul umerilor.",
                TargetMuscles = "deltoid anterior",
                SecondaryMuscles = "deltoid lateral, triceps, trapez superior",
                Equipment = "haltere sau bară"
            });

            // Exerciții pentru Cardio
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 13,
                Name = "Alergare",
                Category = "cardio",
                DifficultyLevel = "intermediar",
                Description = "Exercițiu cardiovascular de bază pentru îmbunătățirea sănătății inimii și arderea caloriilor.",
                Instructions = "1. Începeți cu un ritm ușor pentru încălzire. 2. Măriți treptat intensitatea până la ritmul dorit. 3. Mențineți o postură dreaptă, cu umerii relaxați. 4. Aterizați pe mijlocul piciorului, nu pe călcâi.",
                TargetMuscles = "cvadriceps, ischiocruralii, gluteus maximus",
                SecondaryMuscles = "mușchii gambei, abdomen, mușchii spatelui",
                Equipment = "niciunul sau bandă de alergare"
            });

            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 14,
                Name = "Burpees",
                Category = "cardio",
                DifficultyLevel = "avansat",
                Description = "Exercițiu de intensitate ridicată pentru întregul corp.",
                Instructions = "1. Începeți în picioare. 2. Ajungeți într-o poziție de ghemuit. 3. Plasați mâinile pe sol și extindeți picioarele înapoi în poziția de flotare. 4. Faceți o flotare (opțional). 5. Aduceți picioarele înapoi în poziția de ghemuit. 6. Săriți în sus cu mâinile deasupra capului.",
                TargetMuscles = "cvadriceps, gluteus maximus, pectorali",
                SecondaryMuscles = "deltoid, triceps, abdomen, ischiocruralii",
                Equipment = "niciunul"
            });

            // Exerciții pentru Stretching/Mobilitate
            modelBuilder.Entity<Exercise>().HasData(new Exercise
            {
                Id = 15,
                Name = "Stretching pentru Ischiocruralii",
                Category = "mobilitate",
                DifficultyLevel = "începător",
                Description = "Exercițiu de întindere pentru ischiocruralii și zona lombară.",
                Instructions = "1. Așezați-vă pe sol cu picioarele întinse în față. 2. Încercați să atingeți degetele de la picioare, îndoind de la șold și menținând spatele cât mai drept posibil. 3. Țineți poziția timp de 20-30 de secunde. 4. Relaxați-vă și repetați.",
                TargetMuscles = "ischiocruralii",
                SecondaryMuscles = "zona lombară",
                Equipment = "niciunul"
            });
        }
    }
}