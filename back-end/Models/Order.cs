using System.ComponentModel.DataAnnotations;
using MercadoPago.Resource.Preference;
using Microsoft.EntityFrameworkCore;

namespace back_end.Models;

public class Order
{
    public int Id { get; set; }
    
    [Required]
    public DateTime DateCreated { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Status { get; set; } = "";
    
    [Required]
    [Precision(18, 2)]
    public decimal TotalPrice { get; set; }
    
    public Preference? MercadoPagoPreference { get; set; }
    
    [Required]
    public User? User { get; set; }
    
    [Required]
    public ICollection<OrderItem>? OrderItems { get; set; } = new List<OrderItem>();
}