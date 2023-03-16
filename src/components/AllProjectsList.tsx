import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";

import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";

import { Project } from "../components/Project";
import { TagsBlock } from "../components/TagsBlock";
import { fetchProjects, fetchRecommendedProjects } from "../redux/slices/projects";
import { AppDispatch } from "../redux/store";
import moment from "moment";
import { Navigate } from "react-router-dom";
import { selectIsAuth } from "../redux/slices/auth";
import { IconButton, TextField } from "@mui/material";

export const AllProjectsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { projects } = useSelector((state: any) => state.projects);

  const userData = useSelector((state: any) => state.auth.data);

  const isProjectsLoading = projects.status === "loading";

  React.useEffect(() => {
    dispatch(fetchProjects({ search: "" }));
  }, []);

  const searchQuery = async (searchString: any) => {
    dispatch(fetchProjects({ search: searchString }));
  };

  return (
    <Grid container spacing={4}>
      <Grid xs={8} item>
        <div style={{ marginTop: 0, marginBottom: 30 }}>
          <TextField
            //style={{ width: "auto" }}
            id="search-bar"
            className="text"
            onInput={(event) => {
              searchQuery((event.target as HTMLInputElement).value);
            }}
            label="Search projects"
            variant="outlined"
            placeholder="Search..."
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton type="submit" aria-label="search">
                  <SearchIcon style={{ fill: "blue" }} />
                </IconButton>
              ),
            }}
          />
        </div>
        {(isProjectsLoading ? [...Array(5)] : projects.items.projects).map((obj: any, index: any) =>
          isProjectsLoading ? (
            <Project key={index} isLoading={true} />
          ) : (
            <Project
              id={obj.id}
              _id={obj.id}
              title={obj.name}
              description={obj.description}
              user={{
                avatarUrl:
                  "https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png",
                fullName: obj.userFullName,
              }}
              createdAt={moment(obj.createdDate).format("LLL")}
              tags={obj.categories.map((c: any) => c.category)}
              isEditable={userData.id === obj.creatorUserId}
            />
          )
        )}
        {!isProjectsLoading && projects.items.projects.length === 0 && (
          <h5 style={{ textAlign: "center", color: "grey" }}>No results</h5>
        )}
      </Grid>
      <Grid xs={4} item>
        <TagsBlock items={["react", "typescript", "заметки"]} isLoading={false} />
      </Grid>
    </Grid>
  );
};
