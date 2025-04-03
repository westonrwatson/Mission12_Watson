// Weston Watson, Team 3, Section
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Form, Modal, Pagination } from "react-bootstrap";
import { getBooks, addBook, updateBook, deleteBook } from "../services/bookService";
import { Book } from "../models/Book";

// Classification options
const classificationOptions = ["Fiction", "Non-Fiction"];

// Category options
const categoryOptions = [
  "Biography",
  "Self-Help",
  "Classic",
  "Health",
  "Thrillers",
  "Historical",
  "Action",
  "Christian Books",
  "Business",
];

const AdminPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState<Partial<Book>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks(page, pageSize);
  }, [page, pageSize]);

  const fetchBooks = async (page: number, pageSize: number) => {
    const data = await getBooks(page, pageSize, "TitleAsc");
    setBooks(data.books);
    setTotalPages(Math.ceil(data.totalCount / pageSize));
  };

  const handleDelete = async (bookID: number) => {
    await deleteBook(bookID);
    fetchBooks(page, pageSize);
  };

  const handleSave = async () => {
    const newErrors: { [key: string]: string } = {};

    // Check required fields
    if (!currentBook.title) newErrors.title = "Title is required.";
    if (!currentBook.author) newErrors.author = "Author is required.";
    if (!currentBook.publisher) newErrors.publisher = "Publisher is required.";
    if (!currentBook.isbn) newErrors.isbn = "ISBN is required.";
    if (!currentBook.classification) newErrors.classification = "Classification is required.";
    if (!currentBook.category) newErrors.category = "Category is required.";
    if (!currentBook.numberOfPages || currentBook.numberOfPages <= 0)
      newErrors.numberOfPages = "Number of pages must be greater than 0.";
    if (currentBook.price === undefined || currentBook.price <= 0)
      newErrors.price = "Price must be greater than 0.";

    // If errors exist, set errors and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const isEdit = !!currentBook.bookID;
    
      if (isEdit) {
        await updateBook(currentBook as Book);
      } else {
        await addBook(currentBook as Book);
        setPage(1); // 🔁 Reset to page 1 after adding
      }
    
      setShowModal(false);
      await fetchBooks(isEdit ? page : 1, pageSize); // 🔁 Make sure it fetches from the correct page
      setErrors({});
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleEdit = (book: Book) => {
    setCurrentBook(book);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentBook({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      classification: "",
      category: "",
      numberOfPages: 0,
      price: 0,
    });
    setShowModal(true);
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Admin Page</h2>
      <Table striped bordered hover className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookID}>
              <td>{book.title || "N/A"}</td>
              <td>{book.author || "N/A"}</td>
              <td>{book.publisher || "N/A"}</td>
              <td>{book.isbn || "N/A"}</td>
              <td>{book.classification || "N/A"}</td>
              <td>{book.category || "N/A"}</td>
              <td>{book.numberOfPages || "N/A"}</td>
              <td>
                {book.price !== undefined && book.price !== null
                  ? `$${book.price.toFixed(2)}`
                  : "N/A"}
              </td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(book)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(book.bookID)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

        {/* Pagination and Add New Book Button */}
        <div className="d-flex justify-content-center align-items-center mt-3 position-relative">
        {/* Centered Pagination */}
        <Pagination className="mb-0">
            <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page === 1} />
            {Array.from({ length: totalPages }, (_, num) => (
            <Pagination.Item
                key={num + 1}
                active={num + 1 === page}
                onClick={() => setPage(num + 1)}
            >
                {num + 1}
            </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setPage(page + 1)} disabled={page === totalPages} />
        </Pagination>

        {/* Add New Book Button - Aligned Right */}
        <Button variant="success" className="ms-auto position-absolute end-0" onClick={handleAdd}>
            Add New Book
        </Button>
        </div>
        
      {/* Modal for Add/Edit Book */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentBook.bookID ? "Edit Book" : "Add New Book"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={currentBook.title || ""}
                onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                value={currentBook.author || ""}
                onChange={(e) => setCurrentBook({ ...currentBook, author: e.target.value })}
                isInvalid={!!errors.author}
              />
              <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                type="text"
                value={currentBook.publisher || ""}
                onChange={(e) => setCurrentBook({ ...currentBook, publisher: e.target.value })}
                isInvalid={!!errors.publisher}
              />
              <Form.Control.Feedback type="invalid">{errors.publisher}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                value={currentBook.isbn || ""}
                onChange={(e) => setCurrentBook({ ...currentBook, isbn: e.target.value })}
                isInvalid={!!errors.isbn}
              />
              <Form.Control.Feedback type="invalid">{errors.isbn}</Form.Control.Feedback>
            </Form.Group>

            {/* Classification Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Classification</Form.Label>
              <Form.Select
                value={currentBook.classification || ""}
                onChange={(e) => setCurrentBook({ ...currentBook, classification: e.target.value })}
                isInvalid={!!errors.classification}
              >
                <option value="" disabled>
                  Select Classification
                </option>
                {classificationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.classification}</Form.Control.Feedback>
            </Form.Group>

            {/* Category Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={currentBook.category || ""}
                onChange={(e) => setCurrentBook({ ...currentBook, category: e.target.value })}
                isInvalid={!!errors.category}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pages</Form.Label>
              <Form.Control
                type="number"
                value={currentBook.numberOfPages || ""}
                onChange={(e) =>
                  setCurrentBook({ ...currentBook, numberOfPages: Number(e.target.value) })
                }
                isInvalid={!!errors.numberOfPages}
              />
              <Form.Control.Feedback type="invalid">{errors.numberOfPages}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={currentBook.price || ""}
                onChange={(e) => setCurrentBook({ ...currentBook, price: Number(e.target.value) })}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPage;