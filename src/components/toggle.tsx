import React, { useState } from "react";
import { ToggleProps } from "../types";

const Toggle: React.FC<ToggleProps> = ({ initial = 0, onToggle }) => {
  const [isToggled, setIsToggled] = useState<number>(initial);

  const handleToggle = () => {
    const newState = isToggled === 0 ? 1 : 0;
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
        backgroundColor: isToggled ? "#f44336" : "#4caf50",
        color: "white",
        cursor: "pointer",
      }}
    >
      {isToggled ? "OFF" : "ON"}
    </button>
  );
};

export default Toggle;
