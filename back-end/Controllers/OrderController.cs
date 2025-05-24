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
        ShowOrderDto orderDto = await _orderService.CreateOrder(orderItems, userEmail);
        
        return Created($"/order/{orderDto.Id}", orderDto);
    }
}