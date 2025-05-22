namespace back_end.DTOs;

public class GetProductsByTypeDto
{
    public int Id { get; set; }
    
    public string Name { get; set; } = "";
    
    public decimal Price { get; set; }
    
    public decimal? Discount { get; set; }
}