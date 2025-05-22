using back_end.Data;
using back_end.DTOs;
using back_end.Exceptions;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

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

    public async Task<ICollection<GetProductsByTypeDto>> GetProductsByType(
        int typeId,
        int page,
        int pageSize)
    {
        var type = await _context.ProductTypes.FindAsync(typeId)
            ?? throw new ProductTypeNotFoundException(typeId);
        
        List<GetProductsByTypeDto> listProductsByTypeDto = await _context.Products
            .Where(p => p.Type == type)
            .OrderBy(p => p.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new GetProductsByTypeDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
            })
            .ToListAsync();
        
        return listProductsByTypeDto;
    }

    public async Task<int> GetProductsByTypeQuantity(int typeId)
    {
        var type = await _context.ProductTypes.FindAsync(typeId)
            ?? throw new ProductTypeNotFoundException(typeId);
        
        return await _context.Products
            .Where(p => p.Type == type)
            .CountAsync();
    }

    public async Task<Product> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Type)
            .FirstAsync(p => p.Id == id)
            ?? throw new ProductNotFoundException(id);;
        
        return product;
    }

    public async Task<int> GetMiniaturesQuantity(int id)
    {
        var product = await _context.Products.FindAsync(id)
            ?? throw new ProductNotFoundException(id);;
        
        string directoryPath = $"wwwroot/images/products/{id}";
        
        return Directory.GetFiles(directoryPath).Length;
    }
}