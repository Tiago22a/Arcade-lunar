namespace back_end.Exceptions;

public class ProductTypeNotFoundException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status404NotFound;
    public string Title { get; set; } = "Product type not found";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; } = new Dictionary<string, object>();
    
    public ProductTypeNotFoundException(int id)
        : base($"Product type {id} not found")
    {
        Detail = Message;
    }
}