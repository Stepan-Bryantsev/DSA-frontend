import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("/auth/fetchAuth", async (params: any) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchRegister = createAsyncThunk("/auth/fetchRegister", async (params: any) => {
  const { data } = await axios.post("/auth/register", params);
  return data;
});

export const fetchUserData = createAsyncThunk("/auth/fetchUserData", async () => {
  const { data } = await axios.get("/account");
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    });
    builder.addCase(fetchAuth.rejected, (state) => {
      state.status = "error";
      state.data = null;
    });

    builder.addCase(fetchUserData.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    });
    builder.addCase(fetchUserData.rejected, (state) => {
      state.status = "error";
      state.data = null;
    });

    builder.addCase(fetchRegister.pending, (state) => {
      state.status = "loading";
      state.data = null;
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    });
    builder.addCase(fetchRegister.rejected, (state) => {
      state.status = "error";
      state.data = null;
    });
  },
});

export const selectIsAuth = (state: any) => state.auth.data;

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
