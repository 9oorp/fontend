import { createSlice } from "@reduxjs/toolkit";

// 슬라이스 초기 상태
const initialState = {
  curriculumId: 1, // 초기 curriculumId 값
};

// curriculum 슬라이스 생성
const curriculumSlice = createSlice({
  name: "curriculum",
  initialState,
  reducers: {
    setCurriculumId: (state, action) => {
      state.curriculumId = action.payload;
    },
  },
});

// 액션 생성자 내보내기
export const { setCurriculumId } = curriculumSlice.actions;

// 리듀서 내보내기
export default curriculumSlice.reducer;
