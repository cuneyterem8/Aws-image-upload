import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {useDropzone} from 'react-dropzone'

const UserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = () => {
    axios.get("http://localhost:8080/api/v1/user-profile").then(res => {
      console.log(res);
      setUserProfiles(res.data);
    });
  };

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  return userProfiles.map((userProfile, index) => {
    return (<div key={index}>
      <br/>
      <br/>
      <h1>{userProfile.username}</h1>
      <p>{userProfile.userProfileId}</p>
      <Dropzone {...userProfile}/>
      <br/>
    </div>)
  });
};

function Dropzone({userProfileId}) {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    axios.post(
        "http://localhost:8080/api/v1/user-profile/${userProfileId}/image/upload",
        formData,
        {
          headers: {"Content-Type": "multipart/form-data"}
        }).then(() => {
          console.log("file uploaded");
    }).catch(err => {
      console.log(err);
    });
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop or click for profile image</p>
        }
      </div>
  );
}

function App() {
  return (
    <div className="App">
      <UserProfiles/>
    </div>
  );
}

export default App;
