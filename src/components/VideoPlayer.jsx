import { useRef } from "react";
import ReactPlayer from "react-player";

function VideoPlayer({ url, key, startTime, endTime, playing }) {
  const playerRef = useRef(null);
  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url={url}
        key={key}
        width="900px"
        height="400px"
        playing={playing}
        controls={true}
        onProgress={(state) => {
          if (Math.floor(state.playedSeconds) >= endTime) {
            playerRef.current.getInternalPlayer().pause();
          }
        }}
        onStart={() => {
          if (startTime != 0) {
            playerRef.current.seekTo(startTime);
          }
        }}
        config={{
          youtube: {
            playerVars: {
              start: startTime,
              end: endTime,
            },
          },
        }}
      />
      ;
    </div>
  );
}

export default VideoPlayer;
