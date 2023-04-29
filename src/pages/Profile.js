import React, { useState, useEffect } from "react";
import "../style/Profile.css";
import { storage } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, collection, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const Profile = ({ user }) => {
  const [photoURL, setPhotoURL] = useState(
    "https://img.icons8.com/?size=512&id=7Ffvtg1xmgaV&format=png"
  );
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState(null);
  useEffect(() => {
    user.uid && getUserInfos();
  }, [user.uid]);
  const getUserInfos = async () => {
    const docRef = doc(db, "users", user.uid);
    const userInfos = await getDoc(docRef);
    setInfos(userInfos.data());
  };
  function handleClick() {
    upload(photo, user, setLoading);
  }
  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }
  useEffect(() => {
    if (user && user.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  async function upload(file, user, setLoading) {
    const fileRef = ref(storage, user.uid + ".png");
    setLoading(true);
    const snapchot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(user, { photoURL });
    setLoading(false);
    toast.success("Changement d'image réussi");
  }
  return (
    <div className="profile">
      <div className="profile-infos">
        <img src={photoURL} alt="Avatar" />
        <div className="change-photo">
          <input type="file" onChange={handleChange} />
          <button disabled={loading || !photo} onClick={handleClick}>
            Modifier
          </button>
        </div>
        <div className="displayname info">
          {user.displayName}
          <img src={require("../images/morocco.png")} />
        </div>
      <div>
          <div className="email info">
            <i class="fa-solid fa-envelope"></i>
            {user.email}
          </div>
          <div className="number info">
            <i class="fa-solid fa-phone"></i>
            {infos?.phonenumber}
          </div>
      </div>
        <div className="bio info">{infos?.bio}</div>
        <Link to={"/profile/update"}>
          <button>Modifier le profil</button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
