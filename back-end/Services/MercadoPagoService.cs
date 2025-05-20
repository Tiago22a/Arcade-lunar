using back_end.Models;
using MercadoPago.Client.Preference;
using MercadoPago.Resource.Preference;

namespace back_end.Services;

public class MercadoPagoService
{
    public async Task<Preference> CreatePreference(ICollection<OrderItem> orderItems)
    {
        var request = new PreferenceRequest
        {
            Items = orderItems.Select(oi => new PreferenceItemRequest
            {
                Title = oi.Product?.Name,
                Quantity = oi.Quantity,
                CurrencyId = "USD",
                UnitPrice = oi.Product?.Price - oi.Product?.Price * oi.Product?.Discount,
            }).ToList(),
            AutoReturn = "approved",
            BackUrls = new PreferenceBackUrlsRequest
            {
                Success = "https://tiago22a.github.io/Arcade-lunar/home/",
                Failure = "https://tiago22a.github.io/Arcade-lunar/home/",
                Pending = "https://tiago22a.github.io/Arcade-lunar/home/"
            }
        };

        var client = new PreferenceClient();
        Preference preference = await client.CreateAsync(request);
        
        return preference;
    }
}