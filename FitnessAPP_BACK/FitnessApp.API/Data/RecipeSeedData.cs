using FitnessApp.API.Data;
using FitnessApp.API.Models;
using System.Text.Json;

namespace FitnessApp.API.Data
{
    public static class RecipeSeedData
    {
        public static async Task SeedRecipesAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            try
            {
                // Verifică dacă există deja rețete în baza de date
                if (!context.Recipes.Any())
                {
                    logger.LogInformation("Începe popularea bazei de date cu rețete...");

                    // Adaugă rețeta de exemplu #1
                    var recipe1 = new Recipe
                    {
                        Title = "Piept de pui la cuptor cu legume",
                        Description = "O rețetă simplă și sănătoasă, bogată în proteine și cu puține grăsimi, perfectă pentru obiectivele tale de fitness.",
                        ImageUrl = "/images/recipes/chicken-vegetables.jpg",
                        PrepTime = 45,
                        Servings = 4,
                        Calories = 320,
                        Protein = 28,
                        Carbs = 25,
                        Fat = 10,
                        Fiber = 6,
                        Sugar = 4,
                        DietType = "carnivor",
                        Objective = "masă",
                        ProteinContent = "ridicat",
                        Ingredients = new List<string>
                        {
                            "500g piept de pui",
                            "2 morcovi",
                            "1 ardei roșu",
                            "1 ardei verde",
                            "1 ceapă roșie",
                            "2 cartofi dulci",
                            "2 linguri ulei de măsline",
                            "2 căței de usturoi",
                            "1 linguriță oregano",
                            "1/2 linguriță cimbru",
                            "sare și piper după gust"
                        },
                        Steps = new List<string>
                        {
                            "Preîncălziți cuptorul la 200°C.",
                            "Tăiați pieptul de pui în bucăți de mărime medie.",
                            "Curățați și tăiați legumele în bucăți de mărime similară.",
                            "Într-un bol, amestecați uleiul de măsline cu usturoiul tocat, oregano, cimbru, sare și piper.",
                            "Puneți puiul și legumele într-o tavă de copt și turnați amestecul de condimente peste ele.",
                            "Amestecați bine pentru a acoperi uniform toate ingredientele.",
                            "Coaceți la cuptor timp de 30-35 de minute, amestecând la jumătatea timpului.",
                            "Serviți cald, eventual cu o garnitură de orez brun sau quinoa."
                        },
                        Tips = new List<string>
                        {
                            "Puteți înlocui pieptul de pui cu pulpe dezosate pentru o variantă mai suculentă.",
                            "Adăugați un strop de zeamă de lămâie la final pentru prospețime.",
                            "Verificați dacă puiul este gătit complet folosind un termometru de bucătărie - temperatura internă ar trebui să fie de 74°C."
                        },
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };

                    context.Recipes.Add(recipe1);

                    // Adaugă rețeta de exemplu #2
                    var recipe2 = new Recipe
                    {
                        Title = "Salată de quinoa cu avocado și roșii",
                        Description = "O salată vegană bogată în proteine și grăsimi sănătoase, perfectă pentru o masă ușoară și nutritivă.",
                        ImageUrl = "/images/recipes/quinoa-avocado-salad.jpg",
                        PrepTime = 25,
                        Servings = 2,
                        Calories = 380,
                        Protein = 12,
                        Carbs = 45,
                        Fat = 18,
                        Fiber = 10,
                        Sugar = 3,
                        DietType = "vegan",
                        Objective = "slăbit",
                        ProteinContent = "normal",
                        Ingredients = new List<string>
                        {
                            "150g quinoa",
                            "300ml apă",
                            "1 avocado",
                            "10 roșii cherry",
                            "1 castravete",
                            "1 ardei roșu",
                            "1/4 ceapă roșie",
                            "2 linguri ulei de măsline",
                            "1 lămâie (suc)",
                            "1 legătură pătrunjel",
                            "sare și piper după gust"
                        },
                        Steps = new List<string>
                        {
                            "Clătiți quinoa sub apă rece și apoi fierbeți-o conform instrucțiunilor de pe ambalaj (de obicei 15 minute în apă cu un vârf de sare).",
                            "Lăsați quinoa să se răcească după fierbere.",
                            "Tăiați avocado, roșiile cherry, castravetele, ardeiul și ceapa în bucăți mici.",
                            "Într-un bol mare, combinați quinoa răcită cu legumele tăiate.",
                            "Adăugați uleiul de măsline, sucul de lămâie, pătrunjelul tocat, sarea și piperul.",
                            "Amestecați ușor pentru a combina toate ingredientele.",
                            "Puneți la frigider pentru 30 de minute înainte de servire pentru a permite aromelor să se îmbine."
                        },
                        Tips = new List<string>
                        {
                            "Puteți adăuga semințe de dovleac sau floarea-soarelui pentru un plus de textură și nutrienți.",
                            "Această salată se păstrează bine la frigider până a doua zi.",
                            "Pentru mai multe proteine, adăugați năut sau fasole neagră."
                        },
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };

                    context.Recipes.Add(recipe2);

                    await context.SaveChangesAsync();
                    logger.LogInformation("Baza de date a fost populată cu rețete de exemplu.");
                }
                else
                {
                    logger.LogInformation("Există deja rețete în baza de date. Nu s-au adăugat date de test.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "A apărut o eroare la popularea bazei de date cu rețete.");
            }
        }
    }
}