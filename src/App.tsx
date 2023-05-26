import Container from "@mui/material/Container";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";

import { Header } from "./components";
import { Home, FullProject, Registration, EditProject, Login, Profile } from "./pages";
import { fetchUserData, selectIsAuth } from "./redux/slices/auth";
import { AppDispatch } from "./redux/store";
import { ProjectsByTag } from "./components/ProjectsByTag";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<FullProject />} />
          <Route path="/tag/:tag" element={<ProjectsByTag />} />
          <Route path="/add-project" element={<EditProject editMode={false} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects/:id/edit" element={<EditProject editMode={true} />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
