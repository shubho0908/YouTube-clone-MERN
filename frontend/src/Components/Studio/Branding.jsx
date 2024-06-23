import { useState, useEffect } from "react";
import defaultimg from "../../img/avatar.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function Branding() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(defaultimg);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [changes, setChanges] = useState(false);
  const [ProfileChanges, setProfileChanges] = useState(false);
  const [BannerChanges, setBannerChanges] = useState(false);
  const [channelID, setChannelID] = useState();
  const [loading, setLoading] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  //TOAST FUNCTIONS

  const saveNotify = () =>
    toast.success("Changes saved successfully!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  //USE EFFECTS

  useEffect(() => {
    setTimeout(() => {
      setFakeLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      alert("You'll lose your unsaved data.");
    };

    const basicInfo = document.querySelector(".basic-txt");

    if (changes === true) {
      basicInfo.addEventListener("click", handleMenuButtonClick);

      return () => {
        basicInfo.removeEventListener("click", handleMenuButtonClick);
      };
    }
  }, [changes]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannel/${user?.email}`
          );
          const { userProfile } = await response.json();
          setPreviewProfile(userProfile);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getData();
  }, [user?.email]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannelid/${user?.email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getChannelID();
  }, [user?.email]);

  useEffect(() => {
    const getChannelCover = async () => {
      try {
        if (user?.email) {
          const response = await fetch(`${backendURL}/getcover/${user?.email}`);
          const coverimg = await response.json();
          setPreviewBanner(coverimg);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getChannelCover();
  }, [user?.email]);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setSelectedProfile(file);
    setChanges(true);
    setProfileChanges(true);
    if (file) {
      setPreviewProfile(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setSelectedBanner(file);
    setChanges(true);
    setBannerChanges(true);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const aspectRatio = width / height;
          if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
            setChanges(true);
            setPreviewBanner(URL.createObjectURL(file));
          } else {
            alert("Invalid image aspect ratio. Please select a 16:9 image.");
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const UploadProfile = async () => {
    try {
      if (!selectedProfile) {
        return null;
      }

      const fileReference = ref(storage, `profile/${selectedProfile.name}`);
      const uploadData = uploadBytesResumable(fileReference, selectedProfile);

      return new Promise((resolve, reject) => {
        uploadData.on(
          "state_changed",
          null,
          (error) => {
            console.log(error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadData.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              console.log(error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const UploadBanner = async () => {
    try {
      if (!selectedBanner) {
        return null;
      }

      const fileReference = ref(storage, `cover/${selectedBanner.name}`);
      const uploadData = uploadBytesResumable(fileReference, selectedBanner);

      return new Promise((resolve, reject) => {
        uploadData.on(
          "state_changed",
          null,
          (error) => {
            console.log(error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL1 = await getDownloadURL(
                uploadData.snapshot.ref
              );
              resolve(downloadURL1);
            } catch (error) {
              console.log(error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const saveChannelData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileURL = previewProfile;
      let coverURL = previewBanner;

      if (ProfileChanges) {
        profileURL = await UploadProfile();
      }

      if (BannerChanges) {
        coverURL = await UploadBanner();
      }

      const data = {
        profileURL,
        coverURL,
        channelid: channelID,
      };

      const response = await fetch(`${backendURL}/savecustomization/${user?.email}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {success, userData} = await response.json();
      if (success) {
        setChanges(false);
        saveNotify();
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const publishBtn = document?.querySelector(".save-customize");

    if (changes === false) {
      publishBtn.classList.add("disable-btn");
    } else {
      publishBtn.classList.remove("disable-btn");

      publishBtn.addEventListener("click", saveChannelData);

      return () => {
        publishBtn.removeEventListener("click", saveChannelData);
      };
    }
  });

  return (
    <>
      <div
        className="channel-branding-section"
        style={{
          opacity: loading ? "0.35" : "1",
          transition: "opacity .15s ease",
          cursor: loading ? "wait" : "auto",
        }}
      >
        <div className="profile-update-section">
          <p
            className={
              theme ? "profile-head-txt" : "profile-head-txt text-light-mode"
            }
          >
            Picture
          </p>
          <p
            className={
              theme ? "profile-desc-txt" : "profile-desc-txt text-light-mode2"
            }
          >
            Your profile picture will appear where your channel is presented on
            YouTube, like next to your videos and comments.
          </p>
          <p
            className={
              theme ? "profile-desc-txt" : "profile-desc-txt text-light-mode2"
            }
          >
            (Please refresh the page if the images don’t load properly.)
          </p>
          <div className="picture-section">
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="pic-div"
                style={
                  fakeLoading === true
                    ? { display: "flex" }
                    : { display: "none" }
                }
              >
                <Skeleton
                  count={1}
                  width={140}
                  height={140}
                  style={{
                    borderRadius: "100%",
                  }}
                  className="sk-custom-dp"
                />
              </div>
            </SkeletonTheme>
            <div
              className="pic-div"
              style={
                fakeLoading === false
                  ? { visibility: "visible", display: "flex" }
                  : { visibility: "hidden", display: "none" }
              }
            >
              <img
                src={previewProfile}
                alt="profile"
                className="channel-image"
              />
            </div>
            <div
              className={
                theme
                  ? "pic-extra-content"
                  : "pic-extra-content text-light-mode2"
              }
            >
              It’s recommended to use a picture that’s at least 98 x 98 pixels
              and 4MB or less. Use a PNG or GIF (no animations) file. Make sure
              your picture follows the YouTube Community Guidelines.
              <label
                className={theme ? "change-image" : "change-image blue-txt"}
                htmlFor="profile-image-input"
              >
                CHANGE
              </label>
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleProfileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
        <div className="cover-update-section">
          <p className={theme ? "cover-head" : "cover-head text-light-mode"}>
            Banner image
          </p>
          <p className={theme ? "banner-desc" : "banner-desc text-light-mode2"}>
            This image will appear across the top of your channel
          </p>
          <p
            className={
              theme ? "profile-desc-txt" : "profile-desc-txt text-light-mode2"
            }
          >
            (Please refresh the page if the images don’t load properly.)
          </p>
          <div className="banner-section">
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="pic-div"
                style={
                  fakeLoading === true
                    ? { display: "flex" }
                    : { display: "none" }
                }
              >
                <Skeleton
                  count={1}
                  width={290}
                  height={160}
                  className="sk-custom-banner"
                />
              </div>
            </SkeletonTheme>
            <div
              className="pic-div"
              style={
                fakeLoading === false
                  ? { visibility: "visible", display: "flex" }
                  : { visibility: "hidden", display: "none" }
              }
            >
              {previewBanner ? (
                <img
                  src={previewBanner}
                  alt="banner"
                  className="banner-image"
                />
              ) : (
                ""
              )}
            </div>
            <div
              className={
                theme
                  ? "pic-extra-content"
                  : "pic-extra-content text-light-mode2"
              }
            >
              For the best results on all devices, use an image that’s at least
              2048 x 1152 pixels and 6MB or less.
              <label
                className={theme ? "change-image" : "change-image blue-txt"}
                htmlFor="banner-image-input"
              >
                CHANGE
              </label>
              <input
                type="file"
                id="banner-image-input"
                accept="image/*"
                onChange={handleBannerChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Branding;
