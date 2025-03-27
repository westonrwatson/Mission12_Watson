// Weston Watson, Team 3, Section

import React from "react";
import { useCart } from "../context/CartContext";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { cart, clearCart, getCartTotal, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h2>Your Cart is Empty</h2>
        <Button variant="primary" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Your Shopping Cart</h2>
      <Table striped bordered hover className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.bookID}>
              <td>{item.title}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item.bookID)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Total Amount */}
      <h5 className="fw-bold text-end mt-3">
        Total: ${getCartTotal().toFixed(2)}
      </h5>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
        <Button variant="danger" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>
    </Container>
  );
};

export default CartPage;
