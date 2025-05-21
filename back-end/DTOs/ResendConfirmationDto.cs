using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public class ResendConfirmationDto
{
    public string Token { get; set; } = "";
    public string Email { get; set; } = "";
    public string Name { get; set; } = "";
}