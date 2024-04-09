import React, { useState } from 'react'
import LocationComponent from '../../components/Location'

const Profile = () => {

    const [user, setUser] = useState({
        name: 'John Doe',
        profilePicture: 'https://via.placeholder.com/150', // URL to the profile picture
        mobileNumber: '+1234567890',
        email: 'user@example.com',

        orderHistory: [
            {
                orderId: 'ABC123',
                // Other order details
            },
            {
                orderId: 'DEF456',
                // Other order details
            },
            // Additional order history items
        ],
        addresses: [
            {
                addressLine: '123 Main St',
                city: 'City',
                state: 'State',
                // Other address details
            },
            {
                addressLine: '456 Elm St',
                city: 'City',
                state: 'State',
                // Other address details
            },
            // Additional address items
        ],
        paymentDetails: {
            cardType: 'Visa',
            cardNumber: '**** **** **** 1234',
            // Other payment details
        },
        // Other user details


        // Add more user profile data as needed
    });


    return (
        <div className="row d-flex flex-row justify-content-center pt-5 m-0">

           
               
                    <h1 className="mb-1">Profile Dashboard</h1>
                    
                        <div className="col-md-3">
                            <div className="card">
                                <img src={user.profilePicture} className="card-img-top" alt="Profile" />
                                <div className="card-body">
                                    <h5 className="card-title">{user.name}</h5>
                                    <p className="card-text">Mobile: {user.mobileNumber}</p>
                                    <p className="card-text">Email: {user.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <h3>Order History</h3>
                                    {user.orderHistory.map((order, index) => (
                                        <div key={index}>
                                            <p>Order ID: {order.orderId}</p>
                                            {/* Other order details */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h3>Addresses</h3>
                                    {user.addresses.map((address, index) => (
                                        <div key={index}>
                                            <p>Address: {address.addressLine}</p>
                                            {/* Other address details */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h3>Payment Details</h3>
                                    <p>Card Type: {user.paymentDetails.cardType}</p>
                                    <p>Card Number: {user.paymentDetails.cardNumber}</p>
                                    {/* Other payment details */}
                                </div>
                            </div>
                        </div>
                    </div>
           

            


    )
}

export default Profile