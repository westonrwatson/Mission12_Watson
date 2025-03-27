// Weston Watson, Team 3, Section

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getBooks } from "../services/bookService";
import { Book } from "../models/Book";
import { Container, Button, Form, Row, Col } from "react-bootstrap";


const AddToCart: React.FC = () => {
  const { bookID } = useParams<{ bookID: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      const data = await getBooks(1, 100, "TitleAsc");
      const foundBook = data.books.find((b: Book) => b.bookID === Number(bookID));
      setBook(foundBook || null);
    };

    fetchBook();
  }, [bookID]);

  if (!book) {
    return <p>Loading...</p>;
  }

  const handleAddToCart = () => {
    addToCart(book, quantity);
    navigate("/");
  };

  return (
    <Container className="mt-5">
        <Row>
            <Col md={{ span: 6, offset: 3 }} className="shadow-sm p-4 bg-white rounded">
            <h2 className="mb-3">{book.title}</h2>
            <p className="mb-2">Price: <strong>${book.price.toFixed(2)}</strong></p>

            <Form.Group controlId="quantity" className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-50"
                />
            </Form.Group>

            <p className="mb-3">Subtotal: <strong>${(book.price * quantity).toFixed(2)}</strong></p>

            <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={() => navigate("/")}>
                Continue Shopping
                </Button>
                <Button variant="primary" className="ms-2" onClick={handleAddToCart}>
                Add to Cart
                </Button>
            </div>
            </Col>
        </Row>
    </Container>
  );
};

export default AddToCart;
