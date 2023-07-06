import Browse from "./Components/Browse";
import Studio from "./Components/Studio";
import Error from "./Components/Error";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoSection from "./Components/VideoSection";
import LikeVideos from "./Components/LikeVideos";
import WatchLater from "./Components/WatchLater";

function App() {
  const token = localStorage.getItem("userToken");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/studio" element={token ? <Studio /> : <Error />} />
          <Route
            path="/likedVideos"
            element={token ? <LikeVideos /> : <Error />}
          />
          <Route
            path="/watchlater"
            element={token ? <WatchLater /> : <Error />}
          />
          <Route path="/video/:id" element={<VideoSection />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
