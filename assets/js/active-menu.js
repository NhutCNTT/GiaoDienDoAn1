// assets/js/active-menu.js
fetch("components/header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-placeholder").innerHTML = html;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    // Reset tất cả active
    document.querySelectorAll("#header-placeholder .navbar-nav .nav-link, #header-placeholder .dropdown-item")
      .forEach(el => el.classList.remove("active"));

    // Active cho menu chính
    document.querySelectorAll("#header-placeholder .navbar-nav .nav-link[href]").forEach(link => {
      const hrefFile = link.getAttribute("href").split("/").pop();
      if (hrefFile === currentPage) link.classList.add("active");
    });

    // Nếu là trang con của danh mục → gắn active cho menu cha + mục con
    const danhMucPages = [
      "tailieu-giay.html", "tailieu-so.html",
      "csdl-nasati.html", "csdl-proquest.html",
      "z3950.html", "oai-pmh.html"
    ];
    if (danhMucPages.includes(currentPage)) {
      document.querySelector("#header-placeholder #dropdownMenu")?.classList.add("active");
      document.querySelectorAll("#header-placeholder .dropdown-item").forEach(item => {
        if (item.getAttribute("href").split("/").pop() === currentPage) {
          item.classList.add("active");
        }
      });
    }
  })
  .catch(err => console.error("Không thể tải header:", err));
