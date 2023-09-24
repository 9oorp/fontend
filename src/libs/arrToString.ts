export default function arrToString(arr: string[]): string {
  // 배열을 알파벳순으로 정렬합니다.
  const sortedArr = arr.slice().sort();

  // 정렬된 배열의 요소를 문자열로 결합합니다.
  const result = sortedArr.join(",");

  return result;
}
