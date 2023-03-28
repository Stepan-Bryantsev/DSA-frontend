import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./EditProject.module.scss";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import TagPicker from "rsuite/TagPicker";

import "rsuite/dist/rsuite.css";
import { fetchChoices, fetchTags } from "../../redux/slices/projects";
import { AppDispatch } from "../../redux/store";
import axios from "../../axios";
import { Tag } from "rsuite";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import moment from "moment";

export const EditProject = ({ editMode }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { tags, choices } = useSelector((state: any) => state.projects);

  const { id } = useParams();
  const [data, setData] = React.useState<any>({});

  React.useEffect(() => {
    if (editMode) {
      axios
        .get(`projects/getProject/${id}`)
        .then((res) => {
          setTitle(res.data.name);
          setDescription(res.data.description);
          setContacts(res.data.contacts);
          setStartDate(moment(res.data.startDate).toDate());
          setEndDate(moment(res.data.endDate).toDate());
          setApplicationDeadline(moment(res.data.applicationDeadline).toDate());
          setEmploymentType(res.data.employmentType);
          setTerritory(res.data.territory);
          setSkills(res.data.skills);
          setCreditNumber(res.data.creditNumber);
          setCampus(res.data.campus);
          setParticipantsNumber(res.data.participantsNumber);
          setProjectType(res.data.projectType);
          setWeeklyHours(res.data.weeklyHours);
          setLoading(false);
        })
        .catch();
    } else {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    dispatch(fetchTags());
  }, []);

  React.useEffect(() => {
    dispatch(fetchChoices());
  }, []);

  const tagsData = (tags.items ? tags.items : []).map((item: any) => ({
    label: item.category,
    value: item.id,
  }));

  const [isLoading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [contacts, setContacts] = React.useState("");

  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [applicationDeadline, setApplicationDeadline] = React.useState<Date>();
  const [employmentType, setEmploymentType] = React.useState();
  const [territory, setTerritory] = React.useState("");
  const [skills, setSkills] = React.useState("");
  const [creditNumber, setCreditNumber] = React.useState(null);
  const [campus, setCampus] = React.useState();
  const [participantsNumber, setParticipantsNumber] = React.useState(null);
  const [projectType, setProjectType] = React.useState();
  const [weeklyHours, setWeeklyHours] = React.useState();

  const [selectedTags, setSelectedTags] = React.useState<any[]>([]);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        projectId: id,
        name: title,
        description,
        contacts,
        startDate: startDate as unknown as Date,
        endDate: endDate as unknown as Date,
        applicationDeadline: applicationDeadline as unknown as Date,
        employmentType,
        territory,
        skills,
        creditNumber,
        campus,
        participantsNumber,
        projectType,
        weeklyHours,
        categories: selectedTags.filter((t) => typeof t === "number"),
        customCategories: selectedTags.filter((t) => typeof t !== "number"),
      };

      if (editMode) {
        const { data } = await axios.patch("/projects", fields);
      } else {
        const { data } = await axios.post("/projects", fields);
      }

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const isAuth = useSelector(selectIsAuth);

  if (!isAuth) {
    //return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <></>;
  }

  return (
    <Paper style={{ padding: 50 }}>
      <br />
      <div className="all-blocks">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TextField
            sx={{ mb: "20px" }}
            classes={{ root: styles.title }}
            variant="standard"
            placeholder="Название проекта..."
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
            placeholder="Выберите теги"
            onChange={(a, b) => {
              setSelectedTags(a);
            }}
            value={selectedTags}
          />
          <TextField
            required
            classes={{ root: styles.inputs }}
            sx={{ mt: "20px" }}
            fullWidth
            multiline
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            required
            classes={{ root: styles.inputs }}
            sx={{ mt: "20px" }}
            fullWidth
            label="Контакты"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
          />
          <FormControl fullWidth sx={{ mt: "20px" }}>
            <InputLabel id="demo-simple-select-label">Тип проекта</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              value={projectType}
              label="Тип проекта"
              onChange={(e) => setProjectType(e.target.value as any)}
            >
              {choices.data &&
                Object.keys(choices.data.projectTypes).map((key) => (
                  <MenuItem value={Number(key)}>{choices.data.projectTypes[key]}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <DatePicker
            defaultValue={null}
            sx={{ mt: "20px" }}
            label="Начало"
            value={startDate ? startDate : undefined}
            onChange={(v: any) => setStartDate(v)}
          />
          <DatePicker
            sx={{ mt: "20px", ml: "20px" }}
            label="Окончание"
            value={endDate ? endDate : undefined}
            onChange={(v: any) => setEndDate(v)}
          />
          <br></br>
          <DatePicker
            sx={{ mt: "20px" }}
            label="Дедлайн подачи заявки"
            value={applicationDeadline ? applicationDeadline : undefined}
            onChange={(v: any) => setApplicationDeadline(v)}
          />
          <FormControl fullWidth sx={{ mt: "20px" }}>
            <InputLabel id="demo-simple-select-label">Факультет</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              value={campus}
              label="Факультет"
              onChange={(e) => setCampus(e.target.value as any)}
            >
              {choices.data &&
                Object.keys(choices.data.campuses).map((key) => (
                  <MenuItem value={Number(key)}>{choices.data.campuses[key]}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            classes={{ root: styles.inputs }}
            sx={{ mt: "20px" }}
            fullWidth
            label="Локация"
            value={territory}
            onChange={(e) => setTerritory(e.target.value)}
          />
          <TextField
            sx={{ mt: "20px", width: "20%" }}
            type="number"
            InputProps={{
              inputProps: {
                max: 100,
                min: 1,
              },
            }}
            label="Число участников"
            value={participantsNumber}
            onChange={(e) => setParticipantsNumber(e.target.value as any)}
          />
          <TextField
            sx={{ mt: "20px", ml: "20px", width: "20%" }}
            type="number"
            InputProps={{
              inputProps: {
                max: 100,
                min: 1,
              },
            }}
            label="Число кредитов"
            value={creditNumber}
            onChange={(e) => setCreditNumber(e.target.value as any)}
          />
          <TextField
            classes={{ root: styles.inputs }}
            sx={{ mt: "20px" }}
            fullWidth
            label="Требуемые навыки"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <FormControl sx={{ mt: "20px", width: "50%" }}>
            <InputLabel id="demo-simple-select-label">Тип занятости</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              value={employmentType}
              label="Тип занятости"
              onChange={(e) => setEmploymentType(e.target.value as any)}
            >
              {choices.data &&
                Object.keys(choices.data.employmentTypes).map((key) => (
                  <MenuItem value={Number(key)}>{choices.data.employmentTypes[key]}</MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            sx={{ mt: "20px", ml: "20px", width: "25%" }}
            type="number"
            InputProps={{
              inputProps: {
                max: 100,
                min: 1,
              },
            }}
            label="Занятотсть (часов в неделю)"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value as any)}
          />
        </LocalizationProvider>
        <div className={styles.buttons}>
          <Button onClick={onSubmit} size="large" variant="contained">
            {editMode ? "Обновить" : "Создать"}
          </Button>
          <Link to="/">
            <Button size="large">Отмена</Button>
          </Link>
        </div>
      </div>
    </Paper>
  );
};
