namespace back_end.Exceptions;

public class InvalidUserException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status401Unauthorized;
    public string Title { get; set; } = "User not authorized";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; }

    public InvalidUserException()
        : base("Username or password is incorrect")
    {
        Detail = Message;
    }
}