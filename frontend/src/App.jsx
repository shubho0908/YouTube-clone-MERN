import Browse from "./Components/Browse";
import Studio from "./Components/Studio";
import Error from "./Components/Error";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoSection from "./Components/VideoSection";
import LikeVideos from "./Components/LikeVideos";
import WatchLater from "./Components/WatchLater";
import ChannelTop from "./Components/Channel/ChannelTop";
import OtherChannel from "./Components/Channel/OtherChannel";
import Subscriptions from "./Components/Subscriptions";
import Trending from "./Components/Trending";
import SearchResults from "./Components/SearchResults";
import Playlists from "./Components/Playlists";
import Library from "./Components/Library";
import Customization from "./Components/Studio/Customization";

function App() {
  const token = localStorage.getItem("userToken");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/studio" element={token ? <Studio /> : <Error />} />
          <Route path="/studio/customize" element={token ? <Customization /> : <Error />} />
          <Route
            path="/likedVideos"
            element={token ? <LikeVideos /> : <Error />}
          />
          <Route
            path="/watchlater"
            element={token ? <WatchLater /> : <Error />}
          />
          <Route
            path="/mychannel/:id"
            element={token ? <ChannelTop /> : <Error />}
          />
          <Route
            path="/library"
            element={token ? <Library /> : <Error />}
          />
          <Route
            path="/channel/:id"
            element={<OtherChannel />}
          />
          <Route
            path="/trending"
            element={<Trending />}
          />
          <Route
            path="/results/:data"
            element={<SearchResults />}
          />
          <Route
            path="/playlist/:id"
            element={<Playlists />}
          />
          <Route
            path="/subscriptions"
            element={token ? <Subscriptions /> : <Error />}
          />
          <Route path="/video/:id" element={<VideoSection />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
