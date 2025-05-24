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

    public async Task<ShowOrderDto> CreateOrder(
        ICollection<CreateOrderItemDto> orderItems,
        string userEmail)
    {
        User user = await _userManager.FindByEmailAsync(userEmail)
                     ?? throw new UserNotFoundException(userEmail);

        var productsIds = orderItems
            .Select(oi => oi.ProductId)
            .ToList();
        
        var products = await _context.Products
            .Where(p => productsIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);
        
        // Existe para buscar os itens do pedido de forma assíncrona. 
        var resolvedOrderItems = orderItems.Select(oi =>
        {
            if (!products.TryGetValue(oi.ProductId, out var product))
                throw new ProductNotFoundException(oi.ProductId);

            return new OrderItem
            {
                Quantity = oi.Quantity,
                Product = product
            };
        }).ToList();

        var preference = await _mercadoPagoService.CreatePreference(resolvedOrderItems);
        
        Order order = new Order
        {
            User = user,
            Status = "payment_pending",
            DateCreated = DateTime.Now,
            OrderItems = resolvedOrderItems,
            TotalPrice = resolvedOrderItems.Sum(oi => 
                oi.Product!.Discount != null 
                && oi.Product.Discount > 0 
                    ? oi.Product.Price - oi.Product.Price * oi.Product.Discount
                    : oi.Product.Price),
        };

        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();

        return new ShowOrderDto
        {
            Id = order.Id,
            MercadoPagoPreferenceId = preference.Id,
        };
    }
}