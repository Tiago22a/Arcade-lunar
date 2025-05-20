using System.ComponentModel.DataAnnotations;

namespace back_end.Models;

public class Order
{
    public int Id { get; set; }
    
    [Required]
    public DateTime DateCreated { get; set; }
    
    [Required]
    public User? User { get; set; }

    [Required]
    [MaxLength(100)]
    public string Status { get; set; } = "";
    
    [Required]
    public ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
}