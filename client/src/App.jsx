import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [videosUrl, setVideosUrl] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      const response = await fetch("http://localhost:3000/");
      const data = await response.json();
      setVideosUrl(data);
    }

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {videosUrl.map((videoUrl) => {
        return <video className="h-screen" key={videoUrl} src={`${import.meta.env.VITE_AWSCLOUDFRONT_URL}/${videoUrl}.mp4`} width="320" controls></video>;
      })}
    </div>
  );
}

export default App;
