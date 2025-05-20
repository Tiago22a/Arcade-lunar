using back_end.DTOs;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly EmailService _emailService;

    public AuthController(AuthService authService, EmailService emailService)
    {
        _authService = authService;
        _emailService = emailService;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser(RegisterUserDto userDto)
    {
        string token = await _authService.RegisterUser(userDto);
        await _emailService.SendConfirmationEmail(userDto.Email, userDto.Name, token);
        
        return Ok(new { success = true });
    }

    [HttpGet]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        await _authService.ConfirmEmail(userId, token);
        
        return Ok(new { success = true }); 
    }
}