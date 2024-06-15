import { useState } from "react";
import "./VideoField.css";
function VideoField({ onSubmit }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.files[0]);
    onSubmit(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="videoInput-container">
      <div> or Drop a video</div>
      <label
        htmlFor="video"
        style={{
          backgroundColor: value ? "#2196f3" : "",
        }}
      >
        Choose File
      </label>
      <input
        type="file"
        id="video"
        accept="video/*"
        onChange={handleChange}
        hidden
      />
      {value && <p className="selected-file">Selected file: {value.name}</p>}
    </div>
  );
}
export default VideoField;
