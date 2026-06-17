// Global tracking for Window layering depths
let topZIndex = 50;

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
setInterval(updateClock, 1000);
updateClock();

// --- Reusable Window Application Factory ---
function launchApp(appName, contentHTML) {
    const desktop = document.getElementById('desktop');
    const template = document.getElementById('window-template');
    if (!desktop || !template) return;
    
    // Clone template tree structure
    const windowClone = template.content.cloneNode(true);
    const windowElement = windowClone.querySelector('.window');
    
    // Configure window elements
    windowElement.querySelector('.window-title').textContent = appName;
    windowElement.querySelector('.window-body').innerHTML = contentHTML;
    
    // Push window depth to the foreground on initialization
    topZIndex++;
    windowElement.style.zindex = topZIndex;
    
    // Add Layering Focus Handler
    windowElement.addEventListener('mousedown', () => {
        topZIndex++;
        windowElement.style.zIndex = topZIndex;
    });

    // Close and tear down component
    windowElement.querySelector('.close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        windowElement.remove();
    });
    
    // Drop window instance onto desktop space
    desktop.appendChild(windowElement);
}

// --- Application Core Registries ---
const AppRegistry = {
    terminal: {
        title: "KiloCore Terminal",
        content: `
            <p class="cli-line">> KILO OS Kernel Initialized...</p>
            <p class="cli-line">> Status: Ready for integration.</p>
            <p class="cli-line" style="margin-top: 10px; color:#aaa">> Type "help" for a list of internal functions.</p>
        `
    },
    browser: {
        title: "Kilo Web Explorer",
        content: `<iframe src="https://example.com" style="width:100%; height:100%; border:none; background:#fff;"></iframe>`
    },
    trash: {
        title: "System Trash Bin",
        content: `<p style="color: rgba(255,255,255,0.4); text-align:center; margin-top:40px;">Trash folder is empty.</p>`
    }
};

function launchFromRegistry(appKey) {
    const app = AppRegistry[appKey];
    if (app) {
        launchApp(app.title, app.content);
    }
}

// --- Global Icon Listener Dynamic Mapper ---
document.querySelectorAll('icon[data-app]').forEach(iconElement => {
    iconElement.addEventListener('click', (e) => {
        e.stopPropagation();
        const appKey = iconElement.getAttribute('data-app');
        launchFromRegistry(appKey);
        
        // Auto-collapse start menu if an item was run inside it
        const startMenu = document.getElementById('startMenu');
        if (startMenu) startMenu.classList.remove('active');
    });
});

// --- Start Menu Controls ---
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');

if (startBtn && startMenu) {
    startBtn.addEventListener('click', (event) => {
        startMenu.classList.toggle('active');
        event.stopPropagation();
    });

    document.addEventListener('click', () => {
        startMenu.classList.remove('active');
    });
}