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
                CurrencyId = "BRL",
                UnitPrice = oi.Product?.Price - oi.Product?.Price * oi.Product?.Discount,
            }).ToList(),
            // BackUrls = new PreferenceBackUrlsRequest
            // {
            //     Success = "http://localhost:5500/payment/approved.html",
            //     Failure = "http://localhost:5500/payment/refused.html",
            //     Pending = "http://localhost:5500/payment/pending.html"
            // },
            // AutoReturn = "approved",
        };

        var client = new PreferenceClient();
        Preference preference = await client.CreateAsync(request);
        
        return preference;
    }
}