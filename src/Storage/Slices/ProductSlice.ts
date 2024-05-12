import {createSlice} from '@reduxjs/toolkit';
import {Product, ProductStateType} from '../../Constants/Types';

const initialState: ProductStateType = {
  listProduct: null,
  loading: true,
  errors: '',
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setListProductsSuccessAction(state, action) {
        state.listProduct = action.payload;
        state.loading = false;
    },
    setListProductsErrorAction(state, action) {
        state.loading = false;
        state.errors = action.payload;
    },
  },
});

export const selectListProducts = (state: any): Product[] => state.product.listProduct;

export const {setListProductsSuccessAction, setListProductsErrorAction} = productSlice.actions
export default productSlice.reducer;
