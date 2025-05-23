using System.Security.Claims;
using back_end.Data;
using back_end.DTOs;
using back_end.Models;
using back_end.Services;
using MercadoPago.Resource.Preference;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/order")]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrderController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(ICollection<CreateOrderItemDto> orderItems)
    {
        string userEmail = User.FindFirstValue(ClaimTypes.Email)!;
        int orderId = await _orderService.CreateOrder(orderItems, userEmail);
        
        return Created($"/order/{orderId}", orderItems);
    }

    [HttpGet("{id}/preference")]
    [Authorize]
    public async Task<IActionResult> GetOrderPreference(int id)
    {
        string userEmail = User.FindFirstValue(ClaimTypes.Email)!;
        string preferenceId = await _orderService.GetOrderPreference(id, userEmail);
        
        return Ok(preferenceId);
    }
}