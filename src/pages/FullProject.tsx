import { isEditable } from "@testing-library/user-event/dist/utils";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { Application } from "../components/Application";

import { Project } from "../components/Project";

export const FullProject = () => {
  const { id } = useParams();
  const [data, setData] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState(true);

  const [applications, setApplications] = React.useState<any[]>();
  const [isApplicationsLoading, setIsApplicationsLoading] = React.useState(true);

  const userData = useSelector((state: any) => state.auth.data);

  React.useEffect(() => {
    axios
      .get(`projects/getProject/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch();
  }, []);

  React.useEffect(() => {
    axios
      .get(`projects/getIncomingApplications`)
      .then((res) => {
        setApplications(res.data);
        setIsApplicationsLoading(false);
      })
      .catch();
  }, []);

  const acceptApplication = (applicationId: any) => {
    const data = {
      applicationId,
      action: 3,
    };
    axios
      .post(`projects/processApplication`, data)
      .then((res) => {
        setIsApplicationsLoading(true);

        axios
          .get(`projects/getIncomingApplications`)
          .then((res) => {
            setApplications(res.data);
            setIsApplicationsLoading(false);
          })
          .catch();
      })
      .catch();
  };

  const rejectApplication = (applicationId: any) => {
    const data = {
      applicationId,
      action: 2,
    };
    axios
      .post(`projects/processApplication`, data)
      .then((res) => {
        setIsApplicationsLoading(true);

        axios
          .get(`projects/getIncomingApplications`)
          .then((res) => {
            setApplications(res.data);
            setIsApplicationsLoading(false);
          })
          .catch();
      })
      .catch();
  };

  if (isLoading) {
    return <Project isLoading={true} isFullPost />;
  }

  if (!data) {
    return <Project isLoading={true} isFullPost />;
  }

  if (!userData) {
    return <Project isLoading={true} isFullPost />;
  }

  if (!applications) {
    return <Project isLoading={true} isFullPost />;
  }

  return (
    <>
      <Project
        id={data.id}
        _id={data.id}
        obj={data}
        title={data.name}
        user={{
          avatarUrl:
            "https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png",
          fullName: data.user.fullName,
        }}
        createdAt={moment(data.createdDate).format("LLL")}
        tags={data.categories.map((c: any) => c.category)}
        isFullPost
        isEditable={userData.id === data.creatorUserId}
      >
        <p>{data.description}</p>
      </Project>

      {userData.id === data.creatorUserId &&
        (isApplicationsLoading
          ? [...Array(5)]
          : applications.filter((a) => a.projectId === data.id)
        ).map((obj: any, index: any) =>
          isApplicationsLoading ? (
            <Application key={index} isLoading={true} />
          ) : (
            <Application
              id={obj.id}
              _id={obj.id}
              message={obj.message}
              description={obj.description}
              status={obj.status}
              user={{
                avatarUrl:
                  "https://res.cloudinary.com/practicaldev/image/fetch/s--uigxYVRB--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/187971/a5359a24-b652-46be-8898-2c5df32aa6e0.png",
                fullName: obj.applicant?.fullName,
                userId: obj.applicantId,
              }}
              createdAt={moment(obj.createdDate).format("LLL")}
              onAccept={() => {
                acceptApplication(obj.id);
              }}
              onReject={() => {
                rejectApplication(obj.id);
              }}
            />
          )
        )}
    </>
  );
};
