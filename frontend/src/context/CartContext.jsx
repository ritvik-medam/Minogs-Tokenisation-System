// =============================================
// CART CONTEXT - Global cart state
// =============================================
import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add item or increase quantity
  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.menuItemId === item._id);
      if (exists) {
        return prev.map(i =>
          i.menuItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      }];
    });
  };

  // Remove one or remove item
  const removeFromCart = (menuItemId) => {
    setCart(prev => {
      const item = prev.find(i => i.menuItemId === menuItemId);
      if (item?.quantity > 1) {
        return prev.map(i =>
          i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.menuItemId !== menuItemId);
    });
  };

  const deleteFromCart = (menuItemId) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const clearCart = () => setCart([]);

  // Reorder: add items from history
  const reorderItems = (items) => {
    const newCart = items.map(i => ({
      menuItemId: i.menuItem?._id || i.menuItem,
      name: i.name,
      price: i.price,
      image: i.image || '🍽️',
      quantity: i.quantity
    }));
    setCart(newCart);
  };

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, deleteFromCart,
      clearCart, reorderItems, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
