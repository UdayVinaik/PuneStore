import { createSlice } from "@reduxjs/toolkit";
import {OrderStateType } from "../../Constants/Types";

const initialState: OrderStateType = {
    listOrders: null,
    loading: true,
    errors: ''
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderListAction(state, action) {
            state.listOrders = action.payload;
            state.loading = false;
        },
        setOrderListErrorAction(state, action) {
            state.errors = action.payload;
            state.loading = false;
        }
    }
});

export const selectOrders = (state: any) => state.order.listOrders;

export const {setOrderListAction, setOrderListErrorAction} = orderSlice.actions;

export default orderSlice.reducer;