let data = [];
let normalizedData = [];
let activeItemId = null;

const VIETNAMESE_MARKS = {
  'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
};

function normalizeVietnamese(str) {
  if (!str) return '';

  let result = str.toLowerCase();

  for (const [char, replacement] of Object.entries(VIETNAMESE_MARKS)) {
    result = result.replace(new RegExp(char, 'g'), replacement);
  }

  return result.trim();
}

function precomputeNormalizedData() {
  normalizedData = data.map(item => ({
    normalizedQuestion: normalizeVietnamese(item.question),
    normalizedAnswer: normalizeVietnamese(item.answer),
    original: item
  }));
}

function searchData(keyword, type, field) {
  if (keyword.length < 2) {
    return [];
  }

  const normalizedKeyword = normalizeVietnamese(keyword);

  return normalizedData
    .filter(item => {
      const targetText = field === 'answer' ? item.normalizedAnswer : item.normalizedQuestion;

      if (type === 'contains') {
        return targetText.includes(normalizedKeyword);
      } else {
        return targetText.startsWith(normalizedKeyword);
      }
    })
    .map(item => item.original);
}

function renderResults(items, keyword) {
  const searchInput = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const resultsCount = document.getElementById('resultsCount');

  if (items.length === 0) {
    if (searchInput.value.length >= 2) {
      results.innerHTML = '<div class="no-results">Không tìm thấy kết quả phù hợp</div>';
      resultsCount.textContent = 'Không có kết quả';
    } else {
      results.innerHTML = '<div class="no-results">Nhập ít nhất 2 ký tự để tìm kiếm</div>';
      resultsCount.textContent = '';
    }
    return;
  }

  resultsCount.textContent = `Tìm thấy ${items.length} kết quả`;

  results.innerHTML = items
    .map((item, index) => {
      const highlightedQuestion = highlightText(item.question, keyword);
      const highlightedAnswer = highlightText(item.answer, keyword);

      return `
      <div class="result-item" data-id="${index}">
        <div class="question">${highlightedQuestion}</div>
        <div class="answer">${highlightedAnswer}</div>
      </div>
    `})
    .join('');

  document.querySelectorAll('.result-item').forEach(item => {
    item.addEventListener('click', function() {
      const itemId = this.getAttribute('data-id');

      if (activeItemId === itemId) {
        this.classList.remove('active');
        activeItemId = null;
      } else {
        document.querySelectorAll('.result-item').forEach(el => {
          el.classList.remove('active');
        });
        this.classList.add('active');
        activeItemId = itemId;
      }
    });
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchType = document.getElementById('searchType');
  const searchField = document.getElementById('searchField'); 

  const keyword = searchInput.value;
  const type = searchType.value;
  const field = searchField.value;

  activeItemId = null;

  const filteredData = searchData(keyword, type, field);
  renderResults(filteredData, keyword);
}

async function loadData(url) {
  const results = document.getElementById('results');
  try {
    results.innerHTML = '<div class="loading">Đang tải dữ liệu...</div>';
    
    data = [];
    normalizedData = [];

    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    data = await response.json();
    precomputeNormalizedData();

    handleSearch(); 
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    results.innerHTML = `<div class="no-results">Lỗi: Không thể tải ${url}</div>`;
  }
}

// Map ký tự không dấu sang các biến thể có dấu
const ACCENT_MAP = {
  'a': 'aàảãáạăằẳẵắặâầẩẫấậAÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
  'd': 'dđDĐ',
  'e': 'eèẻẽéẹêềểễếệEÈẺẼÉẸÊỀỂỄẾỆ',
  'i': 'iìỉĩíịIÌỈĨÍỊ',
  'o': 'oòỏõóọôồổỗốộơờởỡớợOÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
  'u': 'uùủũúụưừửữứựUÙỦŨÚỤƯỪỬỮỨỰ',
  'y': 'yỳỷỹýỵYỲỶỸÝỴ'
};

// Hàm tạo Regex chấp nhận cả có dấu và không dấu
function getHighlightRegex(keyword) {
  if (!keyword) return null;
  
  const normalized = keyword.toLowerCase().trim();
  // Chuyển từng ký tự của từ khóa thành nhóm Regex
  // Ví dụ: "da" -> "[dđDĐ][aàả...]"
  let pattern = '';
  for (const char of normalized) {
    if (ACCENT_MAP[char]) {
      pattern += `[${ACCENT_MAP[char]}]`;
    } else {
      // Escape các ký tự đặc biệt của Regex (như ., ?, *)
      pattern += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  
  return new RegExp(`(${pattern})`, 'gi');
}

function highlightText(text, keyword) {
  if (!text) return '';
  if (!keyword || keyword.length < 2) return escapeHtml(text);

  const regex = getHighlightRegex(keyword);
  if (!regex) return escapeHtml(text);

  const parts = text.split(regex);

  return parts.map(part => {
    if (part.match(regex)) {
      return `<span class="highlight">${escapeHtml(part)}</span>`;
    }
    return escapeHtml(part);
  }).join('');
}

export function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchType = document.getElementById('searchType');
  const searchField = document.getElementById('searchField');
  const dataSelect = document.getElementById('dataSelect');

  loadData(dataSelect.value);

  searchInput.addEventListener('input', handleSearch);
  searchType.addEventListener('change', handleSearch);
  
  if (searchField) {
    searchField.addEventListener('change', handleSearch);
  }

  dataSelect.addEventListener('change', function() {
    const selectedFile = this.value; 
    loadData(selectedFile);
  });
}
