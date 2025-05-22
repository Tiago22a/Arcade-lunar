using back_end.Data;
using back_end.DTOs;
using back_end.Models;

namespace back_end.Services;

public class ProductTypeService
{
    private readonly ApplicationDbContext _context;

    public ProductTypeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> CreateProductType(CreateProductTypeDto typeDto)
    {
        ProductType productType = new ProductType
        {
            Name = typeDto.Name,
        };
        
        await _context.ProductTypes.AddAsync(productType);
        await _context.SaveChangesAsync();
        
        return productType.Id;
    }

    public ICollection<ShowProductTypeDTO> GetAllProductTypes()
    {
        List<ShowProductTypeDTO> listProductTypeDto = _context.ProductTypes
            .Select(pt => new ShowProductTypeDTO
            {
                Id = pt.Id,
                Name = pt.Name,
            })
            .ToList();

        return listProductTypeDto;
    }
}