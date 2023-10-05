const ProjectStudySelector = ({ selectedOption, onOptionChange }: any) => {
  const handleOptionChange = (event: any) => {
    const option = event.target.value;
    onOptionChange(option); // Call the callback function with the selected option
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          value="1"
          checked={selectedOption === "1"}
          onChange={handleOptionChange}
        />
        프로젝트
      </label>
      <label>
        <input
          type="radio"
          value="0"
          checked={selectedOption === "0"}
          onChange={handleOptionChange}
        />
        스터디
      </label>
    </div>
  );
};

export default ProjectStudySelector;
