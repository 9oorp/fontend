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
import { ReactComponent as RightSVG } from "../assets/chevron_right.svg";
import { ReactComponent as LeftSVG } from "../assets/chevron_left.svg";
import { cls } from "../libs/utils";
const Main = () => {
  const [classNum, setClassNum] = useState("0");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(5);
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
  const curriculumIdMap: { [key: number]: string } = {
    2: "풀스택 과정",
    3: "정보 보안 전문가 양성 과정",
    4: "쿠버네티스 과정",
    5: "AI자연어처리 과정",
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
          // process.env.REACT_APP_DB_HOST +
          `/api/curriculum/${curriculumId}/posts?page=${page}&classification=${
            classNum === "0" ? "STUDY" : "PROJECT"
          }&status=${
            status === 0 ? "RECRUITING" : "COMPLETED"
          }&search=${searchValue}`;

        const response = await axios.get(apiUrl);
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data;

        setPost(data.data.posts);

        setTotalPages(Math.ceil(data.data.totalCount / 20));
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
    if (page > 0) {
      handlePageChange(page - 1);
    }
  };
  const [gridClass, setGridClass] = useState("grid-cols-4");

  useEffect(() => {
    const handleResize = () => {
      let newGridClass = "grid-cols-1";

      switch (true) {
        case window.innerWidth > 1150:
          newGridClass = "grid-cols-4";
          break;
        case window.innerWidth > 840:
          newGridClass = "grid-cols-3";
          break;
        case window.innerWidth > 520:
          newGridClass = "grid-cols-2";
          break;
        default:
          newGridClass = "grid-cols-1";
          break;
      }

      setGridClass(newGridClass);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  if (!curriculumId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full overflow-x-hidden flex justify-center">
      <div className="flex  flex-col w-full  max-w-7xl gap-5 pt-3 p-5">
        <div
          className={cls(
            window.innerWidth < 600
              ? "grid gap-5"
              : "w-full flex justify-between items-center"
          )}
        >
          <div
            className={cls(
              window.innerWidth < 600 ? "flex justify-center items-center" : ""
            )}
          >
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
          <div className="flex justify-center items-center gap-2">
            <Toggle onToggle={setStatus} />
            <span>모집중만 보기</span>
          </div>
        </div>
        <div className="py-3 flex gap-3">
          {/* {selected.map((item) => (
            <Item text={item} />
          ))} */}
          {curriculumIdMap[curriculumId]}
        </div>
        {post?.length ? (
          <div
            className={`grid gap-14 ${gridClass} justify-items-center items-center`}
          >
            {post?.map((item, index) => (
              <Card
                key={index}
                id={item.id}
                title={item.title}
                stack={item.techStack}
                subject={item.subject}
                name={item.memberName}
                status={item.status}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            검색 결과가 없어요~
          </div>
        )}
        <div className="flex pt-5 justify-center items-center">
          <button
            onClick={handlePrevPage}
            style={{ cursor: "pointer", marginRight: "10px" }}
            disabled={page === -1}
          >
            <LeftSVG />
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            style={{ cursor: "pointer", marginLeft: "10px" }}
            disabled={page === totalPages - 1}
          >
            <RightSVG />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Main;
