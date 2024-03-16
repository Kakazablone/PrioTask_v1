let timerInterval;
let minutesRemaining = 25; // Initial value for countdown timer (25 minutes)
let secondsRemaining = 0;

$(document).ready(function () {
  selectTimer(25); // Select "Pomodoro" on page load
});

function startTimer() {
  // Start the timer
  timerInterval = setInterval(updateTimer, 1000);
}

function pauseTimer() {
  // Pause the timer
  clearInterval(timerInterval);
}

function stopTimer() {
  // Stop the timer
  clearInterval(timerInterval);
  // Reset timer to initial value
  minutesRemaining = 25;
  secondsRemaining = 0;
  updateDisplay();
}

function updateTimer() {
  // Update timer countdown
  if (secondsRemaining > 0) {
    secondsRemaining--;
  } else {
    if (minutesRemaining > 0) {
      minutesRemaining--;
      secondsRemaining = 59;
    } else {
      // Timer has reached 0
      clearInterval(timerInterval);
      alert("Time's up!");
      return;
    }
  }
  updateDisplay();
}

function updateDisplay() {
  // Update displayed minutes and seconds
  let minutesElement = $("#minutes");
  let secondsElement = $("#seconds");
  minutesElement.text(formatTime(minutesRemaining));
  secondsElement.text(formatTime(secondsRemaining));
}

// Function to select timer duration
function selectTimer(minutes) {
  minutesRemaining = minutes;
  secondsRemaining = 0;
  updateDisplay();
}

function formatTime(time) {
  // Add leading zero if time is less than 10
  return time < 10 ? "0" + time : time;
}
