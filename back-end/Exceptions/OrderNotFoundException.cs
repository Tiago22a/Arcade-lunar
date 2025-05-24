namespace back_end.Exceptions;

public class OrderNotFoundException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status404NotFound;
    public string Title { get; set; } = "Order not found";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; } = new Dictionary<string, object>();
    
    public OrderNotFoundException(int orderId)
        : base($"Order {orderId} not found")
    {
        Detail = Message;
    }
}