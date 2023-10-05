import { useEffect, useState } from "react";

const DynamicImage = ({ imageName }: any) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // 이미지를 동적으로 불러옵니다.
    import(`../assets/${imageName}.png`).then((image) => {
      setImageSrc(image.default);
    });
    // .catch((error) => console.error(error));
  }, [imageName]);

  return <img src={imageSrc} alt={imageName} />;
};

export default DynamicImage;
