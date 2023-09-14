import React, { useState } from "react";
import { ToggleProps } from "../types";

const Toggle: React.FC<ToggleProps> = ({ initial = false, onToggle }) => {
  const [isToggled, setIsToggled] = useState(initial);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        padding: "5px 15px",
        borderRadius: "4px",
        backgroundColor: isToggled ? "#4caf50" : "#f44336",
        color: "white",
        cursor: "pointer",
      }}
    >
      {isToggled ? "ON" : "OFF"}
    </button>
  );
};

export default Toggle;
