import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as DownSVG } from "../assets/down-outlined.svg";
import { cls } from "../libs/utils";
import { MultiSelectProps, Option } from "../types";

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    if (selectedValues.includes(option.value)) {
      onChange(selectedValues.filter((value) => value !== option.value));
    } else {
      onChange([...selectedValues, option.value]);
    }
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
      className="flex relative items-center hover:group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <input
          type="text"
          placeholder="스터디 주제, 기술스택"
          readOnly
          onClick={handleToggleDropdown}
          className={cls(
            "flex-1 outline-none cursor-pointer p-2 pl-3 pr-12 placeholder-gray-900 border-2 transition-all duration-300 ring-0 rounded-xl  placeholder:text-gray-400",
            isOpen || hovered ? "border-my-blue" : ""
          )}
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
        <ul className="absolute top-12 bg-white border border-gray-300 rounded-md shadow-lg w-60">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              <label className="flex items-center space-x-2">
                <span>{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default MultiSelect;
