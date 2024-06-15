import { useState } from "react";
import "./inputfield.css";

function InputField({ label, handleUrlSubmit, handlePromptSubmit }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    if (handleUrlSubmit) {
      handleUrlSubmit(e.target.value);
    }
    if (handlePromptSubmit) {
      handlePromptSubmit(e.target.value);
    }
  };

  return (
    <div className="inputfield-container">
      <input onChange={handleChange} value={value} type="text" required />
      <div className="bar"></div>
      <label className="text-Label">{label}</label>
    </div>
  );
}
export default InputField;
