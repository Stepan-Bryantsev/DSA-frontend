import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";

import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";

import { Project } from "../components/Project";
import { TagsBlock } from "../components/TagsBlock";
import { fetchChoices, fetchProjects, fetchRecommendedProjects } from "../redux/slices/projects";
import { AppDispatch } from "../redux/store";
import moment from "moment";
import { Navigate } from "react-router-dom";
import { selectIsAuth } from "../redux/slices/auth";
import { IconButton, TextField } from "@mui/material";
import { AllProjectsList } from "../components/AllProjectsList";
import { RecommendedProjectsList } from "../components/RecommendedProjectsList";
import { UserProjectsList } from "../components/UserProjectsList";

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [currentTab, setCurrentTab] = React.useState(0);

  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchChoices());
  }, []);

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  const searchQuery = async (searchString: any) => {
    dispatch(fetchProjects({ search: searchString }));
  };

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={currentTab} aria-label="basic tabs example">
        <Tab label="Все проекты" onClick={() => setCurrentTab(0)} />
        <Tab label="Рекомендованные" onClick={() => setCurrentTab(1)} />
        <Tab label="Мои проекты" onClick={() => setCurrentTab(2)} />
      </Tabs>
      {currentTab === 0 && <AllProjectsList></AllProjectsList>}
      {currentTab === 1 && <RecommendedProjectsList></RecommendedProjectsList>}
      {currentTab === 2 && <UserProjectsList></UserProjectsList>}
    </>
  );
};
