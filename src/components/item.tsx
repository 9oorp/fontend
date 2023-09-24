import React from "react";

const Item: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <div className="w-fit rounded-lg px-2 py-1 bg-my-green bg-opacity-10 text-my-textgreen text-opacity-60">
      {text}
    </div>
  );
};

export default Item;
