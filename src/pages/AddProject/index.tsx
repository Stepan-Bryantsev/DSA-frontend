import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./AddProject.module.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import TagPicker from "rsuite/TagPicker";

import "rsuite/dist/rsuite.css";
import { fetchTags } from "../../redux/slices/projects";
import { AppDispatch } from "../../redux/store";
import axios from "../../axios";
import { Tag } from "rsuite";

export const AddProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { tags } = useSelector((state: any) => state.projects);

  React.useEffect(() => {
    dispatch(fetchTags());
  }, []);

  const tagsData = (tags.items ? tags.items : []).map((item: any) => ({
    label: item.category,
    value: item.id,
  }));

  const [isLoading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [contacts, setContacts] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<any[]>([]);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        name: title,
        description,
        contacts,
        categories: selectedTags.filter((t) => typeof t === "number"),
        customCategories: selectedTags.filter((t) => typeof t !== "number"),
      };

      console.log(selectedTags);

      const { data } = await axios.post("/projects", fields);

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const isAuth = useSelector(selectIsAuth);

  if (!isAuth) {
    //return <Navigate to="/login" />;
  }

  return (
    <Paper style={{ padding: 50 }}>
      <br />
      <div className="all-blocks">
        <TextField
          sx={{ mb: "20px" }}
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Project name..."
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TagPicker
          renderValue={(values, items, tags) => {
            return values.map((i: any) => (
              <Tag
                closable
                key={i}
                onClose={(a) => {
                  console.log(a);
                  setSelectedTags(selectedTags.filter((t) => t !== i));
                }}
              >
                {typeof i == "number" ? tagsData.find((v: any) => v.value === i).label : i}
              </Tag>
            ));
          }}
          creatable
          data={tagsData}
          style={{ width: "100%", borderWidth: "1px", borderColor: "rgba(0, 0, 0, 0.23)" }}
          placeholder="Select tags"
          onChange={(a, b) => {
            setSelectedTags(a);
          }}
          value={selectedTags}
        />
        <TextField
          classes={{ root: styles.inputs }}
          sx={{ mt: "20px" }}
          fullWidth
          multiline
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          classes={{ root: styles.inputs }}
          sx={{ mt: "20px" }}
          fullWidth
          label="Contacts"
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
        />
        <div className={styles.buttons}>
          <Button onClick={onSubmit} size="large" variant="contained">
            Create
          </Button>
          <Link to="/">
            <Button size="large">Cancel</Button>
          </Link>
        </div>
      </div>
    </Paper>
  );
};
