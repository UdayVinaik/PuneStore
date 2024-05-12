import { createSlice } from "@reduxjs/toolkit";
import { GlobalReducerType } from "../../Constants/Types";

const initialState: GlobalReducerType = {
    isAdmin: false
}

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setIsAdmin(state, action) {
            state.isAdmin = action.payload;
        },
    }
});

export const selectIsAdminLoggedIn = (state: any) => state.global.isAdmin;

export const {setIsAdmin} = globalSlice.actions;

export default globalSlice.reducer;