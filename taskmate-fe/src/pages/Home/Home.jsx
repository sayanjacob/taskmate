import {  useNavigate } from 'react-router-dom'
import './Home.css'
import Nav from '../../components/NavBar/Nav';
export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className="container-fluid home ">
                <Nav/>
                
                <div className="row d-flex flex-row justify-content-center pt-5">
                    <div className="col-lg-5 col-sm-12 col-md-12 mx-4">
                        <p className='pt-5 pb-1' style={{ fontSize: '2.8rem', fontWeight: '700' }}>Convenient Services <br /> Right at your <span className='pt-1 pb-2 px-2' style={{ backgroundColor: '#202020', color: 'white' }}>Doorstep</span></p>
                        <div className=" container-fluid pt-4" style={{ backgroundColor: '#F0F3F3', borderRadius: '7px', borderColor: 'gray', borderWidth: '1px', borderStyle: 'solid' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>What are you looking for?</p>
                            <div className="row justify-content-center mb-4 mx-2 ">
                                <div className="col-6 my-1 butncat " onClick={() => { navigate("/categories") }}>
                                    <div className='d-flex flex-row justify-content-evenly  bg-cardser py-2'>
                                        <p className='mt-3' style={{ fontSize: '1em', fontWeight: '500' }}>Cleaning</p>
                                        <img className="p-2" src="src\assets\broom.png" alt="" style={{ width: '5vw' }} />
                                    </div>
                                </div>
                                <div className="col-6 my-1  butncat " onClick={() => { navigate("/categories") }}>
                                    <div className='d-flex flex-row justify-content-evenly bg-cardser py-2 '>
                                        <p className='mt-3 ' style={{ fontSize: '1rem', fontWeight: '500' }}>Electrical</p>
                                        <img className="p-2" src="src\assets\electrician.png" alt="" style={{ width: '5vw' }} />
                                    </div>

                                </div>
                                <div className="col-6 my-1 butncat " onClick={() => { navigate("/categories") }}>
                                    <div className='d-flex flex-row justify-content-evenly  bg-cardser py-2'>
                                        <p className='mt-3 ' style={{ fontSize: '1rem', fontWeight: '500' }}>Plumbing</p>
                                        <img className="p-2" src="src\assets\tools.png" alt="" style={{ width: '5vw' }} />
                                    </div>
                                </div>
                                <div className="col-6 my-1 butncat " onClick={() => { navigate("/categories") }}>
                                    <div className='d-flex flex-row justify-content-evenly bg-cardser py-2'>
                                        <p className='mt-3 ms-2 me-4' style={{ fontSize: '1rem', fontWeight: '500' }}>Salon</p>
                                        <img className="p-2" src="src\assets\hairstylist.png" alt="" style={{ width: '5vw' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-6 col-lg-6 d-none d-sm-block mx-3">
                        <div className='m-auto d-flex justify-content-center pt-2 ' >
                            {/* <img style={{ borderRadius: '10px',height:'96vh'  }} className='' src="src\assets\Untitled design.png" alt="" /> */}

                            

                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}