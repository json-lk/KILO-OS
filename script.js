// --- System Clock Engine ---
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Formats 0 to 12
    
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}

function launchApp(appName, contentHTML) {
    const desktop = document.getElementById('desktop');
    const template = document.getElementById('window-template');
    
    // Clone the template structure
    const windowClone = template.content.cloneNode(true);
    const windowElement = windowClone.querySelector('.window');
    
    // Customize the instance
    windowElement.querySelector('.window-title').textContent = appName;
    windowElement.querySelector('.window-body').innerHTML = contentHTML;
    
    // Set active state display style
    windowElement.style.display = 'flex';
    
    // Make the close button work for *this specific window*
    windowElement.querySelector('.close-btn').addEventListener('click', () => {
        windowElement.remove(); // Destroys the window from the DOM entirely
    });
    
    // Drop it onto the desktop
    desktop.appendChild(windowElement);
}

// Initial call and set intervals
setInterval(updateClock, 1000);
updateClock();

// --- Start Menu Controls ---
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');

if (startBtn && startMenu) {
    startBtn.addEventListener('click', (event) => {
        startMenu.classList.toggle('active');
        event.stopPropagation(); // Prevents immediate close from body listener
    });

    // Close the start menu when clicking on the open workspace desktop
    document.addEventListener('click', () => {
        startMenu.classList.remove('active');
    });
}

// --- Window Manager (Open/Close System Core App) ---
const coreAppIcon = document.getElementById('coreAppIcon');
const appWindow = document.getElementById('appWindow');
const closeWindowBtn = document.getElementById('closeWindowBtn');

if (coreAppIcon && appWindow && closeWindowBtn) {
    coreAppIcon.addEventListener('click', () => {
        appWindow.style.display = 'flex';
    });

    closeWindowBtn.addEventListener('click', () => {
        appWindow.style.display = 'none';
    });
}

// Launching a text terminal
coreAppIcon.addEventListener('click', () => {
    launchApp('Terminal', `<p class="cli-line">> Initializing console...</p>`);
});

// Launching a simple notes app
notesIcon.addEventListener('click', () => {
    launchApp('Notes', `<textarea style="width:100%; height:100%; background:none; color:#fff; border:none; resize:none; outline:none;"></textarea>`);
});

const AppRegistry = {
    terminal: {
        title: "System Terminal",
        content: `<div class="terminal-body"><p>> Type "help" to begin.</p></div>`
    },
    browser: {
        title: "Kilo Web Explorer",
        content: `<iframe src="https://example.com" style="width:100%; height:100%; border:none;"></iframe>`
    }
};

// Then call them dynamically by their key names:
function launchFromRegistry(appKey) {
    const app = AppRegistry[appKey];
    if (app) {
        launchApp(app.title, app.content);
    }
}