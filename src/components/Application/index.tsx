import React from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

import styles from "./Application.module.scss";
import { UserInfo } from "../UserInfo";
import { ApplicationSkeleton } from "./Skeleton";
import { Link } from "react-router-dom";
import { Button, Chip } from "@mui/material";

export const Application = ({
  _id,
  status,
  message,
  createdAt,
  user,
  isLoading,
  onAccept,
  onReject,
}: any) => {
  if (isLoading) {
    return <ApplicationSkeleton />;
  }

  const onClickRemove = () => {};

  return (
    <div className={styles.root}>
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          {" "}
          <h5>{message}</h5>
        </div>
      </div>
      {status === 1 && (
        <div className={styles.wrapper}>
          <Button onClick={onAccept} size="large" variant="contained">
            Accept
          </Button>
          <Button size="large" onClick={onReject}>
            Reject
          </Button>
        </div>
      )}
      {status === 2 && (
        <div className={styles.chips}>
          <Chip label="Rejected" color="error" variant="outlined"></Chip>
        </div>
      )}
      {status === 3 && (
        <div className={styles.chips}>
          <Chip label="Accepted" color="success" variant="outlined"></Chip>
        </div>
      )}
    </div>
  );
};
