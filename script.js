// Font List
const fonts = {
  'Sans-serif': [
    'Roboto', 'Open_Sans', 'Lato', 'Montserrat', 'Nunito', 'Barlow', 'Raleway', 'Ubuntu', 'Work_Sans',
    'Fira_Sans', 'Overpass', 'Questrial', 'Karla', 'Exo_2', 'Noto_Sans', 'PT_Sans', 'Maven_Pro', 'Chivo',
    'Oxygen', 'Rubik', 'Source_Sans_3'
  ],
  'Serif': [
    'Lora', 'Playfair_Display', 'Crimson_Text', 'EB_Garamond', 'Cardo', 'Spectral', 'Vollkorn', 'Tinos', 'Arvo',
    'Domine', 'Alice', 'Cormorant_Garamond', 'Cormorant_Infant', 'Cormorant_Upright', 'Noto_Serif', 'Slabo_27px',
    'PT_Serif', 'Bitter', 'Noto_Serif_Display', 'Fauna_One', 'Caudex', 'Bellefair', 'Gentium_Plus'
  ],
  'Monospace': [
    'Inconsolata', 'Source_Code_Pro', 'Roboto_Mono', 'Fira_Code', 'JetBrains_Mono', 'IBM_Plex_Mono', 'Space_Mono',
    'Overpass_Mono', 'Anonymous_Pro', 'Courier_Prime'
  ]
};

// Font Browser
const fontList = document.getElementById('font-list');
const fontSearchInput = document.getElementById('font-search');
let selectedFont = null;
const previewText = document.getElementById('preview-text');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

let currentPreviewText = previewText.textContent || '';
function renderPreview(text) {
  previewText.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.className = 'glyph';
    span.dataset.index = String(i);
    span.textContent = text[i];
    previewText.appendChild(span);
  }
}

function renderFontGroups(searchTerm = '') {
  fontList.innerHTML = '';
  const searchLower = searchTerm.toLowerCase();
  
  Object.entries(fonts).forEach(([groupName, list]) => {
    const filteredList = list.filter(font => 
      font.toLowerCase().includes(searchLower)
    );
    
    if (filteredList.length > 0) {
      const heading = document.createElement('li');
      heading.textContent = groupName;
      heading.className = 'font-group-heading';
      fontList.appendChild(heading);

      filteredList.forEach(font => {
        const li = document.createElement('li');
        li.textContent = font;
        li.style.fontFamily = font;
        li.className = 'font-item';
        li.dataset.font = font;
        li.addEventListener('click', () => {
          selectFont(font, true);
        });
        fontList.appendChild(li);
      });
    }
  });
}
renderFontGroups();

function updateSelectedFontInList(font) {
  const items = fontList.querySelectorAll('.font-item');
  items.forEach(it => it.classList.remove('selected'));
  const match = fontList.querySelector(`.font-item[data-font="${CSS.escape(font)}"]`);
  if (match) match.classList.add('selected');
}

// Search 
fontSearchInput.addEventListener('input', () => {
  const searchTerm = fontSearchInput.value;
  renderFontGroups(searchTerm);
  if (selectedFont) {
    updateSelectedFontInList(selectedFont);
  }
});

function selectFont(font, addHistory) {
  selectedFont = font;
  previewText.style.fontFamily = font;
  updateSelectedFontInList(font);
  if (addHistory) addToHistory(font);
}

// Font history
let previewHistory = [];

function addToHistory(font) {
  previewHistory.push(font);
  const li = document.createElement('li');
  li.textContent = font;
  li.style.fontFamily = font;
  li.addEventListener('click', () => {
    selectFont(font, false);
  });
  historyList.appendChild(li);
}

// Clear history 
if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener('click', () => {
    previewHistory = [];
    historyList.innerHTML = '';
  });
}

// Placeholder değişimi
const placeholderInput = document.getElementById('placeholder-input');
placeholderInput.addEventListener('input', () => {
  currentPreviewText = placeholderInput.value;
  renderPreview(currentPreviewText);
});

// Glyph Rounding: sadece üzerine gelinen harfte değiştir
previewText.addEventListener('wheel', e => {
  e.preventDefault();
  const target = e.target;
  if (!target || !(target instanceof HTMLElement)) return;
  const span = target.closest('.glyph');
  if (!span || !previewText.contains(span)) return;
  const idx = Number(span.dataset.index);
  if (Number.isNaN(idx)) return;
  const char = currentPreviewText[idx] || '';
  const newChar = getGlyph(char, e.deltaY > 0 ? 1 : -1);
  currentPreviewText = currentPreviewText.substring(0, idx) + newChar + currentPreviewText.substring(idx + 1);
  span.textContent = newChar;
});

const alphabet = 'abcçdefgğhıijklmnoöprsştuüvyzxqwABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZXQW';
function getGlyph(char, dir) {
  const set  = alphabet;
  const i = set.indexOf(char);
  if (i === -1) return char;
  let newIndex = (i + dir + set.length) % set.length;
  return set[newIndex];
}

renderPreview(currentPreviewText);
