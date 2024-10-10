import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import './Confirm.css';

const Confirm = () => {
  const { products, cartItems, getTotalCartAmount } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number

  const handleConfirmOrder = async () => {
    try {
      const orderedProducts = products
        .filter(product => cartItems[product.id] > 0)
        .map(product => ({
          id: product.id,
          name: product.name,
          quantity: cartItems[product.id],
          price: product.new_price,
          total: product.new_price * cartItems[product.id],
        }));

      // Check if there are products in the cart
      if (orderedProducts.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert("You are not logged in! Please log in to confirm the order.");
        return;
      }

      // Make API request to confirm the order
      const response = await fetch(`${backend_url}/confirmorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({ products: orderedProducts, totalAmount, phoneNumber }), // Include phone number
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Order confirmed successfully!");
      } else {
        alert(data.errors || "Order confirmation failed!");
      }
    } catch (error) {
      alert("An error occurred while confirming the order. Please try again.");
    }
  };

  return (
    <div className="confirm">
      <h1>Confirm Your Order</h1>
      <div className="confirm-items">
        {products.map((product) => {
          if (cartItems[product.id] > 0) {
            return (
              <div key={product.id} className="confirm-item">
                <img src={backend_url + product.image} alt={product.name} />
                <div className="confirm-item-details">
                  <h3>{product.name}</h3>
                  <p>{currency}{product.new_price} x {cartItems[product.id]}</p>
                  <p>Total: {currency}{product.new_price * cartItems[product.id]}</p>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <h2>Total Amount: {currency}{totalAmount}</h2>
      <label>
        Phone Number:
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)} // Capture phone number
        />
      </label>
      <button onClick={handleConfirmOrder}>Confirm Order</button>
    </div>
  );
};

export default Confirm;
