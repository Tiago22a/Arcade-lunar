using System.ComponentModel.DataAnnotations;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.DTOs;

public class CreateProductDto
{
    [Required]
    [MaxLength(255)] 
    public string Name { get; set; } = "";

    [Required]
    [Precision(18, 2)]
    public decimal Price { get; set; }
    
    [Precision(4, 2)]
    public decimal? Discount { get; set; }
    
    [Required]
    public int TypeId { get; set; }
}