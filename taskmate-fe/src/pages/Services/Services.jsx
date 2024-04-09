import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Cart from '../../components/Cart/Cart';
import './Services.css';
import Nav from "../../components/NavBar/Nav";


export default function Services() {
    const [searchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const serviceName = searchParams.get('serviceName');
    const serviceId = searchParams.get('serviceId');

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/service_subcategories/${serviceId}`);
                setServices(response.data['subcategories']);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        }

        fetchServices();
    }, [serviceId]);

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddToCart = (service) => {
        const existingItemIndex = cartItems.findIndex(item => item.id === service.subcategories_id);

        if (existingItemIndex !== -1) {
            // If the service already exists in the cart, increase its quantity
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex].quantity += 1;
            setCartItems(updatedCartItems);
        } else {
            // If the service doesn't exist in the cart, add a new item
            const newItem = {
                'title': service.title,
                'price': service.price,
                'quantity': 1,
                'subcategories_id': service.subcategories_id
            };
            setCartItems([...cartItems, newItem]);
        }
    };


    return (
        <>
        <Nav/>
        

            <div className='container-fluid servicesdiv' style={{ backgroundColor: 'white' }}>
                <div className="row mt-5 pt-3">
                    <div className="col-lg-3 col-md-4 d-none d-md-block">
                        <div className='card px-4 py-3'>
                            <div className="row">
                                <h2>{serviceName}</h2>
                            </div>
                            <div className="row-col-12 d-flex flex-row justify-content-start">
                                <img src="src\assets\star.png" alt="" style={{ width: '1.2rem', height: '1.2rem' }} />
                                <p className='ps-2' style={{ fontSize: '0.8rem' }}>  4.40   (3.6M Booking)</p>
                            </div>
                        </div>

                        {/* <div className="card">
                        Add services
                    </div> */}

                    </div>
                    <div className="col-sm-12 col-md-8 col-lg-5  card" >
                        <div className="row col-11 mx-auto mt-3 mb-1">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control py-2 px-4"
                                    placeholder="Find a service"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <div className="input-group-append ms-1" style={{ borderRadius: '50px' }}>
                                    <span className="input-group-text py-2" style={{ backgroundColor: "transparent", borderRadius: '50px' }}>
                                        <i className="bi bi-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='servicesover pt-2'>

                            {filteredServices.length === 0 ? (
                                <div className="row mx-auto pt-4 d-flex flex-column justify-content-center">
                                    <div className="col-6 mx-auto d-flex flex-row justify-content-center my-2">
                                        <img src="src\assets\computer.png" alt="" width={100} />

                                    </div>
                                    <div className="col-10 my-2 mx-auto d-flex flex-row justify-content-center">
                                        <h4 className="pt-5 pb-5">The service {searchTerm} is not available</h4>

                                    </div>




                                </div>
                            ) : (filteredServices.map((service, index) => (
                                <div key={index} className='mx-2 mt-1 mb-3  px-4 py-4 card '>
                                    <div className="row">
                                        <div className="col-8">
                                            <h5 className='my-1'>{service.title}</h5>
                                        </div>
                                        <div className="col-4 py-1 d-flex flex-row justify-content-end">
                                            <button className='addserbtn px-4 py-1' onClick={() => handleAddToCart(service)} >Add</button>
                                        </div>
                                    </div>
                                    <div className="row d-flex flex-row justify-content-center">
                                        <div className="col-3 ">
                                            <p className='my-1'>Ratings: {service.ratings}</p>
                                        </div>
                                        <div className="col-9">
                                            <p className='my-1'>Reviews: {service.reviews}</p>
                                        </div>
                                    </div>
                                    <div className='row justify-content-center'>
                                        <div className="col-6">
                                            <p className='my-1'>Price: ${service.price}</p>
                                        </div>
                                        <div className="col-6">
                                            <p className='my-1'>Time: {service.time}</p>
                                        </div>
                                    </div>
                                    <p className='my-1'>Description: {service.description}
                                    </p>

                                </div>)
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-4 d-none d-lg-block">
                        <Cart res={cartItems} />
                    </div>
                </div>
            </div>
        </>
    );
}
