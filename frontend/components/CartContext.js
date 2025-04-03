import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [carts, setCarts] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchCarts = async (id_user) => {
        try {
            if (id_user) {
                const cartsData = await cartService.getById(id_user);
                setCarts(cartsData);
            }
        } catch (err) {
            console.log(err.message, "ở CartContext");
            setCarts([]);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCarts(userId);
        }
    }, [userId]);

    const addToCart = async (cartItem) => {
        try {
            await cartService.add(cartItem);
            fetchCarts(userId);
        } catch (err) {
            console.log(err.message, "ở cart context")
        }
    };

    const updateToCart = async (cartItem) => {
        try {
            await cartService.update(cartItem.id_user, cartItem.id_variant, cartItem)
            fetchCarts(userId);
        } catch (error) {
            console.log(error.message, "ở cart context")
        }
    }

    return (
        <CartContext.Provider value={{ carts, setCarts, addToCart, setUserId, updateToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);