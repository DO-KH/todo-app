
module.exports = {
  darkMode: "selector",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/globals.css"
  ],
  theme: {
    extend: {
      colors: {
        deepgreen: '#6ab04c', // 메인 색상
        deeporange: '#f0932b', // 포커스 색상
        darkblack: '#333333', // 기본 글자 색상
        dimblack: '#555555', // 필요시
        silverblack: '#777777', // 문단 글자 색상
        lightblack: '#999999', // 필요시
        linecolor: '#f8f8f8' // 그레이 구분선 색상
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Arial', 'sans-serif'], // 기본 글꼴
        notosans: ['Noto Sans KR', 'sans-serif'], // 메인 한글 글꼴
        raleway: ['Raleway', 'sans-serif'], // 메인 영어 글꼴
        montserrat: ['Montserrat', 'sans-serif'], // 서브 영어 글꼴
      }
    },
  },
  plugins: [],
};

