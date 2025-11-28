import './search.css'
import { initSearch } from './search.js'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div id="resultsCount" class="results-count"></div>
    <div id="results" class="results"></div>

    <div class="search-bar">
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
