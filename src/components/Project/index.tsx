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

export const Project = ({
  _id,
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

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  const onClickRemove = () => {};

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
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
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
            Apply
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
                Apply for this project!
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Please write a motivational letter:
              </Typography>
              <TextField
                classes={{ root: styles.inputs }}
                sx={{ mt: "20px" }}
                fullWidth
                multiline
                label="Message"
                value={description}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                sx={{ mt: "20px", backgroundColor: "green" }}
                onClick={onApply}
                size="large"
                variant="contained"
              >
                Apply!
              </Button>
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
};
