// Function to apply theme on load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    document.body.classList.remove('dark-mode', 'bhuttu-mode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (savedTheme === 'bhuttu') {
        document.body.classList.add('bhuttu-mode');
    }
}
applySavedTheme();

const darkSwitch = document.getElementById('darkModeToggle');
const bhuttuSwitch = document.getElementById('bhuttuModeToggle');

// Dark Mode Toggle Logic
darkSwitch.addEventListener('change', () => {
    if (darkSwitch.checked) {
        bhuttuSwitch.checked = false; // Disable Bhuttu Switch
        document.body.classList.remove('bhuttu-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});

// Bhuttu Mode Toggle Logic
bhuttuSwitch.addEventListener('change', () => {
    if (bhuttuSwitch.checked) {
        darkSwitch.checked = false; // Disable Dark Switch
        document.body.classList.remove('dark-mode');
        document.body.classList.add('bhuttu-mode');
        localStorage.setItem('theme', 'bhuttu');
    } else {
        document.body.classList.remove('bhuttu-mode');
        localStorage.setItem('theme', 'light');
    }
});

// Keep switches synced with localStorage
if (localStorage.getItem('theme') === 'dark') {
    darkSwitch.checked = true;
} else if (localStorage.getItem('theme') === 'bhuttu') {
    bhuttuSwitch.checked = true;
}