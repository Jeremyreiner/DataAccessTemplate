using Microsoft.EntityFrameworkCore;
using Template.Shared.Interfaces;
using Serilog;
using Template.Services;
using Template.Shared.Services;
using Swashbuckle.AspNetCore.SwaggerUI;
using Template.Database.Infrastructure.MySql;
using Template.Database.Repositories;
using Template.Shared.Interfaces.IRepositories;
using Template.Shared.Interfaces.IServices;

var builder = WebApplication.CreateBuilder(args);

//Serilog configuration
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHostedService<InitializationService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Services
builder.Services.AddSingleton<MainService>();

//Data Access Services
builder.Services.AddScoped<IDalService, DalService>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IPostRepository, PostRepository>();

//Swagger Auth
builder.Services.AddSwaggerGen();

builder.Services.Configure<SwaggerUIOptions>(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");

    // Enable dark mode and add custom stylesheet
    options.InjectStylesheet("/swagger-dark.css");
    options.EnableValidator();
});

//MySQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("MySql"),
        new MySqlServerVersion(ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MySql")))));

var app = builder.Build();

//AppDbContext on startup
var scope = app.Services.CreateScope();

scope.ServiceProvider.GetService<ApplicationDbContext>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
}

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();


app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapControllers();

app.Run();
