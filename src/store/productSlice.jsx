import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch the API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(
      "/api/interview-materials/products.json"
    );
    console.log(response)
    return response.data;
  }
);

// Initial state
const initialState = {
    products: {}, // This should be an array, not an object
    filteredProducts: [], // Arrays are serializable
    status: "idle",
    error: null,
    search: "",
    priceRange: "all",
    popularityRange: "all",
    sortBy: "none",
  };
  

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setPopularityRange(state, action) {
      state.popularityRange = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      state.filteredProducts = applyFilters(state);
    },
    applyFilters(state) {
      let products = Object.values(state.products);

      // Filter by search
      if (state.search) {
        products = products.filter((product) =>
          product.title.toLowerCase().includes(state.search.toLowerCase())
        );
      }

      // Filter by price range
      products = products.filter((product) => {
        const price = parseFloat(product.price);
        if (state.priceRange === "0-5000") return price <= 5000;
        if (state.priceRange === "5000-10000")
          return price > 5000 && price <= 10000;
        if (state.priceRange === "10000-15000")
          return price > 10000 && price <= 15000;
        if (state.priceRange === "15000-20000")
          return price > 15000 && price <= 20000;
        if (state.priceRange === "20000+") return price > 20000;
        return true;
      });

      // Filter by popularity range
      products = products.filter((product) => {
        const popularity = parseInt(product.popularity, 10);
        if (state.popularityRange === "0-10000") return popularity <= 10000;
        if (state.popularityRange === "10000-30000")
          return popularity > 10000 && popularity <= 30000;
        if (state.popularityRange === "30000-50000")
          return popularity > 30000 && popularity <= 50000;
        if (state.popularityRange === "50000+") return popularity > 50000;
        return true;
      });

      // Sort by price and popularity
      if (state.sortBy === "priceAsc") {
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (state.sortBy === "priceDesc") {
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      } else if (state.sortBy === "popularityAsc") {
        products.sort(
          (a, b) => parseInt(a.popularity) - parseInt(b.popularity)
        );
      } else if (state.sortBy === "popularityDesc") {
        products.sort(
          (a, b) => parseInt(b.popularity) - parseInt(a.popularity)
        );
      }

      state.filteredProducts = products;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.products = action.payload;
      state.filteredProducts = Object.values(action.payload); // Convert products object to array
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const { applyFilters, setSearch, setPopularityRange, setPriceRange, setSortBy } = productSlice.actions;

export default productSlice.reducer;
