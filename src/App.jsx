import { Fragment, useState } from "react";
import InputField from "./components/InputField";
import VideoField from "./components/VideoField";
import VideoPlayer from "./components/VideoPlayer";
import PlayClipButton from "./components/PlayClipButton";
import HashLoader from "react-spinners/HashLoader";
import "./App.css";

function App() {
  const [timeStamps, settimeStamps] = useState([]);
  const [videoStartValue, setvideoStartValue] = useState(0);
  const [key, setKey] = useState(0);
  const [videoEndValue, setvideoEndValue] = useState(999999);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showError, setshowError] = useState(false);
  const [playing, setplaying] = useState(false);
  const [selectedButton, setSelectedButton] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // const timeStamps = [
  //   [3, 10],
  //   [14, 17],
  //   [20, 30],
  // ];
  // const handleRequest = async (url, prompt) => {
  //   const timeStamps = [
  //     [20, 30],
  //     [20, 30],
  //     [20, 30],
  //   ];
  //   const response = await fetch("https://3d5962dd-25ee-4fa3-a398-00011b986375.mock.pstmn.io/api", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       link: url,
  //       prompt: prompt,
  //     }),
  //   });

  //   // const result = await response.json();
  //   console.log(result);

  //   setShowPlayer(true);
  //   setLoading(false);

  //   settimeStamps([...timeStamps]);
  // };

  const handlePlayclip = (startValue, endValue, index) => {
    setKey(Math.random());
    setvideoStartValue(parseInt(startValue));
    setvideoEndValue(parseInt(endValue));
    setSelectedButton(index);
    setplaying(true);
  };
  const handleUrlSubmit = (value) => {
    setUrl(value);
  };

  const handlePromptSubmit = (value) => {
    setPrompt(value);
  };
  const handleVideoSubmit = (value) => {
    setUrl(value);
  };
  const handleDoneClick = () => {
    if (!url || !prompt) {
      setshowError(true);
      return;
    }
    setshowError(false);
    setLoading(true);

    fetch('http://127.0.0.1:5000/process', {
      method: 'POST',
      body: JSON.stringify({ url, prompt }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // handle the response data here
      setShowPlayer(true);
      setLoading(false);
      let time = data.timestamps;
      settimeStamps(time);
    })
    .catch(error => {
      setLoading(false);
      setshowError(true);
    });

    // handleRequest(url, prompt);

  };

  const renderedButtons = timeStamps.map((timeStamp, i) => {
    return (
      <PlayClipButton
        key={timeStamp[0]}
        startTime={timeStamp[0]}
        endTime={timeStamp[1]}
        index={i + 1}
        selected={selectedButton === i + 1}
        handleButtonClick={handlePlayclip}
      />
    );
  });

  return (
    <Fragment>
      <div className="heading">
        <h1>VideoStampify</h1>
      </div>
      <div className="container">
        <InputField
          label={"Enter Video URL"}
          handleUrlSubmit={handleUrlSubmit}
        />
        <VideoField onSubmit={handleVideoSubmit} />
        <InputField
          label={"Your prompt goes here"}
          handlePromptSubmit={handlePromptSubmit}
        />
        <div>
          <button
            onClick={handleDoneClick}
            style={{
              backgroundColor: showError ? "red" : "",
            }}
          >
            Done
          </button>
          {showError && (
            <div className="error">Please provide a video and a prompt!</div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="loader">
          <HashLoader size={80} color="#2196f3" />
          <div>Processing...</div>
        </div>
      ) : (
        <div className="player">
          <VideoPlayer
            url={showPlayer && url}
            key={key}
            startTime={videoStartValue}
            endTime={videoEndValue}
            end={videoEndValue}
            playing={playing}
          />
          <div>{renderedButtons}</div>
        </div>
      )}
    </Fragment>
  );
}

export default App;
