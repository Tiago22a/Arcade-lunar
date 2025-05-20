using back_end.Data;
using back_end.DTOs;
using back_end.Models;

namespace back_end.Services;

public class ProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> AddProduct(CreateProductDto productDto)
    {
        Product product = new Product
        {
            Name = productDto.Name,
            Price = productDto.Price,
            Discount = productDto.Discount,
            Type = await _context.ProductTypes.FindAsync(productDto.TypeId),
        };
        
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();

        return product.Id;
    }
}