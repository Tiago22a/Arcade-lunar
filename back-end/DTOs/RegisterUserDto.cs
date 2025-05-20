using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public class RegisterUserDto
{
    [Required]
    public string Name { get; set; } = "";
    
    [Required]
    public string Email { get; set; } = "";
    
    [Required]
    public string Password { get; set; } = "";
}