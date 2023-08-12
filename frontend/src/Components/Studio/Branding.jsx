import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import defaultimg from "../../img/avatar.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ReactLoading from "react-loading";
import { storage } from "../../Firebase";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Branding() {
  const [email, setEmail] = useState("");
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

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setFakeLoading(false);
    }, 2800);
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
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannel/${email}`
          );
          const { profile } = await response.json();
          setPreviewProfile(profile);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getData();
  }, [email]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getChannelID();
  }, [email]);

  useEffect(() => {
    const getChannelCover = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getcover/${email}`);
        const coverimg = await response.json();
        setPreviewBanner(coverimg);
      } catch (error) {
        // console.log(error.message);
      }
    };

    getChannelCover();
  }, [email]);

  useEffect(() => {
    if (loading === true) {
      document.body.classList.add("bg-css2");
    } else if (!loading) {
      document.body.classList.remove("bg-css2");
    }
  }, [loading]);

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

      if (ProfileChanges === true) {
        profileURL = await UploadProfile();
      }

      if (BannerChanges === true) {
        coverURL = await UploadBanner();
      }

      const data = {
        profileURL: profileURL,
        coverURL: coverURL,
        channelid: channelID,
      };

      const response = await fetch(
        `http://localhost:3000/savecustomization/${email}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const user = await response.json();
      if (user) {
        setLoading(false);
        setChanges(false);
      } else {
        setLoading(true);
      }
    } catch (error) {
      // console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const publishBtn = document.querySelector(".save-customize");

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
      {loading === true ? (
        <div className="spin3">
          <ReactLoading type={"spin"} color={"white"} height={40} width={40} />
          <p>Saving data...</p>
        </div>
      ) : (
        <div className="channel-branding-section">
          <div className="profile-update-section">
            <p className="profile-head-txt">Picture</p>
            <p className="profile-desc-txt">
              Your profile picture will appear where your channel is presented
              on YouTube, like next to your videos and comments.
            </p>
            <p className="profile-desc-txt">
              (Please refresh the page if the images don’t load properly.)
            </p>
            <div className="picture-section">
              <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
              <div className="pic-extra-content">
                It’s recommended to use a picture that’s at least 98 x 98 pixels
                and 4MB or less. Use a PNG or GIF (no animations) file. Make
                sure your picture follows the YouTube Community Guidelines.
                <label className="change-image" htmlFor="profile-image-input">
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
            <p className="cover-head">Banner image</p>
            <p className="banner-desc">
              This image will appear across the top of your channel
            </p>
            <p className="profile-desc-txt">
              (Please refresh the page if the images don’t load properly.)
            </p>
            <div className="banner-section">
              <SkeletonTheme baseColor="#353535" highlightColor="#444">
                <div
                  className="pic-div"
                  style={
                    fakeLoading === true
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                >
                  <Skeleton count={1} width={290} height={160} />
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
              <div className="pic-extra-content">
                For the best results on all devices, use an image that’s at
                least 2048 x 1152 pixels and 6MB or less.
                <label className="change-image" htmlFor="banner-image-input">
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
      )}
    </>
  );
}

export default Branding;
