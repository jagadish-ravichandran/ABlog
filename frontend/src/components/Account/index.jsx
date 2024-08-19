import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/posts";
import Cookies from "js-cookie";
import "./index.scss";

const Account = ({ isLoggedIn, isEditable }) => {
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("Account");
  const [editable, setEditable] = useState(isEditable);

  const [avatar, setAvatar] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [bio, setBio] = useState("");

  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    getUserName();
    getAvatar();
    getBio();
  }, [isLoggedIn]);

  const getUserName = async () => {
    try {
      const response = await api.get("/users");
      if (isLoggedIn) {
        setAccount(response.data.username);
      } else {
        setAccount("Account");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAvatar = async () => {
    try {
      const response = await api.get("/avatar");
      setAvatar(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAvatar = async (e) => {
    e.preventDefault();
    try {
      if (newAvatar === "") {
        alert("Please select an image to upload");
        return;
      }
      const formData = new FormData();
      formData.append("avatar", newAvatar);
      const response = await api.put("/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // setNewAvatar("");
      getAvatar();
      alert(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getBio = async () => {
    try {
      const response = await api.get("/bio");
      setBio(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateBio = async (e) => {
    e.preventDefault();
    try {
      if (bio === "") {
        alert("Please enter a new bio to update");
        return;
      }
      const response = await api.put("/bio", {
        bio: bio,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEdit = () => {
    setEditable(!editable);
  };

  const logout = async () => {
    // send a request to the server to delete the session
    const response = await api.delete(`/session`);
    alert(response.data);
    // remove the session cookie
    Cookies.remove("sessionID");
    // redirect to home
    navigate("/");
  };

  const deleteAccount = async () => {
    try {
      if (password === "") {
        alert("Please enter your password to delete your account");
        return;
      }

      // delete the account
      const response = await api.delete("/users", {
        data: {
          password: password,
        },
      });
      alert(response.data);

      // remove the session cookie
      Cookies.remove("sessionID");
      // redirect to home
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="name-container">
        <h1>@{account}</h1>
      </div>
      {editable ? (
        <div className="profile-editor">
          <div className="avatar-editor">
            <img src={avatar} alt="Avatar" className="avatar" />
            <form onSubmit={updateAvatar}>
              <label htmlFor="Avatar">
                Select Avatar:
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  onChange={(e) => {
                    setNewAvatar(e.target.files[0]);
                  }}
                  accept="image/*"
                />
              </label>
              <button type="submit" className="btn">
                Submit
              </button>
            </form>
          </div>
          <div className="bio-editor">
            <form onSubmit={updateBio}>
              <label htmlFor="bio">
                Bio
                <textarea
                  name="bio"
                  className="bio-input"
                  id="bio"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                  }}
                ></textarea>
              </label>
              <button className="btn">Submit</button>
            </form>
          </div>
          <div className="finish-container">
            <button className="btn" onClick={toggleEdit}>
              Finish
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-container">
          <img src={avatar} alt="Avatar" className="avatar" />
          <p>{bio}</p>
          <div className="edit-option">
            <button className="btn" onClick={toggleEdit}>
              Edit
            </button>
          </div>
        </div>
      )}
      <div className="blogs-container">
        <h2>Your Posts</h2>
        <div>{posts}</div>
      </div>
      <div>
        <h2>Settings</h2>
        <button className="logout" onClick={logout}>
          Logout
        </button>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <button type="submit" onClick={deleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
};

export default Account;
