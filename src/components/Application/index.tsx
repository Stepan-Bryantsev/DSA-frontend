import React from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";

import styles from "./Application.module.scss";
import { UserInfo } from "../UserInfo";
import { ApplicationSkeleton } from "./Skeleton";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export const Application = ({
  _id,
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
    <div className={clsx(styles.root)}>
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          {" "}
          <h5>{message}</h5>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button onClick={onAccept} size="large" variant="contained">
          Accept
        </Button>
        <Button size="large">Reject</Button>
      </div>
    </div>
  );
};
