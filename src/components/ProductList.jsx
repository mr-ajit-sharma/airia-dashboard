import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  setSearch,
  setPriceRange,
  setPopularityRange,
  setSortBy,
} from "../store/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { filteredProducts, status, error } = useSelector(
    (state) => state.products
  );
console.log("before useffect")
useEffect(() => {
    if (status === "idle") {
        dispatch(fetchProducts());
        console.log("inside useffect")
    }
}, [status, dispatch]);
console.log("after useffect")

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div>
      <input
        id="search-bar"
        name="search"
        type="text"
        placeholder="Search by title"
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />

      <select
        id="price-range"
        name="price-range"
        onChange={(e) => dispatch(setPriceRange(e.target.value))}
      >
        <option value="all">All Prices</option>
        <option value="0-5000">0-5000</option>
        <option value="5000-10000">5000-10000</option>
        <option value="10000-20000">10000-20000</option>
        <option value="20000+">20000+</option>
      </select>

      <select
        id="popularity-range"
        name="popularity-range"
        onChange={(e) => dispatch(setPopularityRange(e.target.value))}
      >
        <option value="all">All Popularities</option>
        <option value="0-10000">0-10000</option>
        <option value="10000-30000">10000-30000</option>
        <option value="30000-50000">30000-50000</option>
        <option value="50000+">50000+</option>
      </select>

      <select
        id="price-popularity"
        name="price-popularity"
        onChange={(e) => dispatch(setSortBy(e.target.value))}
      >
        <option value="none">No Sorting</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularityAsc">Popularity: Low to High</option>
        <option value="popularityDesc">Popularity: High to Low</option>
      </select>

      <div>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={product.id || index}>
              {console.log(product, "product")}
              <h3>{product.title}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Popularity: {product.popularity}</p>
            </div>
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
