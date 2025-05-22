using System.Net;
using back_end.Data;
using back_end.DTOs;
using back_end.Exceptions;
using back_end.Models;
using Microsoft.AspNetCore.Identity;

namespace back_end.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AuthService(
        ApplicationDbContext context,
        UserManager<User> userManager,
        SignInManager<User> signInManager)
    {
        _context = context;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<string> RegisterUser(RegisterUserDto userDto)
    {
        var user = new User
        {
            UserName = userDto.Email,
            Email = userDto.Email,
            Name = userDto.Name
        };
        
        var resultCreationResult = await _userManager.CreateAsync(user, userDto.Password);

        // Criado para retornar o devido erro se a criação não for bem sucedida.
        if (!resultCreationResult.Succeeded)
        {
            string? emailError = resultCreationResult.Errors
                .Where(e => e.Description.StartsWith("Username"))
                .Select(e => e.Description)
                .FirstOrDefault();

            if (emailError != null) throw new UserAlreadyExistsException(userDto.Email);
            
            List<string> passwordErrors = resultCreationResult.Errors
                .Where(e => e.Code.StartsWith("Password"))
                .Select(e => e.Description)
                .ToList();

            if (passwordErrors.Any()) throw new InvalidUserPassword(passwordErrors);
        }
        
        return await _userManager.GenerateEmailConfirmationTokenAsync(user);
    }

    public async Task<ResendConfirmationDto> GenerateEmailConfirmationTokenAsync(string userId)
    {
        User user = await _userManager.FindByEmailAsync(userId)
            ?? throw new UserNotFoundException(userId);
        
        if (await _userManager.IsEmailConfirmedAsync(user)) 
            throw new EmailAlreadyConfirmedException(userId); 
        
        string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        ResendConfirmationDto resendConfirmationDto = new ResendConfirmationDto
        {
            Token = token,
            Email = user.Email!,
            Name = user.Name!
        };
        
        return resendConfirmationDto;
    }
    
    public async Task LoginUser(LoginUserDto userDto)
    {
        SignInResult result = await _signInManager.PasswordSignInAsync(
            userDto.Email,
            userDto.Password,
            false,
            false);
        
        if (!result.Succeeded) throw new InvalidUserException();   
    }

    public async Task ConfirmEmail(string userId, string token)
    {
        User? user = await _userManager.FindByEmailAsync(userId);
        
        if (user == null) throw new UserNotFoundException(userId);
        
        IdentityResult emailConfirmationResult = await _userManager.ConfirmEmailAsync(user, token);
        
        foreach (var error in emailConfirmationResult.Errors)
        {
            if (error.Code.ToLower().Contains("token")) throw new InvalidTokenException();
            if (error.Code.ToLower().Contains("email")) throw new EmailAlreadyConfirmedException(userId);
        }
    }
}