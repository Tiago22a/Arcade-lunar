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
}