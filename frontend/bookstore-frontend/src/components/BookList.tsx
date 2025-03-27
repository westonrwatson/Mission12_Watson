// Weston Watson, Team 3, Section

import { useState, useEffect } from "react";
import { getBooks } from "../services/bookService";
import { Book } from "../models/Book";
import { Table, Pagination, Form, Container } from "react-bootstrap";

const BookList = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortBy, setSortBy] = useState("TitleAsc");  // Default sorting: A-Z
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getBooks(page, pageSize, sortBy)
            .then(data => {
                setBooks(data.books);
                setTotalPages(Math.ceil(data.totalCount / pageSize));
            });
    }, [page, pageSize, sortBy]);

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Online Bookstore</h2>

            {/* Sorting and Page Size Controls */}
            <div className="d-flex justify-content-between mb-3">
                <Form.Select 
                    onChange={(e) => setSortBy(e.target.value)} 
                    value={sortBy}
                    style={{ width: "200px" }}
                >
                    <option value="TitleAsc">Sort by Title (A-Z)</option>
                    <option value="TitleDesc">Sort by Title (Z-A)</option>
                </Form.Select>

                <Form.Select 
                    onChange={(e) => setPageSize(Number(e.target.value))} 
                    value={pageSize}
                    style={{ width: "200px" }}
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={15}>15 per page</option>
                </Form.Select>
            </div>

            {/* Table Displaying Books */}
            <Table striped bordered hover>
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
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.bookID}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publisher}</td>
                            <td>{book.isbn}</td>
                            <td>{book.classification}</td>
                            <td>{book.category}</td>
                            <td>{book.numberOfPages}</td>
                            <td>${book.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
                <Pagination.Prev 
                    onClick={() => setPage(page - 1)} 
                    disabled={page === 1}
                />
                {Array.from({ length: totalPages }, (_, num) => num).map(num => (
                    <Pagination.Item 
                        key={num + 1} 
                        active={num + 1 === page} 
                        onClick={() => setPage(num + 1)}
                    >
                        {num + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next 
                    onClick={() => setPage(page + 1)} 
                    disabled={page === totalPages}
                />
            </Pagination>
        </Container>
    );
};

export default BookList;
