using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public class LoginUserDto
{
    [Required]
    public string Email { get; set; } = "";
    
    [Required]
    public string Password { get; set; } = "";
}