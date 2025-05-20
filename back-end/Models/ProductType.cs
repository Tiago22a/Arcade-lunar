using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace back_end.Models;

public class ProductType
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = "";
    
    [JsonIgnore]
    public ICollection<Product> Products { get; set; } = new List<Product>();
}