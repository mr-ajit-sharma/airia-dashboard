import React from 'react'
import {Provider} from 'react-redux'
import { store } from './store/Store'
import ProductList from './components/ProductList'
const App = () => {
  return (
    <Provider store={store}>
      <ProductList/>
    </Provider>
  )
}

export default App