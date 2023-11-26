import axios from "axios";

export const refreshAccessToken = async (refreshToken: any) => {
  const headers = {
    Authorization: `Bearer ${refreshToken}`,
  };
  try {
    const response = await axios.post(
      // process.env.REACT_APP_DB_HOST +
      "/api/auth/refresh-token",
      null,
      {
        headers,
      }
    );

    // 새로운 access token을 얻었을 때의 처리
    if (response.data.ok) {
      // 서버 응답 확인
      const newAccessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);

      // 여기에서 accessToken 경로를 확인하고 값을 얻어올 수 있도록 코드를 수정
    } else {
      // console.error("토큰 갱신 실패: 응답 상태 코드", response.status);
    }
  } catch (error) {
    // console.error("토큰 갱신 실패", error);
  }
};
