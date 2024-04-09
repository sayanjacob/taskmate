
import React, { useEffect, useState } from 'react'
import Nav from "../../components/NavBar/Nav";
import './Store.css'
import axios from 'axios';


const Store = () => {
  const [storeItems, setStoreItems] = useState([])
  const[categories,setCategories]=useState([])
  useEffect(() => {
    

    async function fetchCategories() {
      try {
        const response = await axios.get("https://fakestoreapi.com/products/categories");
        setCategories(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    }
    async function fetchItems() {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setStoreItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    }

    fetchItems();
  }, []);
  return (

    <>
      <Nav />

      <div className="row d-flex flex-row justify-content-center pt-5 mt-5">
        <div className="card col mx-4"> Grocery</div>
        <div className="card col mx-4"> Stationary</div>
        <div className="">
        </div>
      </div>
      <div className="row d-flex flex-row justify-content-evenly pt-2">
        {storeItems.map((items, key) => (
          <div key={key} className="align-center card col-lg-8 mb-3" style={{ width: "14rem" }}>
            
              <img src={items.image} className="card-img-top m-1 " alt="..."  style={{height:'25vh'}}/>
              <div className="card-body">
                <h5 className="card-title">{items.title}</h5>
                <p className="card-text">{items.description}</p>
                <button className="btn btn-store px-2 py-1">Add to Cart</button>
              </div>
           
          </div>
        ))}
      </div>



    </>

  )
}

export default Store