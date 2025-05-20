using System.ComponentModel.DataAnnotations;

namespace back_end.DTOs;

public class OrderItemDto
{
    [Required]
    public int Quantity  { get; set; }
    
    [Required]
    public int ProductId { get; set; }
}