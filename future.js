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