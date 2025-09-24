// Tìm kiếm theo tiêu đề trong card
const input = document.getElementById('announce-search');
const clearBtn = document.getElementById('announce-clear');

if (input) {
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.notice-card h5').forEach(h => {
      const card = h.closest('.notice-card');
      card.style.display = h.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
  });
}
