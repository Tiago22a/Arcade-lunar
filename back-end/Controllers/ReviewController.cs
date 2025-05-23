using System.Security.Claims;
using back_end.DTOs;
using back_end.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/review")]
public class ReviewController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewController(ReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview(CreateReviewDto reviewDto)
    {
        string userEmail = User.FindFirstValue(ClaimTypes.Email)!;;
        int reviewId = await _reviewService.CreateReview(reviewDto, userEmail);
        
        return Created($"/api/review/{reviewId}", reviewDto);
    }

    [HttpGet("product/{id}")]
    public async Task<IActionResult> GetReviewsByProduct(int id, int page = 1, int pageSize = 5)
    {
        var reviews = 
            await _reviewService.GetReviewsByProduct(
                id,
                page,
                pageSize);
        
        return Ok(reviews);
    }

    [HttpGet("product/{id}/quantity")]
    public async Task<IActionResult> GetReviewsQuantityByProduct(int id)
    {
        int quantity = await _reviewService.GetReviewsQuantityByProduct(id);
        
        return Ok(quantity);   
    }

    [HttpGet("product/{id}/average")]
    public async Task<IActionResult> GetAverageRatingOfProduct(int id)
    {
        decimal averageRating = await _reviewService.GetAverageRatingOfProduct(id);
        
        return Ok(averageRating);  
    }
}