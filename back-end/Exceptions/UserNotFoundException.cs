namespace back_end.Exceptions;

public class UserNotFoundException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status404NotFound;
    public string Title { get; set; } = "User not found";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; } = new Dictionary<string, object>();

    public UserNotFoundException(string user)
        : base($"{user} not found")
    {
        Detail = Message;
    }
}