namespace back_end.Exceptions;

public class InvalidTokenException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status400BadRequest;
    public string Title { get; set; } = "Invalid or expired token";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; } = new Dictionary<string, object>();
}