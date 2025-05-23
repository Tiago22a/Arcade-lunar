namespace back_end.DTOs;

public class ShowReviewDto
{
    public string? Comment { get; set; }
    public decimal Rating { get; set; }
    public string Username { get; set; } = "";
}