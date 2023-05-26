import {
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo } from "../../components";
import { UserProjectsList } from "../../components/UserProjectsList";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./Profile.module.scss";
import React from "react";
import { fetchFaculties, fetchTags } from "../../redux/slices/account";
import { AppDispatch } from "../../redux/store";
import axios from "../../axios";
import { fetchUserData } from "../../redux/slices/auth";
import Chip from "@mui/material/Chip";
import { Tag, TagPicker } from "rsuite";

export const Profile = () => {
  const userData = useSelector((state: any) => state.auth.data);
  const dispatch = useDispatch<AppDispatch>();

  const { tags, faculties } = useSelector((state: any) => state.account);

  React.useEffect(() => {
    dispatch(fetchTags());
  }, []);

  React.useEffect(() => {
    dispatch(fetchFaculties());
  }, []);

  const [isEdit, setIsEdit] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [facultyId, setFacultyId] = React.useState(null);
  const [selectedTags, setSelectedTags] = React.useState<any[]>([]);

  const clickEdit = () => {
    setEmail(userData.email);
    setFullName(userData.fullName);
    setBio(userData.bio);
    setFacultyId(userData.facultyId);
    setSelectedTags(userData.categories.map((c: any) => c.id));

    setIsEdit(true);

    console.log(faculties.items);
  };

  const tagsData = (tags.items ? tags.items : []).map((item: any) => ({
    label: item.category,
    value: item.id,
  }));

  const onSubmit = async () => {
    try {
      const fields = {
        email,
        fullName,
        bio,
        facultyId,
        categories: selectedTags.filter((t) => typeof t === "number"),
        customCategories: selectedTags.filter((t) => typeof t !== "number"),
      };

      const { data } = await axios.patch("/account", fields);
    } catch (err) {
      console.log(err);
    }

    dispatch(fetchUserData());
    setIsEdit(false);
  };

  const onCancel = () => {
    setIsEdit(false);
  };

  return (
    userData && (
      <>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Card className={styles.card}>
              {!isEdit && (
                <div className={styles.editButtons}>
                  <IconButton color="primary" onClick={clickEdit}>
                    <EditIcon />
                  </IconButton>
                </div>
              )}
              <Typography variant="h6" fontWeight="bold">
                Профиль:
              </Typography>

              {!isEdit && (
                <>
                  {userData.bio && (
                    <Box className={styles.box}>
                      <Typography>{userData.bio}</Typography>
                    </Box>
                  )}
                  <Box className={styles.box}>
                    <Typography fontWeight="bold" paddingRight={"10px"}>
                      Полное имя:
                    </Typography>
                    <Typography>{userData.fullName}</Typography>
                  </Box>
                  <Box className={styles.box}>
                    <Typography fontWeight="bold" paddingRight={"10px"}>
                      Почта:
                    </Typography>
                    <Typography>{userData.email}</Typography>
                  </Box>
                  {userData.faculty && (
                    <Box className={styles.box}>
                      <Typography fontWeight="bold" paddingRight={"10px"}>
                        Факультет:
                      </Typography>
                      <Typography>{userData.faculty.name}</Typography>
                    </Box>
                  )}
                  {userData.categories && (
                    <div style={{ marginTop: "5px" }}>
                      {userData.categories.map((c: any) => (
                        <Chip label={c.category} sx={{ marginRight: "5px", marginTop: "10px" }} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {isEdit && (
                <>
                  <TextField
                    classes={{ root: styles.inputs }}
                    sx={{ mt: "20px" }}
                    fullWidth
                    multiline
                    label="BIO"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <TextField
                    classes={{ root: styles.inputs }}
                    sx={{ mt: "20px" }}
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    classes={{ root: styles.inputs }}
                    sx={{ mt: "20px" }}
                    fullWidth
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <FormControl fullWidth sx={{ mt: "20px" }}>
                    <InputLabel id="demo-simple-select-label">Faculty</InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={facultyId}
                      label="Faculty"
                      onChange={(e) => setFacultyId(e.target.value as any)}
                    >
                      {faculties &&
                        faculties?.items.map((f: any) => (
                          <MenuItem value={f.id}>{f.name}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
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
                          {typeof i == "number"
                            ? tagsData.find((v: any) => v.value === i).label
                            : i}
                        </Tag>
                      ));
                    }}
                    creatable
                    data={tagsData}
                    style={{
                      width: "100%",
                      borderWidth: "1px",
                      borderColor: "rgba(0, 0, 0, 0.23)",
                      marginTop: "20px",
                    }}
                    placeholder="Select tags"
                    onChange={(a, b) => {
                      setSelectedTags(a);
                    }}
                    value={selectedTags}
                  />
                  <div className={styles.buttons}>
                    <Button onClick={onSubmit} size="large" variant="contained">
                      Save
                    </Button>
                    <Button size="large" onClick={onCancel}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </>
    )
  );
};
