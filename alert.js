// This function runs as soon as any page loads
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
   } else if (savedTheme === 'bhuttu') {
        document.body.classList.add('bhuttu-mode');
    }
}

applySavedTheme();

// ==========================================
// ROUTINA PRO - FINAL STABLE ALERT SYSTEM
// ==========================================

const { LocalNotifications } = Capacitor.Plugins;
const CHANNEL_ID = "routina_channel";

let alerts = JSON.parse(localStorage.getItem("alerts")) || [];

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initialize Notifications & Permissions
    if (Capacitor.isNativePlatform()) {
        await LocalNotifications.requestPermissions();
        
        await LocalNotifications.createChannel({
            id: CHANNEL_ID,
            name: "Routina Alerts",
            description: "Daily routine reminders",
            importance: 5,
            visibility: 1,
            sound: 'beep.wav'
        });
    }

    // 2. Load the dropdown and existing list
    loadHabits();
    renderAlerts();
});

// ===============================
// SMART DATA LOADER
// ===============================
function loadHabits() {
    const select = document.getElementById("routineSelect");
    if (!select) return;

    // We check all possible keys your home.js might be using
    const rawData = localStorage.getItem("habits") || 
                    localStorage.getItem("routines") || 
                    localStorage.getItem("tasks");
    
    const habits = JSON.parse(rawData) || [];
    
    select.innerHTML = `<option value="">Choose your routine</option>`;

    if (habits.length === 0) {
        const opt = document.createElement("option");
        opt.textContent = "No routines found on Home";
        opt.disabled = true;
        select.appendChild(opt);
    } else {
        habits.forEach(habit => {
            // Handle both simple strings ("Ok") and objects ({name: "Ok"})
            const habitName = (typeof habit === 'object') ? (habit.name || habit.text) : habit;
            
            if (habitName) {
                const option = document.createElement("option");
                option.value = habitName;
                option.textContent = habitName;
                select.appendChild(option);
            }
        });
    }
}

// ===============================
// CREATE ALERT LOGIC
// ===============================
async function createAlert() {
    const routine = document.getElementById("routineSelect").value;
    const time = document.getElementById("timeInput").value;

    if (!routine || !time) {
        alert("Please select routine and time");
        return;
    }

    const alertId = Math.floor(Math.random() * 1000000);
    const [hour, minute] = time.split(":");
    
    const target = new Date();
    target.setHours(parseInt(hour));
    target.setMinutes(parseInt(minute));
    target.setSeconds(0);
    target.setMilliseconds(0);

    // If time passed, schedule for tomorrow
    if (target <= new Date()) {
        target.setDate(target.getDate() + 1);
    }

    try {
        // Schedule Native Notification
        await LocalNotifications.schedule({
            notifications: [
                {
                    id: alertId,
                    title: "Routina Pro 🔔",
                    body: "Time for " + routine,
                    channelId: CHANNEL_ID,
                    schedule: { at: target, allowWhileIdle: true }
                }
            ]
        });

        // Save to list
        alerts.push({ id: alertId, routine, time });
        localStorage.setItem("alerts", JSON.stringify(alerts));
        
        renderAlerts();
     showModal("Alert Set! 🔔", `Reminder for ${routine} at ${time} is active.`);
    } catch (error) {
        console.error("Scheduling error:", error);
        alert("Notification failed. Check Capacitor setup.");
    }
}

// ===============================
// DELETE & RENDER UI
// ===============================
async function deleteAlert(id) {
    await LocalNotifications.cancel({
        notifications: [{ id: id }]
    });

    alerts = alerts.filter(a => a.id !== id);
    localStorage.setItem("alerts", JSON.stringify(alerts));
    renderAlerts();
}

function renderAlerts() {
    const container = document.getElementById("alertList");
    if (!container) return;

    container.innerHTML = "";

    alerts.forEach(item => {
        const div = document.createElement("div");
        // We removed the hardcoded background:#fff so Bhuttu Mode can work!
        div.className = "alert-card"; 
        
        div.innerHTML = `
            <div>
                <b class="alert-routine-name">${item.routine}</b><br>
                <span class="alert-time-text">⏰ ${item.time}</span>
            </div>
            <button class="delete-btn" onclick="deleteAlert(${item.id})">Delete</button>
        `;
        container.appendChild(div);
    });
}
// ===============================
// CUSTOM MODAL LOGIC
// ===============================
function showModal(title, message) {
    const modal = document.getElementById('customAlert');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    if (modal && modalTitle && modalMessage) {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        modal.style.display = 'flex';
        
        // Optional: Add a subtle vibration when the modal pops up
        if (navigator.vibrate) {
            navigator.vibrate(50); 
        }
    }
}

function closeModal() {
    const modal = document.getElementById('customAlert');
    if (modal) {
        modal.style.display = 'none';
    }
}