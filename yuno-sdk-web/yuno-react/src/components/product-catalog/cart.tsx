import React from 'react';
import type { CartItem } from './types';

interface CartProps {
  cart: CartItem[];
  totalPrice: number;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  totalPrice,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  onCheckout
}) => {
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      onRemoveFromCart(productId);
    } else {
      onUpdateQuantity(productId, newQuantity);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getShippingCost = () => {
    return totalPrice > 100 ? 0 : 9.99;
  };

  const getTax = () => {
    return totalPrice * 0.08; // 8% tax
  };

  const getFinalTotal = () => {
    return totalPrice + getShippingCost() + getTax();
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3 className="empty-cart-title">Your cart is empty</h3>
          <p className="empty-cart-description">Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Shopping Cart</h2>
        <button
          onClick={onClearCart}
          className="clear-cart-btn"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.product.id} className="cart-item">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="cart-item-image"
            />
            <div className="cart-item-info">
              <h4 className="cart-item-name">
                {item.product.name}
              </h4>
              <p className="cart-item-price">
                ${item.product.price.toFixed(2)} each
              </p>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  −
                </button>
                <span className="quantity-display">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            <div className="cart-item-total">
              <div className="cart-item-total-price">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => onRemoveFromCart(item.product.id)}
                className="remove-item-btn"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <div className="order-summary-row">
          <span className="order-summary-label">Subtotal ({getTotalItems()} items)</span>
          <span className="order-summary-value">${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="order-summary-row">
          <span className="order-summary-label">Shipping</span>
          <span className="order-summary-value">
            {getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}
          </span>
        </div>
        
        <div className="order-summary-row">
          <span className="order-summary-label">Tax</span>
          <span className="order-summary-value">${getTax().toFixed(2)}</span>
        </div>
        
        {getShippingCost() > 0 && totalPrice < 100 && (
          <div className="shipping-notice">
            💡 Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
          </div>
        )}

        <div className="order-total">
          <div className="order-total-row">
            <span>Total</span>
            <span>${getFinalTotal().toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="checkout-btn"
        >
          Proceed to Checkout
        </button>

        <div className="cart-features">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span className="feature-text">Secure Payment</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <span className="feature-text">Fast Delivery</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">↩️</span>
            <span className="feature-text">Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};