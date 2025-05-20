namespace back_end.Exceptions;

public class UserAlreadyExistsException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status409Conflict;
    public string Title { get; set; } = "User already exists";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; }

    public UserAlreadyExistsException(string username)
        : base($"{username} already exists")
    {
        Detail = Message;
    }
}