// Hàm kiểm tra xem header + footer đã load xong chưa
function checkLayoutReady() {
  if (document.body.dataset.headerLoaded === "true" &&
      document.body.dataset.footerLoaded === "true") {
    document.body.classList.add("ready"); // Hiện body
  }
}
