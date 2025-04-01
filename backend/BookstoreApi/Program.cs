// Weston Watson, Team 3, Section

using Microsoft.EntityFrameworkCore;
using BookstoreApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Ensure that JSON results are properly formatted.
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // Keep original casing
    });

// Configure EF Core to use SQLite
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// Enable CORS to allow requests from your React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.AllowAnyOrigin() // Allow requests from React
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable CORS before other middleware
app.UseCors("AllowReactApp");

// Enable Swagger in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bookstore API v1");
    });
}

// Force HTTPS redirection
app.UseHttpsRedirection();

// Add authorization
app.UseAuthorization();

// Map controller endpoints
app.MapControllers();

// Run the app
app.Run();
