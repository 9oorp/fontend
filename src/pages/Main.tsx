import { useState } from "react";
import Card from "../components/card";
import MultiSelect from "../components/multiSelect";
import SearchBar from "../components/searchBar";
import Toggle from "../components/toggle";

const Main = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [state, setState] = useState(false);
  console.log(state);
  const data = [
    {
      title: "제목",
      name: "최민우",
      whatwedo: ["스터디", "면접"],
      stack: ["react", "spring"],
      createdAt: "2023-7-25",
    },
  ];
  const options = [
    { value: "스터디", label: "스터디", type: "subject" },
    { value: "코테", label: "코테", type: "subject" },
    { value: "react", label: "react", type: "stack" },
  ];

  return (
    <div className="h-[1000px] flex justify-center">
      <div className="flex flex-col w-full  max-w-7xl gap-5 pt-3 p-5">
        <div className="flex justify-between items-center">
          <div>
            <span>프로젝트</span>
            <span>스터디</span>
          </div>
          <SearchBar />
          <MultiSelect
            options={options}
            selectedValues={selected}
            onChange={setSelected}
          />
          <div className="flex">
            <Toggle onToggle={setState} />
            <span>모집중만 보기</span>
          </div>
        </div>
        <div>{selected}</div>
        <div className="grid grid-cols-4 gap-20">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};
export default Main;
