import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the initial state
const initialState = {
  user: {},
  status: "idle", // for tracking the status of the fetch
  error: null,
};

// Create an async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async () => {
    const response = await fetch("https://youtube-clone-mern-backend.vercel.app/userdata", {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  }
);

// Create a slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer
export default userSlice.reducer;
