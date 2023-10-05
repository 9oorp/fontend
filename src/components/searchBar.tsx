import { ReactComponent as SearchSVG } from "../assets/search-outlined.svg";

const SearchBar = ({ searchValue, onSearchInputChange }: any) => {
  const handleInputChange = (event: any) => {
    const value = event.target.value;
    onSearchInputChange(value); // Call the callback function with the input value
  };

  return (
    <div className="relative flex justify-center items-center ">
      <div className="absolute left-5 z-10">
        <SearchSVG className="w-5 aspect-square fill-gray-300" />
      </div>

      <input
        placeholder="프로젝트 제목으로 검색"
        value={searchValue}
        onChange={handleInputChange}
        className=" outline-none cursor-text p-2 pl-12 placeholder-gray-900 border-2 transition-all duration-300 ring-0 rounded-xl placeholder:text-gray-400 focus:border-my-blue hover:border-my-blue"
      />
    </div>
  );
};
export default SearchBar;
