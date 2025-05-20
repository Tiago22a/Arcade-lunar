namespace back_end.Exceptions;

public class EmailAlreadyConfirmedException : Exception, IHasProblemDetails
{
    public int StatusCode { get; set; } = StatusCodes.Status409Conflict;
    public string Title { get; set; } = "Email already confirmed";
    public string? Detail { get; set; }
    public Dictionary<string, object>? Extensions { get; set; } = new Dictionary<string, object>();

    public EmailAlreadyConfirmedException(string email)
        : base($"{email} is already confirmed")
    {
        Detail = Message;
    }
}