import React, { useState } from "react";

const Input: React.FC<{
  placeholder: string;
  selectedValue: string;
  onChange: (value: string) => void;
}> = ({ placeholder, selectedValue, onChange }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue); // 이 부분은 선택한 값을 상태로 관리하기 위한 것입니다.
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={selectedValue}
        onChange={handleInputChange}
        className="outline-none w-full p-2 pl-3 pr-12 placeholder-gray-900 border-2 focus:border-my-blue hover:border-my-blue transition-all duration-300 ring-0 rounded-xl placeholder:text-gray-400"
      />
    </div>
  );
};

export default Input;
