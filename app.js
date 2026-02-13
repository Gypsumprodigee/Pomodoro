const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");

let timeLeft = 1500; // 25 minutes
let interval;

const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.innerHTML =
        `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
};

const startTimer = () => {
    if (interval) return; // prevent multiple timers

    interval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft === 0) {
            clearInterval(interval);
            interval = null;

            alert("Quest Complete ⚔️");

            timeLeft = 1500;
            updateTimer();
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(interval);
    interval = null;
};

const resetTimer = () => {
    clearInterval(interval);
    interval = null;

    timeLeft = 1500;
    updateTimer();
};

start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

updateTimer(); // initialize display
