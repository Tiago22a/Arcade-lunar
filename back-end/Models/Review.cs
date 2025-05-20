using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models;

public class Review
{
    public int Id { get; set; }
    
    [MaxLength(500)]
    public string? Comment { get; set; }
    
    public int? FavoritesCount { get; set; }
    
    [Required]
    [Precision(2, 1)]
    public decimal Rating { get; set; }
    
    [Required]
    public User? User { get; set; }
}