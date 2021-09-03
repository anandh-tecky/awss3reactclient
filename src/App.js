import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(6),
    margin: "auto",
    maxWidth: 500,
  },
  // image: {
  //   width: 128,
  //   height: 128,
  // },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

const UserProfiles = () => {
  const classes = useStyles();
  const initalState = [];
  const [userProfiles, setUserProfiles] = useState(initalState);
  const fetchUserProfiles = () => {
    axios.get("http://localhost:8080/api/v1/user-profile").then((res) => {
      console.log(res);
      setUserProfiles(res.data);
    });
  };
  useEffect(() => {
    fetchUserProfiles();
  }, []);
  return userProfiles.map((userProfile, index) => {
    return (
      <div key={index} className={classes.root}>
        
          <UserCard
            userProfile={userProfile}
            setUserProfiles={setUserProfiles}
          />
        <br></br>
      </div>
    );
  });
};
const UserCard = ({ userProfile, setUserProfiles }) => {
  const classes = useStyles();
  const userImage = () => {
    let img = (
      <img
        alt="UserImage"
        key={userProfile.userProfileImageLink}
        src={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/${userProfile.userProfileImageLink}/download`}
      />
    );
    return img;
  };
  return (
    <Paper className={classes.paper}>
    <Grid container spacing={2}>
      <Grid item>
        <ButtonBase className={classes.image}>{userImage()}</ButtonBase>
      </Grid>
      <Grid item xs={12} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Typography gutterBottom variant="subtitle1">
            {userProfile.username}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {userProfile.userProfileId}
          </Typography>
          <Dropzone
            userProfile={userProfile}
            setUserProfiles={setUserProfiles}
          />
        </Grid>
      </Grid>
    </Grid>
    </Paper>
  );
};

function Dropzone({ userProfile, setUserProfiles }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `http://localhost:8080/api/v1/user-profile/${userProfile.userProfileId}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log("File uploaded successfully");
        setUserProfiles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <UserProfiles />
    </div>
  );
}

export default App;
