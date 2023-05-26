import React from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

import styles from "./Project.module.scss";
import { UserInfo } from "../UserInfo";
import { ProjectSkeleton } from "./Skeleton";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Fade, Modal, TextField, Typography } from "@mui/material";
import axios from "../../axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchChoices } from "../../redux/slices/projects";

export const Project = ({
  _id,
  obj,
  title,
  description,
  createdAt,
  user,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { choices } = useSelector((state: any) => state.projects);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  const onApply = () => {
    const reqData = {
      projectId: _id,
      message: message,
    };

    console.log(reqData);

    axios
      .post(`projects/apply`, reqData)
      .then((res) => {
        navigate("/");
      })
      .catch();
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/projects/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
        </div>
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          {" "}
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/projects/${_id}`}>{title}</Link>}
          </h2>
          <h5>{description}</h5>
          {obj.startDate && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Начало:
              </Typography>
              <Typography>{moment(obj.startDate).format("LLL")}</Typography>
            </Box>
          )}
          {obj.endDate && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Окончание:
              </Typography>
              <Typography>{moment(obj.endDate).format("LLL")}</Typography>
            </Box>
          )}
          {obj.applicationDeadline && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Дедлайн заявки:
              </Typography>
              <Typography>{moment(obj.applicationDeadline).format("LLL")}</Typography>
            </Box>
          )}
          {obj.skills && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Требуемые навыки:
              </Typography>
              <Typography>{obj.skills}</Typography>
            </Box>
          )}
          {obj.projectType && choices.data && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Тип проекта:
              </Typography>
              <Typography>{choices.data.projectTypes[obj.projectType]}</Typography>
            </Box>
          )}
          {obj.employmentType && choices.data && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Тип занятости:
              </Typography>
              <Typography>{choices.data.employmentTypes[obj.employmentType]}</Typography>
            </Box>
          )}
          {obj.campus && choices.data && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Кампус:
              </Typography>
              <Typography>{choices.data.campuses[obj.campus]}</Typography>
            </Box>
          )}
          {obj.territory && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Терриротия:
              </Typography>
              <Typography>{obj.territory}</Typography>
            </Box>
          )}
          {!!obj.participantsNumber && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Количество участников:
              </Typography>
              <Typography>{obj.participantsNumber}</Typography>
            </Box>
          )}
          {obj.creditNumber != null && obj.creditNumber !== undefined && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Кредиты:
              </Typography>
              <Typography>{obj.creditNumber}</Typography>
            </Box>
          )}
          {!!obj.weeklyHours && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Занятость:
              </Typography>
              <Typography>{obj.weeklyHours} ч. в неделю</Typography>
            </Box>
          )}
          {obj.contacts && (
            <Box className={styles.box}>
              <Typography fontWeight="bold" paddingRight={"10px"}>
                Контакты:
              </Typography>
              <Typography>{obj.contacts}</Typography>
            </Box>
          )}
          <ul className={styles.tags}>
            {tags.map((name: any) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
        </div>
        {isFullPost && !isEditable && (
          <Button
            sx={{ backgroundColor: "green" }}
            onClick={handleOpen}
            size="large"
            variant="contained"
          >
            Подать заявку
          </Button>
        )}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={modalStyle}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Подача заявки
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Пожалуйста, напишите мотивационное письмо:
              </Typography>
              <TextField
                classes={{ root: styles.inputs }}
                sx={{ mt: "20px" }}
                fullWidth
                multiline
                label="Мотивационное письмо..."
                value={description}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                sx={{ mt: "20px", backgroundColor: "green" }}
                onClick={onApply}
                size="large"
                variant="contained"
              >
                Подать заявку!
              </Button>
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
};
