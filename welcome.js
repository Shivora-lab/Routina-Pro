document.addEventListener("DOMContentLoaded", function () {

  const savedName = localStorage.getItem("routina_username");

  if (savedName) {
    showReturnUser(savedName);
    initSlider();
  } else {
    document.getElementById("firstTimeBox").style.display = "block";
  }

});

/* Save First Time */
function saveName() {
  const name = document.getElementById("usernameInput").value.trim();
  if (!name) return;

  localStorage.setItem("routina_username", name);
  showReturnUser(name);
  initSlider();
}

/* Greeting Logic */
function showReturnUser(name) {
  document.getElementById("firstTimeBox").style.display = "none";
  document.getElementById("returnBox").style.display = "block";

  const hour = new Date().getHours();
  let greeting = "Good Morning";

  if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
  else if (hour >= 17 && hour < 22) greeting = "Good Evening";
  else if (hour >= 22 || hour < 5) greeting = "Still Grinding?";

  document.getElementById("greetLine").textContent = greeting + ",";
  document.getElementById("nameLine").textContent = name;
}

/* Slider Logic */
function initSlider() {
  const slider = document.getElementById("slider");
  const btn = document.getElementById("sliderBtn");
  const track = slider.querySelector(".slider-track");

  let isDown = false;
  let startX;

  btn.addEventListener("mousedown", start);
  btn.addEventListener("touchstart", start);

  document.addEventListener("mousemove", move);
  document.addEventListener("touchmove", move);

  document.addEventListener("mouseup", end);
  document.addEventListener("touchend", end);

  function start(e) {
    isDown = true;
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
  }

  function move(e) {
    if (!isDown) return;

    let x = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    let walk = x - startX;
    let max = slider.offsetWidth - btn.offsetWidth;

    if (walk < 0) walk = 0;
    if (walk > max) walk = max;

    btn.style.left = walk + "px";
    track.style.width = walk + btn.offsetWidth + "px";
  }

  function end() {
    if (!isDown) return;
    isDown = false;

    let max = slider.offsetWidth - btn.offsetWidth;

    if (parseInt(btn.style.left) >= max - 5) {
      document.querySelector(".card").style.opacity = "0";
      setTimeout(() => {
        window.location.href = "home.html";
      }, 400);
    } else {
      btn.style.left = "0px";
      track.style.width = "0px";
    }
  }
}

/* Profile */
function openProfile() {
  document.getElementById("profilePopup").style.display = "flex";
}
function closeProfile() {
  document.getElementById("profilePopup").style.display = "none";
}
function updateName() {
  const newName = document.getElementById("editNameInput").value.trim();
  if (!newName) return;
  localStorage.setItem("routina_username", newName);
  closeProfile();
  showReturnUser(newName);
}