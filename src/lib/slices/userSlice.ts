import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userState {
    _id: string;
    name: string;
}

const initialState: userState = {
    _id: '',
    name: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<userState>) => {
            state._id = action.payload._id;
            state.name = action.payload.name;
        }
    }
});

// Action creators are generated for each case reducer function
export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
