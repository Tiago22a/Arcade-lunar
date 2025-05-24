using back_end.Data;
using back_end.DTOs;
using back_end.Exceptions;
using back_end.Models;
using MercadoPago.Resource.Preference;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class OrderService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly MercadoPagoService _mercadoPagoService;

    public OrderService(
        ApplicationDbContext context,
        UserManager<User> userManager,
        MercadoPagoService mercadoPagoService)
    {
        _context = context;
        _userManager = userManager;
        _mercadoPagoService = mercadoPagoService;
    }

    public async Task<int> CreateOrder(
        ICollection<CreateOrderItemDto> orderItems,
        string userEmail)
    {
        User user = await _userManager.FindByEmailAsync(userEmail)
                     ?? throw new UserNotFoundException(userEmail);

        // Existe para buscar os itens do pedido de forma assíncrona. 
        var resolvedOrderItems = await Task.WhenAll(
            orderItems.Select(async oi => new OrderItem
            {
                Quantity = oi.Quantity,
                Product = await _context.Products.FindAsync(oi.ProductId)
                ?? throw new ProductNotFoundException(oi.ProductId),
            }).ToList());

        var preference = await _mercadoPagoService.CreatePreference(resolvedOrderItems);
        
        Order order = new Order
        {
            User = user,
            Status = "payment_pending",
            DateCreated = DateTime.Now,
            OrderItems = resolvedOrderItems,
            MercadoPagoPreferenceId = preference.Id,
            TotalPrice = resolvedOrderItems.Sum(oi => 
                oi.Product!.Discount != null 
                && oi.Product.Discount > 0 
                    ? oi.Product.Price - oi.Product.Price * oi.Product.Discount
                    : oi.Product.Price),
        };

        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();

        return order.Id;
    }

    public async Task<string> GetOrderPreference(int id, string userEmail)
    {
        var user = await _userManager.FindByEmailAsync(userEmail)
            ?? throw new UserNotFoundException(userEmail);

        var order = await _context.Orders.FirstOrDefaultAsync(o =>
                        o.Id == id && o.User == user)
                    ?? throw new OrderNotFoundException(id);
        
        return order.MercadoPagoPreferenceId;
    }
}