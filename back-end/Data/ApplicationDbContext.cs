using back_end.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace back_end.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {}
    
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductType> ProductTypes { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
}