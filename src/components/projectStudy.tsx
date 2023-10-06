const ProjectStudySelector = ({ selectedOption, onOptionChange }: any) => {
  const handleOptionChange = (value: string) => {
    onOptionChange(value);
  };

  return (
    <div className="flex items-center space-x-4">
      <div
        className={`cursor-pointer ${
          selectedOption === "1" ? "text-blue-600 font-bold" : "text-gray-600"
        }`}
        onClick={() => handleOptionChange("1")}
      >
        프로젝트
      </div>
      <div
        className={`cursor-pointer ${
          selectedOption === "0" ? "text-my-blue font-bold" : "text-gray-600"
        }`}
        onClick={() => handleOptionChange("0")}
      >
        스터디
      </div>
    </div>
  );
};

export default ProjectStudySelector;
