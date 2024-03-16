let timerInterval;
let minutesRemaining = 25; // Initial value for countdown timer (25 minutes)
let secondsRemaining = 0;
let timerRunning = false;

$(document).ready(function () {
  selectTimer(25); // Select "Pomodoro" on page load
    $("#pomodoro").click(function () {
      setTimeout(() => {
        stopTimer(); // Stop the timer before switching
        selectTimer(25);
        $(this).addClass("selected");
        $("#shortbreak, #longbreak").removeClass("selected");
        $("body, html").css("background-color", "");
      }, 50);
    });

    $("#shortbreak").click(function () {
      setTimeout(() => {
        stopTimer(); // Stop the timer before switching
        selectTimer(5);
        $(this).addClass("selected");
        $("#pomodoro, #longbreak").removeClass("selected");
        $("body, html").css("background-color", "#987C7D");
      }, 50);
    });

    $("#longbreak").click(function () {
      setTimeout(() => {
        stopTimer(); // Stop the timer before switching
        selectTimer(15);
        $(this).addClass("selected");
        $("#pomodoro, #shortbreak").removeClass("selected");
        $("body, html").css("background-color", "#5A666E");
      }, 50);
    });
    $("#start").click(function () {
      if (!timerRunning) {
        startTimer();
        timerRunning = true;
      }
    });

    $("#pause").click(function () {
      if (timerRunning) {
        pauseTimer();
        timerRunning = false;
      }
    });

    $("#stop").click(function () {
      stopTimer();
      timerRunning = false;
    });
});

function startTimer() {
  // Start the timer
  timerInterval = setInterval(updateTimer, 1000);
  timerRunning = true;
}

function pauseTimer() {
  // Pause the timer
  clearInterval(timerInterval);
  timerRunning = false;
}

function stopTimer() {
  // Stop the timer
  clearInterval(timerInterval);
  timerRunning = false;
  // Reset timer to initial value
  if ($("#pomodoro").hasClass("selected")) {
    selectTimer(25);
  } else if ($("#shortbreak").hasClass("selected")) {
    selectTimer(5);
  } else if ($("#longbreak").hasClass("selected")) {
    selectTimer(15);
  }
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
      timerRunning = false;
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
