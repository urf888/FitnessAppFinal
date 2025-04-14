using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FitnessApp.API.Services
{
    public interface IOpenAIService
    {
        Task<string> GetCompletionAsync(string prompt);
    }

    public class OpenAIService : IOpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _apiUrl = "https://api.openai.com/v1/chat/completions";
        private readonly ILogger<OpenAIService> _logger;

        public OpenAIService(IConfiguration configuration, HttpClient httpClient, ILogger<OpenAIService> logger)
        {
            _apiKey = configuration["OpenAI:ApiKey"] 
                ?? throw new ArgumentNullException("OpenAI API Key nu este configurat");
            _httpClient = httpClient;
            _logger = logger;
            
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<string> GetCompletionAsync(string prompt)
        {
            try
            {
                _logger.LogInformation("Trimitere cerere către OpenAI");
                
                var requestBody = new
                {
                    model = "gpt-3.5-turbo", 
                    messages = new[]
                    {
                        new { role = "system", content = "Ești un antrenor personal specializat în crearea de programe de fitness personalizate, cu o experiență vastă în adaptarea programelor pentru diferite obiective, niveluri de experiență și restricții dietetice." },
                        new { role = "user", content = prompt }
                    },
                    max_tokens = 4000,
                    temperature = 0.7 
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json");
                
                var response = await _httpClient.PostAsync(_apiUrl, content);
                response.EnsureSuccessStatusCode();

                var responseBody = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Răspuns primit de la OpenAI");
                
                var responseObject = JsonSerializer.Deserialize<OpenAIResponse>(responseBody);
                
                // Extragem și returnăm conținutul mesajului
                return responseObject?.Choices?[0]?.Message?.Content?.Trim() ?? string.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la comunicarea cu OpenAI");
                throw new Exception("Nu s-a putut obține răspunsul de la OpenAI", ex);
            }
        }

        private class OpenAIResponse
        {
            [JsonPropertyName("choices")]
            public Choice[] Choices { get; set; } = Array.Empty<Choice>();

            public class Choice
            {
                [JsonPropertyName("message")]
                public Message Message { get; set; } = new Message();
            }

            public class Message
            {
                [JsonPropertyName("content")]
                public string Content { get; set; } = string.Empty;
            }
        }
    }
}