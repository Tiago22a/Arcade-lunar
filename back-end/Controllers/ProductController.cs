using back_end.DTOs;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/product")]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductController(ProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateProductDto product)
    {
        int productId = await _productService.AddProduct(product);
        
        return Created($"/product/{productId}", product);
    }

    [HttpGet("type/{id}")]
    public async Task<IActionResult> GetProductsByType(int id, int page = 1, int pageSize = 10)
    {
        var listProductsByTypeDto = 
            await _productService.GetProductsByType(
                id,
                page,
                pageSize);
        
        return Ok(listProductsByTypeDto);
    }

    [HttpGet("type/{id}/quantity")]
    public async Task<IActionResult> GetProductsByTypeQuantity(int id)
    {
        int quantity = await _productService.GetProductsByTypeQuantity(id);
        
        return Ok(quantity);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var product = await _productService.GetProduct(id);
        
        return Ok(product);
    }
}