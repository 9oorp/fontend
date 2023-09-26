import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as DownSVG } from "../assets/down-outlined.svg";
import { cls } from "../libs/utils";
import { SingleSelectProps, Option } from "../types";

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  placeholder,
  selectedValue,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    onChange(option.label);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      className="flex relative items-center hover:group" // Added w-full here
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-full">
        <input
          type="text"
          placeholder={placeholder}
          readOnly
          onClick={handleToggleDropdown}
          className={cls(
            "flex w-full outline-none cursor-pointer p-2 pl-3 pr-12 placeholder-gray-900 border-2 transition-all duration-300 ring-0 rounded-xl placeholder:text-gray-400",
            isOpen || hovered ? "border-my-blue" : ""
          )}
          value={selectedValue || ""}
        />
      </div>
      <div
        className={cls("absolute right-5 z-10 cursor-pointer ")}
        onClick={handleToggleDropdown}
      >
        <DownSVG
          className={cls(
            "w-5 aspect-square transition-all ",
            isOpen || hovered ? "fill-my-blue" : "fill-gray-300"
          )}
        />
      </div>

      {isOpen && (
        <ul className="absolute top-12 w-full bg-white border border-gray-300 rounded-md shadow-lg z-20 ">
          {options.map(
            (option: { value: any; label: any; type?: string | undefined }) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                <label className="flex items-center space-x-2">
                  <span>{option.label}</span>
                </label>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default SingleSelect;
