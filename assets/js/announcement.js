document.addEventListener("DOMContentLoaded", () => {
  const dummyData = [
    { title: "Thông báo 1", date: "26/09/2025", content: "Chi tiết thông báo 1" },
    { title: "Thông báo 2", date: "27/09/2025", content: "Chi tiết thông báo 2" },
    { title: "Thông báo 3", date: "28/09/2025", content: "Chi tiết thông báo 3" }
  ];

  const container = document.getElementById("announcement-results");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  function render(data) {
    container.innerHTML = data.map(item => `
      <div class="col-md-6 col-lg-4">
        <div class="notice-card">
          <h5>${item.title}</h5>
          <p class="meta">${item.date}</p>
          <p>${item.content}</p>
          <a href="#" class="btn btn-sm btn-login">Chi tiết</a>
        </div>
      </div>
    `).join("");
  }

  // Render ban đầu
  render(dummyData);

  // Sự kiện search
  searchBtn.addEventListener("click", () => {
    const q = searchInput.value.toLowerCase();
    const results = dummyData.filter(x => x.title.toLowerCase().includes(q));
    render(results);
  });
});
