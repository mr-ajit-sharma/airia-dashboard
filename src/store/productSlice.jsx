import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// Initial state
const initialState = {
  products: [],
  filteredProducts: [],
  status: "idle",
  error: null,
  search: "",
  priceRange: "all",
  popularityRange: "all",
  sortBy: "none",
};

// Async thunk to fetch the API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(
      "/api/interview-materials/products.json" // Ensure the API URL is correct
    );
    // console.log(response ,"here we have get the every product")
    const products=response.data.products;
    return Object.values(products) // Make sure this is an array
  }
);
// Helper function to apply filters and sorting
const applyFilters = (state) => {
  let products = [...state.products];
  console.log(state,"state")
console.log(products,"in apply filteres")
  // Check if products is an array
  if (!Array.isArray(products)) {
    console.error("Products is not an array:", products);
    return [];
  }

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
    if (state.priceRange === "10000-20000")
      return price > 10000 && price <= 20000;
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
    products.sort((a, b) => parseInt(a.popularity) - parseInt(b.popularity));
  } else if (state.sortBy === "popularityDesc") {
    products.sort((a, b) => parseInt(b.popularity) - parseInt(a.popularity));
  }

  return products;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Check if the data is an array
      if (Array.isArray(action.payload)) {
        state.products = action.payload;
        state.filteredProducts = applyFilters(state);
      } else {
        console.error("Fetched data is not an array:", action.payload);
        state.products = [];
        state.filteredProducts = [];
      }
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const { setSearch, setPriceRange, setPopularityRange, setSortBy } = productSlice.actions;

export default productSlice.reducer;
