// Weston Watson, Team 3, Section

import React, { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import { Book } from "../models/Book";
import { Table, Pagination, Form, Container, Row, Col, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "bootstrap";

const categoriesList = [
    "Biography",
    "Self-Help",
    "Classic",
    "Health",
    "Thrillers",
    "Historical",
    "Action",
    "Christian Books",
    "Business"
  ];

const BookList = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortBy, setSortBy] = useState("TitleAsc");  // Default sorting: A-Z
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<string[]>([]);
    const { cart, clearCart, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCategoryChange = (category: string) => {
        setCategories((prev) =>
          prev.includes(category)
            ? prev.filter((c) => c !== category)
            : [...prev, category]
        );
      };

      useEffect(() => {
        getBooks(page, pageSize, sortBy, categories).then((data) => {
          setBooks(data.books);
          setTotalPages(Math.ceil(data.totalCount / pageSize));
          setTimeout(() => {
            const tooltipTriggerList = [].slice.call(
              document.querySelectorAll('[data-bs-toggle="tooltip"]')
            );
            tooltipTriggerList.forEach((tooltipTriggerEl) => {
              new Tooltip(tooltipTriggerEl);
            });
          }, 100);
        });
      }, [page, pageSize, sortBy, categories]);

      return (
        <Container fluid className="mt-4 px-0">
            <h2 className="text-center mb-4">Online Bookstore</h2>
            <Row className="gx-0">  {/* gx-0 removes horizontal spacing */}
            {/* Left Side: Category Filter */}
            <Col lg={3} md={3} sm={12} className="border-end px-3 text-end" style={{ paddingLeft: "0px" }}>
                <h5 className="mb-3 text-end">Filter by Category</h5>
                {categoriesList.map((category) => (
                <div key={category} className="d-flex justify-content-end align-items-center mb-2">
                    <span className="me-2">{category}</span>
                    <input
                    type="checkbox"
                    id={`checkbox-${category}`}
                    checked={categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="form-check-input"
                    style={{ marginLeft: "5px" }}
                    />
                </div>
                ))}
            </Col>

            {/* Center: Book Table and Sorting Controls */}
            <Col lg={6} md={6} sm={12} className="px-4">
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

                {/* Book Table */}
                <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm w-100">
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
                        <th>Add to Cart</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((book) => (
                        <tr key={book.bookID}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td>{book.isbn}</td>
                        <td>{book.classification}</td>
                        <td>{book.category}</td>
                        <td>{book.numberOfPages}</td>
                        <td>${book.price.toFixed(2)}</td>
                        <td>
                        <button
                            className="btn btn-primary btn-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Add this book to your cart"
                            id={`add-to-cart-${book.bookID}`}
                            onClick={(e) => {
                                navigate(`/add-to-cart/${book.bookID}`);

                                // *******SPECIAL BOOTSTRAP FEATURE 1!!!! Hide tooltip after clicking Add to Cart
                                const tooltipElement = document.getElementById(`add-to-cart-${book.bookID}`);
                                if (tooltipElement) {
                                const tooltipInstance = Tooltip.getInstance(tooltipElement); // Get the tooltip instance
                                if (tooltipInstance) {
                                    tooltipInstance.hide(); // Hide the tooltip
                                }
                                }
                            }}
                            >
                            Add to Cart
                        </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </div>

                {/* Pagination */}
                <Pagination className="justify-content-center">
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
            </Col>

            {/* Right Side: Shopping Cart Summary */}
            <Col lg={3} md={3} sm={12} className="border-start px-3" style={{ paddingRight: "0px" }}>
                <h5 className="mb-3 text-start">Shopping Cart</h5>
                {cart.length === 0 ? (
                    <p className="text-start">Your cart is empty.</p>
                    ) : (
                    <>
                        {/* *******SPECIAL BOOTSTRAP FEATURE 2!!!! progress Bar for Tracking Items */}
                        <div className="progress mb-3" style={{ height: "20px" }}>
                        <div
                            className="progress-bar bg-info"
                            role="progressbar"
                            style={{ width: `${Math.min((cart.length / 10) * 100, 100)}%` }}
                            aria-valuenow={cart.length}
                            aria-valuemin={0}
                            aria-valuemax={10} 
                        >
                            {cart.length}/10 items
                        </div>
                        </div>

                        {/* Cart Items List */}
                        <ul className="list-group mb-3 shadow-sm">
                        {cart.map((item) => (
                            <li
                            key={item.bookID}
                            className="list-group-item d-flex justify-content-between align-items-center"
                            >
                            {item.title} ({item.quantity})
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                        </ul>

                        {/* Total Amount */}
                        <h6 className="fw-bold text-start">Total: ${getCartTotal().toFixed(2)}</h6>

                        {/* Checkout Button */}
                        <button className="btn btn-danger w-100 mt-2" onClick={clearCart}>
                        Checkout
                        </button>
                    </>
                    )}
                    {/* View Cart Button */}
                    <Button
                        variant="warning"
                        className="w-100 mt-3"
                        onClick={() => navigate("/cart")}
                        >
                        View Cart
                    </Button>

            </Col>
            </Row>
        </Container>

      );      
};

export default BookList;
