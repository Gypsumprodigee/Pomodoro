const circle = document.querySelector(".container");

let isDragging = false;
let offsetX, offsetY;

circle.addEventListener("mousedown", (e) => {
    isDragging = true;

    offsetX = e.clientX - circle.offsetLeft;
    offsetY = e.clientY - circle.offsetTop;

    circle.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    circle.style.left = `${e.clientX - offsetX}px`;
    circle.style.top = `${e.clientY - offsetY}px`;

    circle.style.transform = "none";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    circle.style.cursor = "grab";
});
let minutes = 25;
let seconds = 0;

let timer;
let isRunning = false;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");


// Update Timer Display
function updateDisplay() {
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
}


// Start Timer
function startTimer() {
    if (isRunning) return;

    isRunning = true;

    timer = setInterval(() => {

        if (seconds === 0) {

            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                alert("Pomodoro Complete!");
                return;
            }

            minutes--;
            seconds = 59;

        } else {
            seconds--;
        }

        updateDisplay();

    }, 1000);
}


// Pause Timer
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}


// Reset Timer
function resetTimer() {
    clearInterval(timer);

    minutes = 25;
    seconds = 0;

    isRunning = false;

    updateDisplay();
}


// Button Event Listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);


// Initial Display
updateDisplay();
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

let isPlaying = false;

musicBtn.addEventListener("click", () => {

    if (!isPlaying) {
        bgMusic.play();
        musicBtn.innerHTML = "🔊";
        isPlaying = true;
    } 
    else {
        bgMusic.pause();
        musicBtn.innerHTML = "🎵";
        isPlaying = false;
    }

});