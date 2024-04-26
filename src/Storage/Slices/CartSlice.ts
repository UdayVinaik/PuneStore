import { createSlice } from "@reduxjs/toolkit";
import { Cart, CartProduct, UserDetails } from "../../Constants/Types";

const initialState: Cart = {
    id: '',
    userDetails: {} as UserDetails,
    products: [] as CartProduct[],
    errors: ''
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartItemsAction(state, action) {
            state.products = action.payload;
        },
        setCartItemsErrorAction(state, action) {
            state.errors = action.payload;
        }
    }
});

export const selectCart = (state: any) => state.cart.products;

export const {setCartItemsAction, setCartItemsErrorAction} = cartSlice.actions;

export default cartSlice.reducer;