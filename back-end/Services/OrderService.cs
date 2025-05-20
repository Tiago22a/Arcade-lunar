using back_end.Data;
using back_end.DTOs;
using back_end.Exceptions;
using back_end.Models;
using Microsoft.AspNetCore.Identity;

namespace back_end.Services;

public class OrderService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public OrderService(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<int> CreateOrder(ICollection<OrderItemDto> orderItems, string userEmail)
    {
        User user = await _userManager.FindByEmailAsync(userEmail)
                     ?? throw new UserNotFoundException(userEmail);

        var resolvedOrderItems = await Task.WhenAll(
            orderItems.Select(async oi => new OrderItem
            {
                Quantity = oi.Quantity,
                Product = await _context.Products.FindAsync(oi.ProductId)
                ?? throw new ProductNotFoundException(oi.ProductId),
            }).ToList());
        
        Order order = new Order
        {
            User = user,
            Status = "payment_pending",
            DateCreated = DateTime.Now,
            OrderItems = resolvedOrderItems
        };

        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();

        return order.Id;
    }
}