namespace back_end.Exceptions;

public class ProductNotFoundException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status404NotFound;
    public string Title { get; set; } = "Product not found";
    public string? Detail { get; set; }
    public Dictionary<string, object> Extensions { get; set; } = new();

    public ProductNotFoundException(int productId)
        : base($"Product {productId} not found")
    {
        Detail = Message;
    }
}