import './search.css'
import { initSearch } from './search.js'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div id="resultsCount" class="results-count"></div>
    <div id="results" class="results"></div>

    <div class="search-bar">
      <select id="dataSelect" class="source-select">
        <option value="data4.json" selected>Kỹ thuật lập trình hướng đối tượng</option>
        <option value="data.json">Pháp luật đại cương</option>
        <option value="data2.json">Tin học đại cương</option>
        <option value="data3.json">Triết học</option>
        <option value="data5.json">Chủ nghĩa xã hội khoa học</option>
        <option value="data6.json">Hệ quản trị cơ sở dữ liệu</option>
      </select>
      <input
        type="text"
        id="searchInput"
        placeholder="Nhập từ khóa (tối thiểu 2 ký tự)..."
        autocomplete="off"
      >
      <select id="searchField">
        <option value="question">Tìm theo Câu hỏi</option>
        <option value="answer">Tìm theo Câu trả lời</option>
      </select>
      <select id="searchType">
        <option value="contains">Chứa từ khóa</option>
        <option value="startsWith">Bắt đầu với từ khóa</option>
      </select>
    </div>
  </div>
`

initSearch()
