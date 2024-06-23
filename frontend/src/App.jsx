import Browse from "./Components/Browse";
import Studio from "./Components/Studio";
import Error from "./Components/Error";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoSection from "./Components/VideoSection";
import LikeVideos from "./Components/LikeVideos";
import WatchLater from "./Components/WatchLater";
import OtherChannel from "./Components/Channel/OtherChannel";
import Subscriptions from "./Components/Subscriptions";
import Trending from "./Components/Trending";
import SearchResults from "./Components/SearchResults";
import Playlists from "./Components/Playlists";
import Library from "./Components/Library";
import Customization from "./Components/Studio/Customization";
import Content from "./Components/Studio/Content";
import VideoDetails from "./Components/Studio/VideoDetails";
import Comments from "./Components/Studio/Comments";
import VideoComments from "./Components/Studio/VideoComments";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import ytLogo from "./img/icon.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "./reducer/user";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function App() {
  const User = useSelector((state) => state.user.user);
  const { user } = User;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <BrowserRouter>
        <Helmet>
          <link rel="icon" type="image/x-icon" href={ytLogo} />
        </Helmet>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/home" element={<Browse />} />
          <Route
            path="/studio"
            element={user ? <Studio /> : <Error />}
          />
          <Route
            path="/studio/customize"
            element={user ? <Customization /> : <Error />}
          />
          <Route
            path="/studio/video"
            element={user ? <Content /> : <Error />}
          />
          <Route
            path="/studio/comments"
            element={user ? <Comments /> : <Error />}
          />
          <Route
            path="/studio/video/edit/:id"
            element={user ? <VideoDetails /> : <Error />}
          />
          <Route
            path="/studio/video/comments/:id"
            element={user ? <VideoComments /> : <Error />}
          />
          <Route
            path="/likedVideos"
            element={user ? <LikeVideos /> : <Error />}
          />
          <Route
            path="/watchlater"
            element={user ? <WatchLater /> : <Error />}
          />

          <Route
            path="/library"
            element={user ? <Library /> : <Error />}
          />
          <Route path="/channel/:id" element={<OtherChannel />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/results/:data" element={<SearchResults />} />
          <Route path="/playlist/:id" element={<Playlists />} />
          <Route
            path="/subscriptions"
            element={user ? <Subscriptions /> : <Error />}
          />
          <Route path="/video/:id" element={<VideoSection />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
