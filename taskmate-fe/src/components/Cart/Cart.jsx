import { useEffect, useState } from "react";
import './Cart.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart({ res }) {
    const [total, setTotal] = useState(0);
    const [cartAddedItems, setCartAddedItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize the cartAddedItems state with the items from the 'res' prop
        setCartAddedItems(res.map(item => ({ ...item, quantity: 1 })));
    }, [res]);

    const handleRemoveFromCart = (item) => {
        const updatedCartItems = cartAddedItems.filter((cartItem) => cartItem.id !== item.id);
        setCartAddedItems(updatedCartItems);
    };

    const handleIncrement = (item) => {
        const updatedCartItems = [...cartAddedItems];
        const itemIndex = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);
        updatedCartItems[itemIndex].quantity++;
        setCartAddedItems(updatedCartItems);
    };
    async function ViewCartClick() {
        console.log(cartAddedItems)

        const cart = JSON.stringify(cartAddedItems)
        const cartt={"cart":cart}
        const response = await axios.post("http://127.0.0.1:5000/add_to_cart", cartt)
        console.log(response.data)
        sessionStorage.setItem("cart", cart)
        navigate('/cart')
    }

    const handleDecrement = (item) => {
        const updatedCartItems = [...cartAddedItems];
        const itemIndex = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);
        if (updatedCartItems[itemIndex].quantity > 1) {
            updatedCartItems[itemIndex].quantity--;
            setCartAddedItems(updatedCartItems);
        } else {
            // If quantity is 1 or less, remove the item from the cart
            handleRemoveFromCart(item);
        }
    };

    useEffect(() => {
        const newTotal = cartAddedItems.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);

        setTotal(newTotal);
    }, [cartAddedItems]);

    return (
        <>
            <div className="card p-3">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th colSpan="3"><h5>Cart</h5></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartAddedItems.length !== 0 ? (
                            cartAddedItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.title}</td>
                                    <td className="text-center">
                                        <div className="btn-group" role="group" aria-label="Basic example">
                                            <button type="button" className="btn cartbtn" onClick={() => handleIncrement(item)}> + </button>
                                            <button type="button" className="btn disabled cartbtn" style={{ borderColor: 'none' }}> {item.quantity} </button>
                                            <button type="button" className="btn cartbtn" onClick={() => handleDecrement(item)}> - </button>
                                        </div>
                                    </td>
                                    <td>${item.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Your cart is empty.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <h6>Net Total:${total}</h6>
                <button className="btn cartviewbtn my-3" disabled={cartAddedItems.length === 0} onClick={ViewCartClick}>View Cart</button>

            </div>
        </>
    )
}

export default Cart;
