// Weston Watson, Team 3, Section

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreApi.Models;
using BookstoreApi.Data;

namespace BookstoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;
        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetBooks(int page = 1, int pageSize = 5, string? sortBy = "TitleAsc", string? categories = null)
        {
            var query = _context.Books.AsQueryable();

            // Filtering by categories
            if (!string.IsNullOrEmpty(categories))
            {
                var categoryList = categories.Split(',').ToList();
                query = query.Where(b => categoryList.Contains(b.Category));
            }

            // Sorting logic
            query = sortBy switch
            {
                "TitleAsc" => query.OrderBy(b => b.Title),
                "TitleDesc" => query.OrderByDescending(b => b.Title),
                _ => query.OrderBy(b => b.Title)
            };

            var totalCount = await query.CountAsync();
            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new
                {
                    b.BookID,
                    b.Title,
                    b.Author,
                    b.Publisher,
                    b.ISBN,
                    b.Classification,
                    b.Category,
                    b.NumberOfPages,
                    b.Price
                })
                .ToListAsync();

            return new { books, totalCount };
        }
    }
}
