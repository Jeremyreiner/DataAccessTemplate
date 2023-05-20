using Microsoft.EntityFrameworkCore;
using Publify.Database.Infrastructure.MySql;
using Publify.Database.Repositories;
using Publify.Shared.Interfaces;
using Serilog;
using System.Diagnostics;
using Microsoft.OpenApi.Models;
using Publify.Services;
using Publify.Shared.Services;
using System.Reflection;
using Swashbuckle.AspNetCore.SwaggerUI;

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

var exeFolderPath = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule!.FileName);

var configFilePath = Path.Combine(exeFolderPath!, "appsettings.json");

var config = builder.Configuration
    .AddJsonFile(configFilePath, optional: true, reloadOnChange: true)
    .Build();

//Services
builder.Services.AddSingleton<MainService>();

builder.Services.AddScoped<IDalService, DalService>();
builder.Services.AddScoped<ITeacherRepository, TeacherRepository>();

//Cors
string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins("http://localhost", "ionic://localhost", "capacitor://localhost", "https://localhost").AllowAnyMethod().AllowAnyHeader();
        });
});

//Swagger Auth
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename), true);

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
        new string[] { }
    }
});
});

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

//ApplicationDbContext on startup
var scope = app.Services.CreateScope();
scope.ServiceProvider.GetService<ApplicationDbContext>();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});
// }

app.UseCors(myAllowSpecificOrigins);

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
