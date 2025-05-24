using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace back_end.Models;

public class OrderItem
{
    public int Id { get; set; }
    
    [Required]
    public int Quantity { get; set; }
    
    [Required]
    public Product? Product { get; set; }
    
    [Required]
    [JsonIgnore]
    public Order? Order { get; set; }
}