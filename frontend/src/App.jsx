import Browse from "./Components/Browse";
import Studio from "./Components/Studio";
import Error from "./Components/Error";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoSection from "./Components/VideoSection";

function App() {
  const token = localStorage.getItem("userToken");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/studio" element={token ? <Studio /> : <Error />} />
          <Route path="/:id" element={<VideoSection />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
