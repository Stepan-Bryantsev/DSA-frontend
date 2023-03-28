import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchTags = createAsyncThunk("/account/fetchTags", async () => {
  const { data } = await axios.get("/account/getCategories");
  return data;
});

export const fetchFaculties = createAsyncThunk("/account/fetchFaculties", async () => {
  const { data } = await axios.get("/account/getFaculties");
  return data;
});

const initialState = {
  tags: {
    items: [],
    status: "loading",
  },
  faculties: {
    items: [],
    status: "loading",
  },
};

const accountSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.status = "loading";
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.items = [];
      state.tags.status = "loaded";
    });

    builder.addCase(fetchFaculties.pending, (state) => {
      state.faculties.status = "loading";
    });
    builder.addCase(fetchFaculties.fulfilled, (state, action) => {
      state.faculties.items = action.payload;
      state.faculties.status = "loaded";
    });
    builder.addCase(fetchFaculties.rejected, (state) => {
      state.faculties.items = [];
      state.faculties.status = "loaded";
    });
  },
});

export const accountReducer = accountSlice.reducer;
