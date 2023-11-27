import { cls } from "../libs/utils";
import DynamicImage from "./dynamicImage";
import Item from "./item";
import { useNavigate } from "react-router-dom";

const Card = ({ title, stack, subject, id, name, status }: any) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/post/${id}`);
  };
  stack = stack && stack.slice(0, 5);
  subject = subject && subject.slice(0, 2);

  return (
    <div
      className={cls(
        "h-64 w-64 cursor-pointer transition-transform duration-300 hover:scale-110",
        status === "1" ? "opacity-50" : ""
      )}
      onClick={handleCardClick}
    >
      <div className="flex bg-my-blue p-8 rounded-t-md relative">
        {status === "0" ? (
          ""
        ) : (
          <div className="absolute top-4 left-6">
            <div
              style={{ color: "#D91C29" }}
              className="w-fit rounded-lg px-2 font-bold opacity-100 py-1 bg-red-400 bg-opacity-50  text-opacity-60"
            >
              모집완료
            </div>
          </div>
        )}
        <img
          src={`https://exp.goorm.io/_next/image?url=https%3A%2F%2Fstatics.goorm.io%2Fexp%2Fv1%2Fpngs%2Fmedal_1st.png&w=256&q=75`}
          alt="Blue Image"
          className="absolute top-0 right-0  w-24 object-cover"
        />
      </div>

      <div className="bottom bg-white p-4 pt-8 flex-1 rounded-b-md ">
        <h2 className="mb-4 text-xl font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">
          {title}
        </h2>

        <div className="mb-4 flex gap-3">
          {subject &&
            subject.map((item: any, index: any) => (
              <Item key={index} text={item} />
            ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="mb-4 flex gap-3 items-center justify-center">
            {stack &&
              stack.map((item: any, index: any) => (
                <DynamicImage key={index} imageName={item.toLowerCase()} />
              ))}
          </div>
        </div>
        <div className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-end">
          {name}
        </div>
      </div>
    </div>
  );
};

export default Card;
