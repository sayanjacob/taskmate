import { useEffect, useState } from "react";
import ClickToSelectAddress from "../../components/map/Map";
import './CartView.css'
import { useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../components/Payment/Payment";
import axios from "axios";
import LocationMap from "../../components/map/Map";


export default function CartView() {
    const [selectedAddressFromMap, setSelectedAddressFromMap] = useState(null);
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [cartAddedItems, setCartAddedItems] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [addressForm, setaddressForm] = useState({
        house_no: '',
        landmark: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        tag: ''
    });
    const [clientSecret, setClientSecret] = useState('');
    const contact_no = useState("+91 9209039213");
    const stripePromise = loadStripe('pk_test_51ODnq2SFyl6IAnvdTDryDD7CaZrIHI5J2psq4QwPUFaEX9u8tdBjiU5MUA46hpHFhPHFvjF59goq2tXYKfhdIuGo00cFccP90j');
    const [booking, setBooking] = useState({
        user_contact_info: contact_no,
        user_address: {
            house_no: '',
            landmark: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            tag: ''
        },
        slot: '',
        payment: '',
        cart: ''
    })
    const [paymentDetailsFromChild, setPaymentDetailsFromChild] = useState({});


    const handleDateTimeChange = (event) => {
        const newSelectedDateTime = event.target.value;
        setSelectedDateTime(newSelectedDateTime);
        setBooking(prevBooking => ({
            ...prevBooking,
            slot: newSelectedDateTime
        }));
    };


    useEffect(() => {
        console.log(paymentDetailsFromChild);
        setBooking(prevBooking => ({
            ...prevBooking,
            payment: {
                ...prevBooking.payment,
                ...paymentDetailsFromChild
            }
        }))
        if (paymentDetailsFromChild.payment_status === 'succeeded') {
            sessionStorage.setItem("data", JSON.stringify(booking))
            setTimeout(() => {
                navigate('/booking');
            }, 5000); // 5000 milliseconds = 5 seconds
        }

    }, [navigate, paymentDetailsFromChild])


    const handlePaymentSuccess = (paymentDetails) => {
        // Handling the payment details received from the child component
        setPaymentDetailsFromChild({
            "payment_id": paymentDetails.id,
            "amount": paymentDetails.amount,
            "payment_status": paymentDetails.status,
            "description": paymentDetails.description

        });
    };



    useEffect(() => {
        const cart = sessionStorage.getItem('cart')
        setCartAddedItems(JSON.parse(cart));
    }, []);

    useEffect(() => {
        setBooking(prevBooking => ({
            ...prevBooking,
            cart: {
                ...prevBooking.cart,
                ...cartAddedItems
            }
        }))

    }, [cartAddedItems])

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


    const handleDecrement = (item) => {
        const updatedCartItems = [...cartAddedItems];
        const itemIndex = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);
        if (updatedCartItems[itemIndex].quantity > 1) {
            updatedCartItems[itemIndex].quantity--;
            setCartAddedItems(updatedCartItems);
        } else {
            handleRemoveFromCart(item);
        }
    };

    useEffect(() => {
        const newTotal = cartAddedItems.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0);

        setTotal(newTotal);
    }, [cartAddedItems]);


    const goBack = () => {
        navigate(-1); // This function navigates back in the history stack
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setaddressForm({
            ...addressForm,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setBooking(prevBooking => ({
            ...prevBooking,
            user_address: {
                ...prevBooking.user_address,
                ...addressForm
            }
        }))
    }
    useEffect(() => { console.log(booking) }, [booking])

    const handleAddressSelection = (address) => {
        if (address != null) {
            setSelectedAddressFromMap(address);
            setAddressForm({
                house_no: '',
                landmark: '',
                street: address.suburb,
                city: address.city,
                state: address.state,
                zip: address.postcode,
                tag: ''
            });
        }
    };

    // Fetch client secret
    const fetchClientSecret = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/payment/${total}`);
            const receivedClientSecret = response.data.client_secret;

            // console.log('Received client secret:', receivedClientSecret);

            if (!receivedClientSecret || !receivedClientSecret.startsWith('pi_')) {
                throw new Error('Invalid client secret format');
            }

            setClientSecret(receivedClientSecret);
        } catch (error) {
            console.error('Error fetching or processing client secret:', error);
        }
    };




    return (
        <>
            <div className=" container-fluid  m-auto m-2  " style={{ height: "100vh" }}>
                <nav className="navbar navbar-expand-lg navbar-light bg-light p-0 m-0" style={{ height: "10vh" }}>
                    <div className="row">
                        <div className="col d-flex felx-row justify-content-start">
                            <button onClick={goBack} className="btn-back px-2 ">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                                    </svg>
                                </span>
                            </button>
                            <h4>Check Out</h4>
                        </div>
                    </div>
                </nav>

                <div className="row">
                    <div className="col-lg-5 col-sm-12 pt-2 px-4 " style={{ maxHeight: "70vh" }}>
                        <div className="card mb-2 pb-1 px-3">
                            <div className="row m-0 p-0">
                                <div className="col-1 d-flex flex-row justify-content-center align-items-center p-0 m-0 ">
                                    <i className="bi  bi-phone-fill iconbg p-1 m-0"></i>

                                </div>
                                <div className="col-11 d-flex align-items-center py-3 ps-1">
                                    <p className="bookingtitle my-0">Send Booking Details to <br />
                                        <span className="bookingvalue">{booking.user_contact_info}</span>
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="card my-2 py-1 px-3">
                            {addressForm.house_no === '' ? (
                                <div className="row m-0 p-0">
                                    <div className="col-1 d-flex flex-row justify-content-center align-items-center p-0 m-0 ">
                                        <i className="bi bi-geo-alt-fill iconbg p-1 m-0"></i>
                                    </div>
                                    <div className="col-11 d-flex align-items-center justify-content-between py-3 ps-1">
                                        <p className="bookingtitle my-0">Select your Address</p>
                                        <button className="cart-check-btn py-1 px-2" data-bs-toggle="modal" data-bs-target="#addressmodal">
                                            Pick address
                                        </button>
                                    </div>



                                </div>) : (
                                <div className="row m-0 p-0">
                                    <div className="col-1 d-flex flex-row justify-content-center align-items-center p-0 m-0 ">
                                        <i className="bi bi-geo-alt-fill iconbg p-1 m-0"></i>
                                    </div>
                                    <div className="col-11 d-flex align-items-center justify-content-between py-3 ps-1">
                                        <p className="bookingtitle my-0">Address <br />
                                            <span className="bookingvalue"><b>{booking.user_address.tag}</b> - {booking.user_address.house_no},{booking.user_address.street},{booking.user_address.city},{booking.user_address.zip}</span>
                                        </p>
                                        <button className=" edit-btn py-1 px-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#addressmodal" >
                                            edit
                                        </button>
                                    </div>
                                </div>)}
                        </div>


                        <div className="card my-2 py-1 px-3">
                            {selectedDateTime !== '' ? (
                                <div className="row m-0 p-0">
                                    <div className="col-1 d-flex flex-row justify-content-center align-items-center p-0 m-0 ">
                                        <i className="bi bi-clock-fill  p-1 m-0"></i>
                                    </div>
                                    <div className="col-11 d-flex align-items-center justify-content-between py-3 ps-1">
                                        <label className="bookingtitle " htmlFor="datetime">Selected Slot:</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control cart-cal-btn"
                                            id="datetime"
                                            name="datetime"
                                            value={selectedDateTime}
                                            onChange={handleDateTimeChange}
                                        />

                                    </div>

                                </div>
                            ) : (
                                <div className="row m-0 p-0">
                                    <div className="col-1 d-flex flex-row justify-content-center align-items-center p-0 m-0 ">
                                        <i className="bi bi-clock-fill  p-1 m-0"></i>
                                    </div>
                                    <div className="col-11 d-flex align-items-center justify-content-between py-3 ps-1">

                                        <label className="bookingtitle " htmlFor="datetime">Select Slots:</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control cart-cal-btn"
                                            id="datetime"
                                            name="datetime"
                                            value={selectedDateTime}
                                            onChange={handleDateTimeChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-7 col-sm-12 m-auto pt-2 px-4" style={{ maxHeight: "70vh", overflow: 'auto' }}>
                        <div className="card px-3 pt-3 m-auto" >
                            <table className="table">
                                {/* <thead className="thead-dark">
                                    <tr>
                                        <th colSpan="3"><p>Confirm Order</p></th>
                                    </tr>
                                </thead> */}
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
                        </div>

                        <div id="total" className="card mt-2 px-4 py-3 m-auto">
                            <p className="bookingtitle m-0 py-2">Payment Summary </p>
                            <p className="bookingvalue m-0 py-1"><b>Net Total: </b> ${total}</p>
                            <p className="bookingvalue m-0 py-1"><b>Tax and fee :</b>${total % 18}</p>
                            <p className="bookingvalue m-0 py-1 total"><b>Total:</b>${total + (total % 18)}</p>
                        </div>
                        <div className="card mt-2 px-3 py-3 m-auto">
                            Coupons
                        </div>
                    </div>
                </div>
                <div className="fixed-bottom row mx-4" style={{ height: "20vh" }}>
                    <div className="card py-2 my-2 ">
                        <div className="row m-0">
                            <div className="col-9 p-0">
                                <p>Net Payable:${total + (total % 18)}</p>
                                <a href="#total">view breakup</a>
                            </div>
                            <div className="col m-auto">
                                <button className="btn cartviewbtn py-2 px-2"
                                    disabled={cartAddedItems.length === 0 || booking.slot === ''}
                                    data-bs-toggle="modal"
                                    data-bs-target="#bookingmodal"
                                    onClick={fetchClientSecret}>
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* modal for selecting address */}
            <div className="modal fade" id="addressmodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered  modal-xl">
                    <div className="modal-content">

                        <div className="modal-body ">
                            <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close" style={{ position: 'absolute', top: '10px', right: '10px' }}></button>

                            <div className="row my-1">
                                <div className="col-8 p-0 m-0"  >

                                    <LocationMap  />
                                </div>
                                <div className="col-4 m-auto">
                                    <form className="row " onSubmit={handleSubmit}>
                                        <label className="bookingtitle">
                                            {/* Flat No./House No */}
                                            <input
                                                className="address-input py-2 px-2 my-2"
                                                type="text"
                                                name="house_no"
                                                placeholder=" House/Appartment no"
                                                value={addressForm.house_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label className="bookingtitle">
                                            {/* LandMark(Optional): */}
                                            <input
                                                className="address-input py-2 px-2 my-2"
                                                type="text"
                                                name="landmark"
                                                placeholder="Landmark (Optional)"
                                                value={addressForm.landmark}
                                                onChange={handleChange}

                                            />
                                        </label>
                                        <br />
                                        <label className="bookingtitle">
                                            {/* Street: */}
                                            <input
                                                className="address-input py-2 px-2 my-2"
                                                type="text"
                                                name="street"
                                                placeholder="Street"
                                                value={addressForm.street}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label className="bookingtitle">
                                            {/* City: */}
                                            <input
                                                className="address-input py-2 px-2 my-2"
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                value={addressForm.city}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label className="bookingtitle">
                                            {/* State: */}
                                            <input
                                                type="text"
                                                className="address-input py-2 px-2 my-2"
                                                name="state"
                                                placeholder="State"
                                                value={addressForm.state}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label className="bookingtitle">
                                            {/* Zip: */}
                                            <input
                                                type="text"
                                                className="address-input py-2 px-2 my-2"
                                                name="zip"
                                                placeholder="Zip Code"
                                                value={addressForm.zip}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                        <br />
                                        <label className="bookingtitle">
                                            Save as:  <span>  </span>
                                            <input
                                                className="address-input py-2 px-2 my-2 "
                                                type="radio"
                                                name="tag"
                                                value="Home"
                                                onChange={handleChange}

                                            />
                                            <span>  </span>
                                            Home
                                            <span>  </span>
                                            <input
                                                type="radio"
                                                className="address-input py-2 px-2 my-2"
                                                name="tag"
                                                value="Other"
                                                onChange={handleChange}
                                                required
                                            />
                                            <span>  </span>
                                            Other
                                            <span>  </span>
                                        </label>
                                        <br />
                                        <button className=" address-update-btn py-2 mx-2 " type="submit" data-bs-dismiss="modal"  >Update Address</button>
                                    </form>
                                </div>
                            </div>

                        </div>
                        {/* Optionally, you can add a footer */}
                        {/* <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
            </div> */}
                    </div>
                </div>
            </div>
            <div className="modal fade" id="bookingmodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-body my-2 justify-content-center">
                            <Elements stripe={stripePromise}>
                                <PaymentForm total={total} clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />

                            </Elements>
                        </div>
                    </div>
                </div>
            </div>



            {/* modal for booking confirm */}


        </>
    )
}



