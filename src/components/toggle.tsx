import React, { useState } from "react";
import { ToggleProps } from "../types";

const Toggle: React.FC<ToggleProps> = ({ initial = 0, onToggle }) => {
  const [isToggled, setIsToggled] = useState<boolean>(initial === 1);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onToggle) {
      onToggle(newState ? 1 : 0);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative w-16 min-w-[4rem] h-8 bg-gray-400 rounded-full p-1 transition-colors ${
        isToggled ? "bg-red-500" : "bg-green-500"
      }`}
    >
      <div
        className={`absolute w-6 h-6 top-1 left-2 bg-white rounded-full shadow-md transform transition-transform ${
          isToggled ? "translate-x-full" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
};

export default Toggle;
