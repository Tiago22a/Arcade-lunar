using back_end.Data;
using back_end.DTOs;
using back_end.Exceptions;
using back_end.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class ReviewService
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public ReviewService(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;   
    }

    public async Task<ICollection<ShowReviewDto>> GetReviewsByProduct(
        int productId,
        int page,
        int pageSize)
    {
        if (!(await _context.Products.AnyAsync(p => p.Id == productId)))
            throw new ProductNotFoundException(productId);

        var reviews = await _context.Reviews
            .OrderByDescending(r => r.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new ShowReviewDto
            {
                Comment = r.Comment,
                Rating = r.Rating,
                Username = r.User.Name,
            })
            .ToListAsync();

        return reviews;
    }

    public async Task<int> CreateReview(CreateReviewDto reviewDto, string userEmail)
    {
        var user = await _userManager.FindByEmailAsync(userEmail)
            ?? throw new UserNotFoundException(userEmail);
        
        var product = await _context.Products.FindAsync(reviewDto.ProductId)
            ?? throw new ProductNotFoundException(reviewDto.ProductId);

        var review = new Review
        {
            Comment = reviewDto.Comment,
            FavoritesCount = 0,
            Rating = reviewDto.Rating,
            User = user,
            Product = product
        };
        
        await _context.Reviews.AddAsync(review);
        await _context.SaveChangesAsync();

        return review.Id;
    }

    public async Task<int> GetReviewsQuantityByProduct(int productId)
    {
        if (!(await _context.Products.AnyAsync(p => p.Id == productId)))
            throw new ProductNotFoundException(productId);
        
        int quantity = await _context.Reviews
            .Where(r => r.Product.Id == productId)
            .CountAsync();
        
        return quantity;
    }

    public async Task<decimal> GetAverageRatingOfProduct(int productId)
    {
        if (!(await _context.Products.AnyAsync(p => p.Id == productId)))
            throw new ProductNotFoundException(productId);
        
        decimal averageRating = await _context.Reviews
            .Where(r => r.Product.Id == productId)
            .AverageAsync(r => r.Rating);
        
        return averageRating;
    }
}