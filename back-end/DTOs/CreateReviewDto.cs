using System.ComponentModel.DataAnnotations;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.DTOs;

public class CreateReviewDto
{
    [MaxLength(500)]
    public string? Comment { get; set; }
    
    [Required]
    [Precision(2, 1)]
    [Range(0.5, 5)]
    public decimal Rating { get; set; }
    
    [Required]
    public int ProductId { get; set; }
}