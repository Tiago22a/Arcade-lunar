using back_end.DTOs;
using back_end.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/product-type")]
public class ProductTypeController : ControllerBase
{
    private readonly ProductTypeService _productTypeService;

    public ProductTypeController(ProductTypeService productTypeService)
    {
        _productTypeService = productTypeService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductTypeDto typeDto)
    {
        int typeId = await _productTypeService.CreateProductType(typeDto);
        
        return Created($"/product-type/{typeId}", typeDto);
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetTypes()
    {
        var listProductTypesDto = _productTypeService.GetAllProductTypes();
        
        return Ok(listProductTypesDto);
    }
}