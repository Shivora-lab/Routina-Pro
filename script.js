// This function runs as soon as any page loads
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // 1. Clear existing themes to prevent mixing
    document.body.classList.remove('dark-mode', 'bhuttu-mode');

    // 2. Add the correct class based on saved preference
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'bhuttu') {
        document.body.classList.add('bhuttu-mode');
    }
}

applySavedTheme();

// ===============================
// Data Storage
// ===============================

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let dailyData = JSON.parse(localStorage.getItem("dailyData")) || {};

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function saveDaily() {
  localStorage.setItem("dailyData", JSON.stringify(dailyData));
}

// ===============================
// Popup Controls
// ===============================

function openPopup() {
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function outsideClose(e) {
  if (e.target.id === "popup") {
    closePopup();
  }
}

// ===============================
// Add Habit
// ===============================

function addHabit() {
  const input = document.getElementById("popupInput");
  const name = input.value.trim();

  if (name === "") return;

  const newHabit = {
    id: Date.now(),
    name: name
  };

  habits.push(newHabit);
  saveHabits();

  input.value = "";
  closePopup();
  renderHabits();
}

// ===============================
// Delete Habit
// ===============================

function deleteHabit(id) {
  habits = habits.filter(habit => habit.id !== id);
  saveHabits();

  const today = new Date().toISOString().split("T")[0];
  if (dailyData[today]) {
    dailyData[today] = dailyData[today].filter(hId => hId !== id);
    saveDaily();
  }

  renderHabits();
}

// ===============================
// Toggle Complete
// ===============================

function toggleHabit(id) {
  const today = new Date().toISOString().split("T")[0];

  if (!dailyData[today]) dailyData[today] = [];

  if (dailyData[today].includes(id)) {
    dailyData[today] = dailyData[today].filter(hId => hId !== id);
  } else {
    dailyData[today].push(id);
  }

  saveDaily();
  renderHabits();
}

// ===============================
// Edit Habit (FIXED)
// ===============================

function editHabit(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  const habitItems = document.querySelectorAll(".habit-item");

  habitItems.forEach(item => {
    const editBtn = item.querySelector(".edit-btn");
    if (!editBtn) return;

    if (editBtn.getAttribute("onclick").includes(id)) {
      const nameSpan = item.querySelector(".habit-name");

      const input = document.createElement("input");
      input.type = "text";
      input.value = habit.name;
      input.className = "edit-input";

      nameSpan.replaceWith(input);
      input.focus();

      input.addEventListener("blur", function () {
        const newName = input.value.trim();
        if (newName !== "") {
          habit.name = newName;
          saveHabits();
        }
        renderHabits();
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          input.blur();
        }
      });
    }
  });
}

// ===============================
// Render Habits (FINAL VERSION)
// ===============================

function renderHabits() {
  const habitList = document.getElementById("habitList");
  const emptyState = document.getElementById("emptyState");
  const today = new Date().toISOString().split("T")[0];

  habitList.innerHTML = "";

  if (habits.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  habits.forEach(habit => {
    const div = document.createElement("div");
    div.className = "habit-item";

    const isDone = dailyData[today] && dailyData[today].includes(habit.id);
    if (isDone) div.classList.add("done");

    div.innerHTML = `
      <div class="habit-left">
        <button class="edit-btn" onclick="editHabit(${habit.id})">✏</button>
        <span class="habit-name">${habit.name}</span>
      </div>

      <div class="habit-right">
        <button class="done-btn" onclick="toggleHabit(${habit.id})">
       ${isDone ? "Undo" : "Done"}
      </button>
        <button class="delete-btn" onclick="deleteHabit(${habit.id})">🗑</button>
      </div>
    `;

    habitList.appendChild(div);
  });
  updateProgress();
}

// ===============================
// Progress Ring (FIXED - No Blink)
// ===============================

function updateProgress() {
  const today = new Date().toISOString().split("T")[0];
  const total = habits.length;

  const done = dailyData[today] ? dailyData[today].length : 0;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const circle = document.querySelector(".progress-ring");
  const text = document.querySelector(".progress-text");

  const circumference = 314;
  const offset = circumference - (circumference * percent) / 100;

  circle.style.strokeDashoffset = offset;
  text.textContent = percent + "%";
}

// ===============================
// Initial Load
// ===============================

renderHabits();