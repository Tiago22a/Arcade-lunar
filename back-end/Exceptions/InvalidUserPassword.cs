namespace back_end.Exceptions;

public class InvalidUserPassword : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status422UnprocessableEntity;
    public string Title { get; set; } = "Invalid Password";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; } = new Dictionary<string, object>();

    public InvalidUserPassword(IEnumerable<string> errors)
    {
        Extensions["errors"] = errors;
    }
}