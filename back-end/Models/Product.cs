using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = "";
    
    [Required]
    [Precision(18, 2)]
    public decimal Price { get; set; }
    
    [Precision(4, 2)]
    public decimal? Discount { get; set; }
    
    [Required]
    public ProductType? Type { get; set; }
}