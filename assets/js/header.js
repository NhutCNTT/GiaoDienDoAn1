/* =========================================================
   HEADER.JS – LOAD HEADER + LOGIN/LOGOUT + USER MENU
   ========================================================= */
document.addEventListener("DOMContentLoaded", loadHeader);

function loadHeader() {
  fetch("components/header.html")
    .then(res => res.text())
    .then(html => {
      const host = document.getElementById("header-placeholder");
      if (!host) return;

      // Gắn HTML header vào trang
      host.innerHTML = html;

      // Setup sau khi header đã render
      setupUserMenu(); 
      highlightActiveLink(); // ✅ Đánh dấu link active

      // Đánh dấu đã load header
      document.body.dataset.headerLoaded = "true";

      // Nếu có hàm checkLayoutReady (ngoài), gọi thêm
      if (typeof checkLayoutReady === "function") {
        checkLayoutReady();
      }
    })
    .catch(err => console.error("Lỗi khi load header:", err));
}

/* =========================================================
   AUTH UTILS
   ========================================================= */
function getAuth() {
  if (localStorage.getItem("loggedIn") === "true") {
    return { store: localStorage, username: localStorage.getItem("username") };
  }
  if (sessionStorage.getItem("loggedIn") === "true") {
    return { store: sessionStorage, username: sessionStorage.getItem("username") };
  }
  return null;
}

/* =========================================================
   SETUP USER MENU + LOGIN FORM
   ========================================================= */
function setupUserMenu() {
  const loginBtn = document.getElementById("login-btn");
  const userBox  = document.getElementById("user-menu");
  const auth = getAuth();

  if (auth?.username) {
    // 🔹 Đã đăng nhập
    loginBtn?.classList.add("d-none");
    userBox?.classList.remove("d-none");

    // Gắn tên & avatar
    const nameSpan = document.querySelector("#userMenu .user-name");
    if (nameSpan) nameSpan.textContent = auth.username;

    const avatar = document.querySelector("#userMenu .user-avatar");
    if (avatar) avatar.textContent = auth.username[0].toUpperCase();

    // Demo badge (thông báo)
    const bellBadge = document.querySelector("#bell-badge");
    const chatBadge = document.querySelector("#chat-badge");
    if (bellBadge) bellBadge.textContent = "3";
    if (chatBadge) chatBadge.textContent = "2";
  } else {
    // 🔹 Chưa đăng nhập
    userBox?.classList.add("d-none");
    loginBtn?.classList.remove("d-none");
  }

  // Đăng xuất
  document.getElementById("logout-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
  });

  // Xử lý form login nếu đang ở login.html
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const u = document.getElementById("username")?.value.trim();
      const p = document.getElementById("password")?.value.trim();
      const remember = document.getElementById("rememberMe")?.checked;
      const err = document.getElementById("error-msg");

      const demoUser = "phuoc";
      const demoPass = "123456";

      if (u === demoUser && p === demoPass) {
        const store = remember ? localStorage : sessionStorage;
        store.setItem("loggedIn", "true");
        store.setItem("username", u);
        window.location.href = "index.html";
      } else {
        if (err) {
          err.textContent = "❌ Tên đăng nhập hoặc mật khẩu không đúng!";
          err.classList.remove("d-none");
        } else {
          alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
      }
    });
  }
}

/* =========================================================
   HIGHLIGHT ACTIVE NAV LINK
   ========================================================= */
function highlightActiveLink() {
  const links = document.querySelectorAll(".navbar-nav .nav-link, .dropdown-item");
  const currentUrl = window.location.pathname.split("/").pop(); // ví dụ: introduce.html

  links.forEach(link => {
    const linkUrl = link.getAttribute("href");

    if (linkUrl === currentUrl) {
      link.classList.add("active");

      // Nếu link trong dropdown → đánh dấu cha
      const parentDropdown = link.closest(".dropdown");
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector(".nav-link");
        if (parentLink) parentLink.classList.add("active");
      }
    }
  });
}


/* ============================================================
   HEADER NAV — Dropdown: Desktop=Hover, Mobile=Click (Bootstrap)
   - Desktop (>=992px): mở bằng hover qua CSS, tắt data-bs-toggle.
   - Mobile  (<992px): thêm data-bs-toggle="dropdown" để mở bằng click.
   - Tự dọn trạng thái .show khi chuyển kích thước.
   - Ngăn nhảy trang khi href="#" ở desktop hover.
   ============================================================ */

(() => {
  const DESKTOP_MIN = 992;

  // Gắn/tắt hành vi click của Bootstrap cho mobile
  function applyDropdownMode() {
    const toggles = document.querySelectorAll('.navbar .dropdown-toggle');
    const isMobile = window.innerWidth < DESKTOP_MIN;

    toggles.forEach(t => {
      if (isMobile) {
        t.setAttribute('data-bs-toggle', 'dropdown');
        t.setAttribute('data-bs-auto-close', 'outside'); // click ngoài thì đóng
      } else {
        t.removeAttribute('data-bs-toggle');
        t.removeAttribute('data-bs-auto-close');

        // Nếu đang mở theo Bootstrap (do trước đó là mobile) → đóng lại
        const menu = t.parentElement && t.parentElement.querySelector('.dropdown-menu');
        if (menu && menu.classList.contains('show') && window.bootstrap) {
          const inst = bootstrap.Dropdown.getInstance(t) || new bootstrap.Dropdown(t);
          inst.hide();
          // đồng bộ aria
          t.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Chặn nhảy trang khi href="#" ở desktop (hover)
  function preventHashJumpOnDesktop(e) {
    const link = e.target.closest('.navbar .dropdown-toggle');
    if (!link) return;
    const isMobile = window.innerWidth < DESKTOP_MIN;

    // Ở desktop, nếu link là "#" thì không điều hướng (đã có hover)
    if (!isMobile && link.getAttribute('href') === '#') {
      e.preventDefault();
    }
  }

  // (Khuyên dùng) Đóng tất cả dropdown khi click link con trên mobile
  function closeOnItemClickMobile(e) {
    const item = e.target.closest('.dropdown-menu .dropdown-item');
    if (!item) return;
    const isMobile = window.innerWidth < DESKTOP_MIN;
    if (!isMobile) return;

    // tìm toggle cha gần nhất và đóng
    const parentDropdown = item.closest('.nav-item.dropdown');
    if (!parentDropdown) return;
    const toggle = parentDropdown.querySelector('.dropdown-toggle');
    if (toggle && window.bootstrap) {
      const inst = bootstrap.Dropdown.getInstance(toggle) || new bootstrap.Dropdown(toggle);
      inst.hide();
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Khởi tạo sau khi DOM sẵn sàng
  function init() {
    applyDropdownMode();

    // Debounce resize để đổi chế độ mượt
    let tmr;
    window.addEventListener('resize', () => {
      clearTimeout(tmr);
      tmr = setTimeout(applyDropdownMode, 150);
    });

    // Chặn nhảy trang cho href="#" khi dùng hover (desktop)
    document.addEventListener('click', preventHashJumpOnDesktop);

    // Đóng menu trên mobile khi chọn mục con
    document.addEventListener('click', closeOnItemClickMobile);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
