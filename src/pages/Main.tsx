import { useEffect, useState } from "react";
import Card from "../components/card";
import SearchBar from "../components/searchBar";
import Toggle from "../components/toggle";
import Item from "../components/item";
import ProjectStudySelector from "../components/projectStudy";
import axios from "axios";
import { postDetail } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "../store/modules";

const Main = () => {
  const [classNum, setClassNum] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(15);
  const [subject, setSubject] = useState<string[]>([]);
  const [stack, setStack] = useState<string[]>([]);
  const [status, setStatus] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [post, setPost] = useState<postDetail[]>();
  const curriculumId = useSelector(
    (state: RootState) => state.curriculum.curriculumId
  );
  const handleSearchInputChange = (value: any) => {
    setSearchValue(value);
  };
  const handleOptionChange = (option: any) => {
    setClassNum(option);
  };

  const subStacks = [
    { value: "CS", label: "CS-스터디", type: "subject" },
    { value: "코딩 테스트", label: "코딩 테스트-스터디", type: "subject" },
    { value: "면접", label: "면접-스터디", type: "subject" },
    { value: "프론트엔드", label: "프론트엔드-프로젝트", type: "subject" },
    { value: "백엔드", label: "백엔드-프로젝트", type: "subject" },
    { value: "데브옵스", label: "데브옵스-프로젝트", type: "subject" },
    { value: "AI", label: "AI-프로젝트", type: "subject" },
    { value: "Java", label: "Java", type: "stack" },
    { value: "Javascript", label: "Javascript", type: "stack" },
    { value: "Typescript", label: "Typescript", type: "stack" },
    { value: "React", label: "React", type: "stack" },
    { value: "Redux", label: "Redux", type: "stack" },
    { value: "Spring", label: "Spring", type: "stack" },
    { value: "AWS", label: "AWS", type: "stack" },
    { value: "쿠버네티스", label: "쿠버네티스", type: "stack" },
    { value: "Kubernetes", label: "Kubernetes", type: "stack" },
    { value: "Tensorflow", label: "Tensorflow", type: "stack" },
  ];
  // const handleSubjectChange = (selectedOptions: string[]) => {
  //   setSubject(selectedOptions);
  // };

  // const handleStackChange = (selectedOptions: string[]) => {
  //   setStack(selectedOptions);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl =
          process.env.REACT_APP_DB_HOST +
          `/api/curriculum/${curriculumId}/posts?page=${page}&classification=${classNum}&sort=createdAt&status=${status}&search=${searchValue}`;

        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data;

        setPost(data.data.posts);
      } catch (error) {
        // console.error("Error:", error);
      }
    };

    fetchData();
  }, [curriculumId, classNum, page, subject, stack, status, searchValue]);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  };
  const [gridClass, setGridClass] = useState("grid-cols-4"); // 기본 클래스는 4열 그리드

  useEffect(() => {
    const handleResize = () => {
      let newGridClass = "grid-cols-4"; // 기본 클래스 설정
      switch (true) {
        case window.innerWidth < 1150:
          newGridClass = "grid-cols-3";
          break;
        case window.innerWidth < 840:
          newGridClass = "grid-cols-2";
          break;
        case window.innerWidth < 400:
          newGridClass = "grid-cols-1";
          break;
        default:
          newGridClass = "grid-cols-4";
          break;
      }

      setGridClass(newGridClass);
    };

    // 창 크기가 변경될 때마다 handleResize 함수를 호출합니다.
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 리스너를 제거합니다.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);
  if (!curriculumId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex justify-center">
      <div className="flex flex-col w-full  max-w-7xl gap-5 pt-3 p-5">
        <div className="flex justify-between items-center">
          <div>
            <ProjectStudySelector
              selectedOption={classNum}
              onOptionChange={handleOptionChange}
            />
          </div>
          <SearchBar
            searchValue={searchValue}
            onSearchInputChange={handleSearchInputChange}
          />
          {/* <MultiSelect
            options={subStacks.filter((item) => item.type === "subject")}
            placeholder="Select Subjects"
            selectedValues={subject}
            onChange={handleSubjectChange}
            name="Subjects"
          />
          <MultiSelect
            options={subStacks.filter((item) => item.type === "stack")}
            placeholder="Select Stacks"
            selectedValues={stack}
            onChange={handleStackChange}
            name="Stacks"
          /> */}
          <div className="flex">
            <Toggle onToggle={setStatus} />
            <span>모집중만 보기</span>
          </div>
        </div>
        <div className="py-3 flex gap-3">
          {selected.map((item) => (
            <Item text={item} />
          ))}
        </div>
        <div
          className={`grid gap-20 ${gridClass} justify-items-center items-center`}
        >
          {post?.map((item, index) => (
            <Card
              key={index}
              id={item.id}
              title={item.title}
              stack={item.stack}
              subject={item.subject}
            />
          ))}
        </div>
        <div>
          <button onClick={handlePrevPage} disabled={page === -1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default Main;
