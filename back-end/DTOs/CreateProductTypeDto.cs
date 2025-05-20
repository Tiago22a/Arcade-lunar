using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public class CreateProductTypeDto
{
    [Required] 
    [MaxLength(255)]
    public string Name { get; set; } = "";
}