using System.Text.Json.Serialization;
using back_end.Data;
using back_end.Exceptions;
using back_end.Models;
using back_end.Options;
using back_end.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MercadoPago.Config;

var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

MercadoPagoConfig.AccessToken = 
    builder.Configuration.GetValue<string>("MercadoPago:AccessToken");

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(["http://localhost:5500", "http://127.0.0.1:5500"])
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<ProductTypeService>();

builder.Services.AddSingleton<MercadoPagoService>();

builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection("Email"));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<User>(options =>
    {
        options.Password.RequiredLength = 8;
        options.SignIn.RequireConfirmedEmail = true;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.SlidingExpiration = true;
});

builder.Services.AddProblemDetails();   

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => 
        options.SwaggerEndpoint("/openapi/v1.json", "arcade lunar loja"));
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors(myAllowSpecificOrigins);

app.UseStatusCodePages();

app.UseExceptionHandler(appError =>
{
    appError.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        var exception = feature?.Error;
        var traceId = context.TraceIdentifier;
        var path = context.Request.Path;
        var method = context.Request.Method;

        var problem = new ProblemDetails
        {
            Instance = $"{method} {path}",
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal Server Error"
        };

        if (exception is IHasProblemDetails detailedException)
        {
            problem.Status = detailedException.StatusCode;
            problem.Title = detailedException.Title;
            problem.Detail = detailedException.Detail;

            if (detailedException.Extensions != null)
            {
                foreach (var extension in detailedException.Extensions)
                {
                    problem.Extensions[extension.Key] = extension.Value;
                }
            }
        }
        
        problem.Extensions["traceId"] = traceId;

        context.Response.StatusCode = problem.Status ?? 500;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(problem);
    });
});

app.UseAuthorization();

app.MapControllers();

app.Run();