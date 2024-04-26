import {createSlice} from '@reduxjs/toolkit';
import {ImageURLs, ImageURLsStateType, Product, ProductStateType} from '../../Constants/Types';

const initialState: ImageURLsStateType = {
  imageURLs: [],
  loading: false,
  errors: '',
};

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImageURLsListSuccessAction(state, action) {
        state.imageURLs = action.payload;
        state.loading = false;
    },
    setImageURLsListErrorAction(state, action) {
        state.loading = false;
        state.errors = action.payload;
    },
  },
});

export const selectImageURLs = (state: any) => state.image.imageURLs;

export const {setImageURLsListSuccessAction, setImageURLsListErrorAction} = imageSlice.actions
export default imageSlice.reducer;
