import "./playclipbutton.css";

function PlayClipButton({
  startTime,
  endTime,
  index,
  handleButtonClick,
  selected,
}) {
  const handleClick = () => {
    handleButtonClick(startTime, endTime, index);
  };
  return (
    <button
      style={{
        backgroundColor: selected ? "#2196f3" : "",
      }}
      className="playclipbutton"
      onClick={handleClick}
    >
      Play Clip {index}
    </button>
  );
}
export default PlayClipButton;
