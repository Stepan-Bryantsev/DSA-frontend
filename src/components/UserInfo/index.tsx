import { Box, Chip, Fade, Modal, Typography } from "@mui/material";
import React from "react";
import axios from "../../axios";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ avatarUrl, fullName, additionalText, userId }: any) => {
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<any>();

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

  const showUserInfo = (userId: any) => {
    setOpen(true);

    axios
      .get(`account/getUser/${userId}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch();
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <div className={styles.root}>
        <img className={styles.avatar} src={avatarUrl || "/noavatar.png"} alt={fullName} />
        <div className={styles.userDetails}>
          {userId ? (
            <a
              href="#"
              onClick={() => {
                showUserInfo(userId);
              }}
              className={styles.userName}
            >
              {fullName}
            </a>
          ) : (
            <span className={styles.userName}>{fullName}</span>
          )}
          <span className={styles.additional}>Создано: {additionalText}</span>
        </div>
      </div>
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
            {userData && (
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
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
