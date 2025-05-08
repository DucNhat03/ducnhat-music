/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9333ea', // Purple
        'primary-dark': '#6b1fae', // Màu tím đậm
        'background-light': '#f9f9f9', // Màu nền sáng
        'error-bg': '#f8d7da', // Màu nền thông báo lỗi
        'error-text': '#721c24', // Màu chữ thông báo lỗi
        'button-bg': '#6b46c1', // Màu nền nút
        'button-hover': '#553c9a', // Màu nền khi hover nút
        'text-dark': '#333333', // Màu chữ tối cho các phần tử nhập liệu
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Nếu bạn muốn hỗ trợ chế độ tối
}
