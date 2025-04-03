// Weston Watson, Team 3, Section

import axios from "axios";
import { Book } from "../models/Book";

const isLocalhost = window.location.hostname === "localhost";
const API_URL = isLocalhost
  ? "http://localhost:5085/api/books"
  : "https://mission13-watson-backend-chg6e2c0guf5bfc2.centralus-01.azurewebsites.net/api/books";



  // Get all books
export const getBooks = async (
  page: number,
  pageSize: number,
  sortBy: string,
  categories: string[] = []
) => {
  try {
    // Build category query param
    const categoryParam = categories.length
      ? `&categories=${categories.join(",")}`
      : "";

    // Call API to get books
    const response = await axios.get(
      `${API_URL}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}${categoryParam}`
    );

    // Map books properly and handle potential undefined values
    return {
      ...response.data,
      books: response.data.books.map((book: any) => ({
        bookID: book.BookID,
        title: book.Title,
        author: book.Author,
        publisher: book.Publisher,
        isbn: book.ISBN,
        classification: book.Classification,
        category: book.Category ?? "Uncategorized",
        numberOfPages: book.NumberOfPages ?? 0,
        price: book.Price !== undefined && !isNaN(book.Price)
          ? parseFloat(book.Price)
          : 0.0,
      })),
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { books: [], totalCount: 0 }; // Return empty data if error occurs
  }
};

// Add new book
// Add a new book
export const addBook = async (book: Partial<Book>) => {
  try {
    // Check if all required fields are present
    if (
      !book.title ||
      !book.author ||
      !book.publisher ||
      !book.isbn ||
      !book.classification ||
      !book.category ||
      !book.numberOfPages ||
      book.price === undefined
    ) {
      throw new Error("Missing required fields. Please fill in all fields.");
    }

    // Prepare book object with default values if needed
    const newBook = {
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      numberOfPages: book.numberOfPages || 0,
      price: book.price || 0.0,
    };

    // Send POST request to backend
    const response = await axios.post(`${API_URL}`, newBook);
    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};


// Update existing book
export const updateBook = async (book: Book) => {
  await axios.put(`${API_URL}/${book.bookID}`, book);
};

// Delete book
export const deleteBook = async (bookID: number) => {
  await axios.delete(`${API_URL}/${bookID}`);
};