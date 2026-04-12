// --- CONFIGURATION ---
const MODES = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

// --- STATE MACHINE ---
let currentMode = 'focus';
let timeRemaining = MODES.focus;
let timerInterval = null;
let isRunning = false;
let sessionCount = 0;

// --- DOM ELEMENTS ---
const el = {
    min: document.getElementById("minutes"),
    sec: document.getElementById("seconds"),
    prog: document.getElementById("progressBar"),
    container: document.getElementById("timerContainer"),
    tracker: document.getElementById("sessionTracker"),
    notify: document.getElementById("notifySound")
};

// --- CORE LOGIC ---
function updateUI() {
    // Format Time
    const m = Math.floor(timeRemaining / 60);
    const s = timeRemaining % 60;
    el.min.textContent = String(m).padStart(2, "0");
    el.sec.textContent = String(s).padStart(2, "0");

    // Calculate Progress smoothly
    const totalTime = MODES[currentMode];
    const percent = ((totalTime - timeRemaining) / totalTime) * 100;
    el.prog.style.width = `${percent}%`;
    
    // Update Session Tracker
    el.tracker.textContent = `Sessions: ${sessionCount}/4`;
}

function switchMode(newMode) {
    pauseTimer();
    currentMode = newMode;
    timeRemaining = MODES[newMode];

    // Update Tab UI visually
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${newMode.split('B')[0]}`).classList.add('active'); // Matches focus, short, long

    // Update Theme via classes
    el.container.className = `container theme-${newMode}`;
    
    updateUI();
}
// Add these two variables at the top of your app.js State Machine section
let totalHistoricalSessions = 0;
let totalHistoricalMinutes = 0;

function handleSessionEnd() {
    pauseTimer();
    el.notify.play(); 

    if (currentMode === 'focus') {
        sessionCount++;
        
        // --- NEW STATS LOGIC ---
        totalHistoricalSessions++;
        totalHistoricalMinutes += 25; // Adds 25 minutes to total
        document.getElementById("totalSessionsStat").textContent = totalHistoricalSessions;
        document.getElementById("totalMinutesStat").textContent = totalHistoricalMinutes;
        // -----------------------

        if (sessionCount % 4 === 0) {
            switchMode('long');
        } else {
            switchMode('short');
        }
    } else {
        switchMode('focus');
    }
    
    startTimer(); 
}
// --- TIMER CONTROLS ---
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) {
            handleSessionEnd();
            return;
        }
        timeRemaining--;
        updateUI();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    pauseTimer();
    timeRemaining = MODES[currentMode];
    updateUI();
}

// --- EVENT LISTENERS ---
document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

// --- MUSIC LOGIC ---
// --- AUDIO CONTROL MODULE ---
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volumeSlider");
const musicSelector = document.getElementById("musicSelector");

// Set initial volume to match the slider default (0.5)
bgMusic.volume = volumeSlider.value;

// 1. Play/Pause Toggle
musicBtn.addEventListener("click", () => {
    if (bgMusic.paused) { 
        bgMusic.play(); 
        musicBtn.textContent = "🔊"; 
    } else { 
        bgMusic.pause(); 
        musicBtn.textContent = "🎵"; 
    }
});

// 2. Volume Control
volumeSlider.addEventListener("input", (e) => {
    // e.target.value provides the current position of the slider (0 to 1)
    bgMusic.volume = e.target.value;
    
    // Auto-unmute visual cue if volume is raised from 0
    if (bgMusic.volume > 0 && !bgMusic.paused) {
        musicBtn.textContent = "🔊";
    }
});

// 3. Track Switching
musicSelector.addEventListener("change", (e) => {
    // Check if music is currently playing
    const wasPlaying = !bgMusic.paused;
    
    // Update the audio source
    bgMusic.src = e.target.value;
    
    // If it was playing, seamlessly start the new track
    if (wasPlaying) {
        bgMusic.play();
    }
});
// --- DRAG LOGIC 
// --- DRAG LOGIC (BULLETPROOF) ---
let isDragging = false;
let offsetX, offsetY;

el.container.addEventListener("mousedown", (e) => {
    // 1. Ignore if clicking the audio widget (so the slider works)
    if (e.target.closest('.audio-widget')) return;

    // 2. Ignore if clicking buttons, numbers, inputs, or dropdowns
    const ignoredTags = ['BUTTON', 'SPAN', 'INPUT', 'SELECT', 'OPTION'];
    if (ignoredTags.includes(e.target.tagName)) return;

    // 3. Otherwise, start dragging!
    isDragging = true;
    el.container.style.cursor = "grabbing"; // Visual feedback

    offsetX = e.clientX - el.container.offsetLeft;
    offsetY = e.clientY - el.container.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    // Move the container
    el.container.style.left = `${e.clientX - offsetX}px`;
    el.container.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    el.container.style.cursor = "grab";
});
// --- MODALS & NAV LOGIC ---
const fullscreenBtn = document.getElementById("fullscreenBtn");
const taskBtn = document.getElementById("taskBtn");
const statsBtn = document.getElementById("statsBtn");

const modalOverlay = document.getElementById("modalOverlay");
const taskModal = document.getElementById("taskModal");
const statsModal = document.getElementById("statsModal");

// Full Screen
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); } 
    else { if (document.exitFullscreen) document.exitFullscreen(); }
});

// Modal Controllers
function openModal(modalElement) {
    modalOverlay.classList.add("active");
    modalElement.classList.add("active");
}
function closeModals() {
    modalOverlay.classList.remove("active");
    taskModal.classList.remove("active");
    statsModal.classList.remove("active");
}
taskBtn.addEventListener("click", () => openModal(taskModal));
statsBtn.addEventListener("click", () => openModal(statsModal));

// --- TASK LOGIC ---
let tasks = [];
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return; // Prevent empty tasks
    
    tasks.push({ id: Date.now(), text: text, completed: false });
    taskInput.value = ""; // Clear input
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;
        li.innerHTML = `
            <div style="display:flex; gap:10px; align-items:center; cursor:pointer;" onclick="toggleTask(${task.id})">
                <input type="checkbox" ${task.completed ? "checked" : ""} style="pointer-events:none;">
                <span class="task-text">${task.text}</span>
            </div>
            <button onclick="deleteTask(${task.id})">✖</button>
        `;
        taskList.appendChild(li);
    });
}

// Allow pressing "Enter" to add a task
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

updateUI();