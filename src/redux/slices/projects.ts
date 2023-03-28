import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchProjects = createAsyncThunk(
  "/projects/fetchProjects",
  async (queryParams: any) => {
    const { data } = await axios.get("/projects", {
      params: {
        search: queryParams.search,
        skip: queryParams.skip,
        take: queryParams.take,
      },
    });
    return data;
  }
);

export const fetchMoreProjects = createAsyncThunk(
  "/projects/fetchMoreProjects",
  async (queryParams: any) => {
    const { data } = await axios.get("/projects", {
      params: {
        search: queryParams.search,
        skip: queryParams.skip,
        take: queryParams.take,
      },
    });
    return data;
  }
);

export const fetchRecommendedProjects = createAsyncThunk(
  "/projects/fetchRecommendedProjects",
  async () => {
    const { data } = await axios.get("/projects/recommendations");
    return data;
  }
);

export const fetchUserProjects = createAsyncThunk("/projects/fetchUserProjects", async () => {
  const { data } = await axios.get("/projects/my");
  return data;
});

export const fetchTags = createAsyncThunk("/projects/fetchTags", async () => {
  const { data } = await axios.get("/projects/getCategories");
  return data;
});

export const fetchChoices = createAsyncThunk("/projects/fetchChoices", async () => {
  const { data } = await axios.get("/projects/getProjectChoices");
  return data;
});

const initialState = {
  projects: {
    pending: false,
    loadMorePending: false,
    items: [],
    maxCount: 0,
    error: false,
    status: "loading",
    statusMore: "loaded",
  },
  tags: {
    items: [],
    status: "loading",
  },
  recommendedProjects: {
    items: [],
    status: "loading",
  },
  userProjects: {
    items: [],
    status: "loading",
  },
  choices: {
    data: null,
    status: "loading",
  },
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.projects.status = "loading";
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.projects.items = action.payload.projects;
      state.projects.maxCount = action.payload.count;
      state.projects.status = "loaded";
    });
    builder.addCase(fetchProjects.rejected, (state) => {
      state.projects.items = [];
      state.projects.status = "loaded";
    });

    builder.addCase(fetchMoreProjects.pending, (state) => {
      state.projects.statusMore = "loading";
    });
    builder.addCase(fetchMoreProjects.fulfilled, (state, action) => {
      state.projects.items = state.projects.items.concat(action.payload.projects);
      state.projects.maxCount = action.payload.count;
      state.projects.statusMore = "loaded";
    });
    builder.addCase(fetchMoreProjects.rejected, (state) => {
      state.projects.items = [];
      state.projects.statusMore = "loaded";
    });

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

    builder.addCase(fetchRecommendedProjects.pending, (state) => {
      state.recommendedProjects.status = "loading";
    });
    builder.addCase(fetchRecommendedProjects.fulfilled, (state, action) => {
      state.recommendedProjects.items = action.payload;
      state.recommendedProjects.status = "loaded";
    });
    builder.addCase(fetchRecommendedProjects.rejected, (state) => {
      state.recommendedProjects.items = [];
      state.recommendedProjects.status = "loaded";
    });

    builder.addCase(fetchUserProjects.pending, (state) => {
      state.userProjects.status = "loading";
    });
    builder.addCase(fetchUserProjects.fulfilled, (state, action) => {
      state.userProjects.items = action.payload;
      state.userProjects.status = "loaded";
    });
    builder.addCase(fetchUserProjects.rejected, (state) => {
      state.userProjects.items = [];
      state.userProjects.status = "loaded";
    });

    builder.addCase(fetchChoices.pending, (state) => {
      state.choices.status = "loading";
    });
    builder.addCase(fetchChoices.fulfilled, (state, action) => {
      state.choices.data = action.payload;
      state.choices.status = "loaded";
    });
    builder.addCase(fetchChoices.rejected, (state) => {
      state.choices.data = null;
      state.choices.status = "loaded";
    });
  },
});

export const projectsReducer = projectsSlice.reducer;
