// Weston Watson, Team 3, Section
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookList from "./components/BookList";
import AddToCart from "./components/AddToCart";
import CartPage from "./components/CartPage"; // ✅ New Cart Page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/add-to-cart/:bookID" element={<AddToCart />} />
        <Route path="/cart" element={<CartPage />} /> {/* ✅ Add Cart Page Route */}
      </Routes>
    </Router>
  );
}

export default App;

