// Weston Watson, Team 3, Section

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookstoreApi.Models
{
    public class Book
    {
        [Key]  
        [Column("BookID")]  // Maps to the BookID column in SQLite
        public int BookID { get; set; } 

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public string Publisher { get; set; }

        [Required]
        public string ISBN { get; set; }

        [Required]
        public string Classification { get; set; }  

        [Required]
        public string Category { get; set; }  // ✅ Added missing Category field

        [Column("PageCount")]  // Match with existing database column name
        [Required]
        public int NumberOfPages { get; set; }

        [Required]
        public decimal Price { get; set; }
    }
}
