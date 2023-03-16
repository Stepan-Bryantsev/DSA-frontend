import React from "react";
import Grid from "@mui/material/Grid";

import { useDispatch, useSelector } from "react-redux";

import { Project } from "../components/Project";
import { AppDispatch } from "../redux/store";
import moment from "moment";
import { fetchRecommendedProjects } from "../redux/slices/projects";

export const RecommendedProjectsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { recommendedProjects } = useSelector((state: any) => state.projects);

  const userData = useSelector((state: any) => state.auth.data);

  const isProjectsLoading = recommendedProjects.status === "loading";

  React.useEffect(() => {
    dispatch(fetchRecommendedProjects());
  }, []);

  console.log(recommendedProjects.items);

  return (
    <Grid container spacing={4}>
      <Grid xs={8} item>
        {(isProjectsLoading ? [...Array(5)] : recommendedProjects.items).map(
          (obj: any, index: any) =>
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
                tags={obj.categories ? obj.categories.map((c: any) => c.category) : []}
                isEditable={userData.id === obj.creatorUserId}
              />
            )
        )}
        {!isProjectsLoading && recommendedProjects.items?.length === 0 && (
          <h5 style={{ textAlign: "center", color: "grey" }}>No results</h5>
        )}
      </Grid>
    </Grid>
  );
};