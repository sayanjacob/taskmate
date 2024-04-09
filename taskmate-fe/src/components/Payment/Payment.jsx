import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './Payment.css'


const PaymentForm = ({ total, clientSecret, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false); // State to track processing state
    const [paymentDetails, setPaymentDetails] = useState(null); // State to store payment details




    const handleSubmit = async (event) => {
        // console.log({ 'hi': clientSecret })
        event.preventDefault();

        try {
            if (!clientSecret || !clientSecret.startsWith('pi_')) {
                throw new Error('Invalid client secret format');
            }

            setIsProcessing(true); // Set processing state to true

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) {
                setErrorMessage(error.message);
                setIsProcessing(false); // Set processing state to false
            } else if (paymentIntent.status === 'succeeded') {
                // console.log(paymentIntent);
                setPaymentDetails(paymentIntent); // Store payment details
                onPaymentSuccess(paymentIntent);
                setIsProcessing(false); // Set processing state to false
            }
        } catch (error) {
            console.error('Error confirming card payment:', error);
            setIsProcessing(false); // Set processing state to false
        }
    };

    return (
        <div>
            {paymentDetails ? (
                <div className='container-fluid text-center'>
                    <img
                        src={paymentDetails.status === "succeeded"
                            ? "https://cdn.dribbble.com/users/147386/screenshots/5315437/media/64a3a80eb03d6fe459abd7e7c1d889f9.gif"
                            : "https://example.com/path/to/alternate-image.jpg"}
                        alt=""
                        style={{ 'width': "25vw" }}
                    />
                    <h2>
                        {paymentDetails.status === "succeeded"
                            ? "Payment Successful!"
                            : "Payment Failed"}
                    </h2>
                    <p className='payment-method'>Payment ID: {paymentDetails.id}</p>
                    <p className='payment-subtitle'>Amount: ₹{paymentDetails.amount}</p>
                    <p className='payment-method'>Status: {paymentDetails.status}</p>

                </div>

            ) : (
                <form className='container-fluid' onSubmit={handleSubmit}>
                    <div className=''>
                        <p className='payment-title m-0'>Select Payment method</p>
                        <p className='payment-subtitle m-0 px-1'>Amount to pay: ₹{total}</p>
                    </div>
                    <div className='my-4 '>
                        <label className='payment-subtitle pb-1' htmlFor="card-element">Credit or debit card</label>

                        <CardElement id="card-element" className='mx-2' />
                        <div className='payment-method px-1' role="alert" style={{ color: 'red' }}>
                            {errorMessage}
                        </div>
                    </div>

                    <div className='my-4 '>
                        <p className='payment-subtitle m-0 p-0'>Pay After Service</p>
                        <p className='unavailable-text m-0 p-0 '>Unavailable right now</p>


                        <div className='d-flex flex-row justify-content-between align-items-center disabled-payments'>
                            <p className='payment-method mx-2 my-2 align-content-center'>
                                <span className=''>
                                    <img src="src\assets\cash-svgrepo-com.svg" width={20} alt="" />
                                </span> Pay By Cash after service
                            </p>
                            <i className="bi bi-chevron-right align-content-center disabled-ico p-2 m-0"></i>
                        </div>


                        <div className='d-flex flex-row justify-content-between align-items-center disabled-payments'>
                            <p className='payment-method mx-2 my-2 align-content-center'>
                                <span className=''>
                                    <img src="src\assets\online-payment-svgrepo-com.svg" width={20} alt="" />
                                </span> Pay Online after service
                            </p>
                            <i className="bi bi-chevron-right align-content-center disabled-ico p-2 m-0" width={20}></i>
                        </div>
                    </div>


                    <div className='my-4 '>
                        <p className='payment-subtitle m-0 p-0'>UPI</p>


                        <div className='d-flex flex-row justify-content-between align-items-center disabled-payments'>
                            <p className='payment-method mx-2 my-2 align-content-center'>
                                <span className=''>
                                    <img src="src\assets\google-pay-svgrepo-com.svg" width={20} alt="" />
                                </span> Pay via UPI
                            </p>
                            <i className="bi bi-chevron-right align-content-center disabled-ico p-2 m-0"></i>
                        </div>
                    </div>

                    <button className=' btn payment-button' type="submit" disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Submit Payment'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default PaymentForm;
