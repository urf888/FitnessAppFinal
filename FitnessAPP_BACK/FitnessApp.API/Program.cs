using System.Text;
using FitnessApp.API.Data;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Adăugare DbContext cu SQL Server (nu SQLite)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adăugare servicii
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IProgramService, ProgramService>();
builder.Services.AddScoped<IExerciseService, ExerciseService>(); 
builder.Services.AddScoped<IRecipeService, RecipeService>();
builder.Services.AddScoped<IAIRecipeService, AIRecipeService>();
builder.Services.AddScoped<JwtService>();
// Configurarea HttpClient pentru OpenAI
builder.Services.AddHttpClient<IOpenAIService, OpenAIService>();

// Înregistrarea serviciilor
builder.Services.AddScoped<IOpenAIService, OpenAIService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
// Înregistrăm noul serviciu pentru recomandări de mese
builder.Services.AddScoped<IMealRecommendationService, MealRecommendationService>();

// Configurare autentificare JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Secret"] ?? "fallback-secret-key-for-development"))
        };
    });

// Adăugăm CORS pentru a permite cererile din frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Portul pe care va rula frontend-ul
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Adăugăm controlere
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configurare pentru a gestiona referințele ciclice în JSON
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Configurăm Swagger cu suport pentru JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FitnessApp API", Version = "v1" });
    
    // Configurare pentru autentificare cu JWT în Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configurăm pipeline-ul HTTP
if (app.Environment.IsDevelopment())
{
    await RecipeSeedData.SeedRecipesAsync(app.Services);
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "FitnessApp API v1");
        // Pentru a afișa Swagger la rădăcină
        c.RoutePrefix = string.Empty;
    });
}

// Creăm directoarele pentru imagini dacă nu există
var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(wwwrootPath))
{
    Directory.CreateDirectory(wwwrootPath);
}

var imagesPath = Path.Combine(wwwrootPath, "images");
if (!Directory.Exists(imagesPath))
{
    Directory.CreateDirectory(imagesPath);
}

// Creăm directorul pentru imagini placeholders
var placeholdersPath = Path.Combine(imagesPath, "placeholders");
if (!Directory.Exists(placeholdersPath))
{
    Directory.CreateDirectory(placeholdersPath);
}

// Creăm directorul pentru imagini programe
var programsPath = Path.Combine(imagesPath, "programs");
if (!Directory.Exists(programsPath))
{
    Directory.CreateDirectory(programsPath);
}

// Creăm directorul pentru imagini rețete
var recipeImagesPath = Path.Combine(imagesPath, "recipe-types");
if (!Directory.Exists(recipeImagesPath))
{
    Directory.CreateDirectory(recipeImagesPath);
}

// Adăugare middleware pentru servirea fișierelor statice
app.UseStaticFiles(); // Această linie este crucială pentru servirea imaginilor

// Permite servirea fișierelor direct din folderul wwwroot
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(wwwrootPath),
    RequestPath = ""
});

// Configurare pentru a permite servirea imaginilor direct cu calea /images/...
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagesPath),
    RequestPath = "/images"
});

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();

app.Run();