import { useEffect } from "react";
import { useParams } from "react-router-dom";

function VideoSection() {
  const { id } = useParams();

  useEffect(() => {
    const getVideoData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/videodata/${id}`);
        await response.json();
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideoData();
  }, [id]);

  return (
    <>
      <h1>{id}</h1>
    </>
  );
}

export default VideoSection;
