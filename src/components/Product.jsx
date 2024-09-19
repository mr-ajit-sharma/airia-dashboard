import React, { useState } from "react";

const Product = ({ product }) => {
  if (!product) return null;
  return (
    <div className="product">
      <div className="item-container">
        <h4>Name:</h4>
        <p>{product.title}</p>
      </div>
      <div>
        <h4>Price:</h4>
        <p>{product.price}</p>
      </div>
      <div>
        <h4>Popularity:</h4>
        <p> {product.popularity}</p>
      </div>
    </div>
  );
};

export default Product;
