import React, { useState } from "react";

const Product = ({product }) => {
    
    if(!product) return null;
  return (
    <div>
      <h3 style={{ border: "2px solid red", height: "20px" }}>
      
        Name:{product.title}
        {console.log(product.title,"here i am title")}
      </h3>
      <p style={{border:"2px solid red",height:"20px"}}>Price: ₹{product.price}</p>
      <p>Popularity: {product.popularity}</p>
    </div>
  );
};

export default Product;
