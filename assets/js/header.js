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
      host.innerHTML = html;
      setupUserMenu(); // chỉ gọi sau khi header render xong
    })
    .catch(err => console.error("Lỗi khi load header:", err));
}

function getAuth() {
  if (localStorage.getItem("loggedIn") === "true") {
    return { store: localStorage, username: localStorage.getItem("username") };
  }
  if (sessionStorage.getItem("loggedIn") === "true") {
    return { store: sessionStorage, username: sessionStorage.getItem("username") };
  }
  return null;
}

function setupUserMenu() {
  const loginBtn = document.getElementById("login-btn");
  const userBox  = document.getElementById("user-menu");
  const auth = getAuth();

  if (auth?.username) {
    // đã đăng nhập
    loginBtn?.classList.add("d-none");
    userBox?.classList.remove("d-none");

    // 🔹 GẮN TÊN & AVATAR (chỉ target trong anchor #userMenu)
    const nameSpan = document.querySelector("#userMenu .user-name");
    if (nameSpan) nameSpan.textContent = auth.username;

    const avatar = document.querySelector("#userMenu .user-avatar");
    if (avatar) avatar.textContent = auth.username[0].toUpperCase();

    // (tuỳ chọn) gán số thông báo demo
    const bellBadge = document.querySelector(".icon-btn .badge#bell-badge");
    const chatBadge = document.querySelector(".icon-btn .badge#chat-badge");
    if (bellBadge) bellBadge.textContent = "3";
    if (chatBadge) chatBadge.textContent = "2";
  } else {
    // chưa đăng nhập
    userBox?.classList.add("d-none");
    loginBtn?.classList.remove("d-none");
  }

  // Đăng xuất
  document.getElementById("logout-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("username");
    window.location.href = "login.html";
  });

  // Nếu đang ở trang login → xử lý form
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
