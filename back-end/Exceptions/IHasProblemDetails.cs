namespace back_end.Exceptions;

public interface IHasProblemDetails
{
    int StatusCode { get; }
    string Title { get; }
    string? Detail { get; }
    Dictionary<string, object>? Extensions { get; }
}