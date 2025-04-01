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

        // Get all books
        [HttpGet]
        public async Task<ActionResult<object>> GetBooks(int page = 1, int pageSize = 5, string? sortBy = "TitleAsc", string? categories = null)
        {
            var query = _context.Books.AsQueryable();

            // Filter by categories if provided
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
                .ToListAsync();

            return new { books, totalCount };
        }

        // ADD: Add a new book
        [HttpPost]
        public async Task<ActionResult<Book>> AddBook([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest("Invalid book data.");
            }

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBooks), new { id = book.BookID }, book);
        }

        // UPDATE: Update existing book
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
        {
            if (id != book.BookID)
            {
                return BadRequest("Book ID mismatch.");
            }

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Books.Any(e => e.BookID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: Delete book
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
