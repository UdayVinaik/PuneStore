import { createSlice } from "@reduxjs/toolkit";
import {OrderStateType } from "../../Constants/Types";

const initialState: OrderStateType = {
    listOrders: null,
    loading: false,
    errors: ''
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderListAction(state, action) {
            state.listOrders = action.payload;
        },
        setOrderListErrorAction(state, action) {
            state.errors = action.payload;
        }
    }
});

export const selectOrders = (state: any) => state.order.listOrders;

export const {setOrderListAction, setOrderListErrorAction} = orderSlice.actions;

export default orderSlice.reducer;