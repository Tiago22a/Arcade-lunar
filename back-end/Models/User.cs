using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace back_end.Models;

public class User : IdentityUser
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = "";
    
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}