import { useNavigate } from "react-router-dom";
import Nav from "../../components/NavBar/Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import './Categories.css'

export default function Categories() {
    const imgaddress = {
        Plumbing: "src/assets/tools.png",
        Electrical: "src/assets/electrician.png",
        HVAC: "src/assets/air-conditioner.png",
        Roofing: "src/assets/roof.png",
        Landscaping: 'src/assets/lawn-mower.png',
        Carpentry: 'src/assets/cutter.png'
        // Add other categories here as needed
    };

    const [serviceCategories, SetServiceCategories] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    const handleNavigate = (serviceId, serviceName) => {
        const queryParams = new URLSearchParams({
            serviceId: serviceId,
            serviceName: serviceName
        }).toString();
        navigate(`/services?${queryParams}`);
    };


    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    useEffect(() => {
        async function loadServiceCategories() {
            try {
                const city = localStorage.getItem("city");
                const response = await axios.get(`http://127.0.0.1:5000/services/${city}`);
                SetServiceCategories(response.data['services']);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        }
        loadServiceCategories();
    }, [SetServiceCategories]);
    // console.log(serviceCategories);

    const filteredServiceCategories = serviceCategories.filter((servCat) =>
        servCat.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <>
        <Nav/>
            <div className="container-fluid pt-4 mt-5" style={{ backgroundColor: 'white',fontFamily:'Gabarito' }}>
                <div className="row col-8 mx-auto" >
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control py-2 "
                            placeholder=" Search Service Categories"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text py-2 ms-2 " style={{ backgroundColor: "transparent", borderRadius: '50px' }}>
                                <i className="bi bi-search"></i>                            
                            </span>
                        </div>
                    </div>
                </div>



                <div className="row justify-content-center pt-3 " style={{minHeight:'80vh'}}>
                    {filteredServiceCategories.length === 0 ? (
                        <div className="row mx-auto pt-4 d-flex flex-column justify-content-center">
                            <div className="col-6 mx-auto d-flex flex-row justify-content-center my-2">
                                <img src="src\assets\computer.png" alt="" width={100} />

                            </div>
                            <div className="col-6 my-2 mx-auto d-flex flex-row justify-content-center">
                                <h4 className="pt-5 pb-5">Search Parameter "{searchInput}" not found</h4>

                            </div>




                        </div>
                    ) : (
                        filteredServiceCategories.map((servCat, index) => (
                            <div key={index} className="col-lg-3 col-md-3 col-sm-4 col-4 mx-2 my-2" style={{ textAlign: "center", backgroundColor: 'aliceblue', borderRadius: '10px' }} onClick={() => handleNavigate(servCat.services_id, servCat.name)}>
                                <h2 className="mt-4" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>{servCat.name}</h2>
                                <img className="mb-3 mt-2 categorieshover" src={imgaddress[servCat.name]} alt="image" width={75} style={{ display: "block", margin: "0 auto" }} />
                            </div>

                        ))
                    )}
                </div>
            </div>
        </>
    );
}
