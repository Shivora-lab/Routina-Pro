// This function runs as soon as any page loads
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // 1. Remove all modes first to ensure a clean switch
    document.body.classList.remove('dark-mode', 'bhuttu-mode');

    // 2. Apply based on memory
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'bhuttu') {
        document.body.classList.add('bhuttu-mode');
    }
}

applySavedTheme();

// --- YOUR ORIGINAL LOGIC STARTS HERE (UNTOUCHED) ---

let counterData = JSON.parse(localStorage.getItem("counterData")) || [];

function saveToStorage() {
    localStorage.setItem("counterData", JSON.stringify(counterData));
}

// Add a new task group
function addNewTask() {
    const input = document.getElementById("taskInput");
    const taskName = input.value.trim();

    if (taskName === "") return;

    const newGroup = {
        id: Date.now(),
        displayName: taskName + " Task",
        logs: []
    };

    counterData.push(newGroup);
    input.value = "";
    saveToStorage();
    renderAll();
}

// Handle the Count button click
function handleCount() {
    if (counterData.length === 0) {
        alert("Please add a task first!");
        return;
    }

    const selector = document.getElementById("taskSelector");
    const selectedIndex = selector.selectedIndex;
    const task = counterData[selectedIndex];

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const logEntry = `${task.displayName} done ${timeString}`;
    task.logs.push(logEntry);

    saveToStorage();
    renderAll();
}

// Delete a specific group
function deleteGroup(id) {
    counterData = counterData.filter(item => item.id !== id);
    saveToStorage();
    renderAll();
}

// Reset All button (Deletes everything)
function resetAll() {
    if (confirm("This will delete all your created groups and empty the list. Continue?")) {
        counterData = [];
        saveToStorage();
        renderAll();
    }
}

// Render the selector and the groups
function renderAll() {
    const container = document.getElementById("groupContainer");
    const selector = document.getElementById("taskSelector");
    const selectorArea = document.getElementById("selectorArea");

    container.innerHTML = "";
    selector.innerHTML = "";

    if (counterData.length === 0) {
        selectorArea.style.display = "none";
        return;
    }

    selectorArea.style.display = "block";

    counterData.forEach((group, index) => {
        // Update Selector
        const option = document.createElement("option");
        option.value = index;
        option.textContent = group.displayName;
        selector.appendChild(option);

        // Create Group Card
        const card = document.createElement("div");
        card.className = "task-group";
        
        let logsHtml = group.logs.map(log => `<div class="log-item">${log}</div>`).join('');
        
        card.innerHTML = `
            <div class="group-header">
                <span>${group.displayName}</span>
                <button class="delete-btn" onclick="deleteGroup(${group.id})">✕</button>
            </div>
            <div class="logs-list">
                ${logsHtml || '<span style="font-size:12px; color:#999;">No counts yet today.</span>'}
            </div>
        `;
        container.appendChild(card);
    });
}

// Auto Reset Logs at 00:01 AM
function checkAutoReset() {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 1) {
        counterData.forEach(group => group.logs = []);
        saveToStorage();
        renderAll();
    }
}

// Check for reset every minute
setInterval(checkAutoReset, 60000);

// Initial Load
renderAll();