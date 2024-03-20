let timerInterval;
let minutesRemaining = 25; // Initial value for countdown timer (25 minutes)
let secondsRemaining = 0;
let pomodoroTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;
let timerRunning = false;

$(document).ready(function () {
  loadCustomTimers();

  selectTimer(25); // Select "Pomodoro" on page load
  $("#pomodoro").click(function () {
    setTimeout(() => {
      stopTimer(); // Stop the timer before switching
      selectTimer(pomodoroTime);
      $(this).addClass("selected");
      $("#shortbreak, #longbreak").removeClass("selected");
      $("body, html").css("background-color", "");
    }, 50);
  });


  $("#shortbreak").click(function () {
    setTimeout(() => {
      stopTimer(); // Stop the timer before switching
      selectTimer(shortBreakTime);
      $(this).addClass("selected");
      $("#pomodoro, #longbreak").removeClass("selected");
      $("body, html").css("background-color", "#987C7D");
    }, 50);
  });

    $("#longbreak").click(function () {
      setTimeout(() => {
        stopTimer(); // Stop the timer before switching
        selectTimer(longBreakTime);
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
  $(".dropdown-btn").click(function () {
    $(this).next(".dropdown-content").toggle();
  });
  

  // Event listener for custom timer form submission
  $("#saveCustom").click(function (event) {
  event.preventDefault();
  
  let formData = $("#customTimerForm").serialize();
  
  $.post("/custom_timer", formData, function (response) {
    console.log("Data saved successfully:", response);      
    
    // Dynamically add a radio button to the dropdown
    let timer = response.timer;
    let radioHtml =
      '<div class="check"><label><input type="radio" name="time-option" data-pomodoro="' +
      timer.pomodoro_value +
      '" data-short="' +
      timer.short_value +
      '" data-long="' +
      timer.long_value +
      '" value="' +
      timer.name +
      '"> ' +
      timer.name +
      ' <span class="default">' +
      timer.pomodoro_value +
      "min . " +
      timer.short_value +
      "min . " +
      timer.long_value +
      "min</span></label></div>";
                   
    $("#customTimersContainer").append(radioHtml);
    saveCustomTimers();
  });
});
$(document).on(
  "click",
  '#customTimersContainer input[type="radio"]',
  function () {
    let pomodoro = parseInt($(this).data("pomodoro"));
    let short = parseInt($(this).data("short"));
    let long = parseInt($(this).data("long"));

    pomodoroTime = pomodoro;
    shortBreakTime = short;
    longBreakTime = long;

    // Check which timer option is currently selected
    if ($("#pomodoro").hasClass("selected")) {
      selectTimer(pomodoro);
    } else if ($("#shortbreak").hasClass("selected")) {
      selectTimer(short);
    } else if ($("#longbreak").hasClass("selected")) {
      selectTimer(long);
    }
  }
);
function loadCustomTimers() {
  let customTimers = JSON.parse(localStorage.getItem("customTimers")) || [];
  customTimers.forEach(function (timer) {
    let radioHtml =
      '<div class="check"><label><input type="radio" name="time-option" data-pomodoro="' +
      timer.pomodoro_value +
      '" data-short="' +
      timer.short_value +
      '" data-long="' +
      timer.long_value +
      '" value="' +
      timer.name +
      '"> ' +
      timer.name +
      ' <span class="default">' +
      timer.pomodoro_value +
      "min . " +
      timer.short_value +
      "min . " +
      timer.long_value +
      "min</span></label></div>";
    $("#customTimersContainer").append(radioHtml);
  });
}

// Function to save custom timers to local storage
function saveCustomTimers() {
  let customTimers = [];
  $("#customTimersContainer input[type='radio']").each(function () {
    let timer = {
      name: $(this).val(),
      pomodoro_value: $(this).data("pomodoro"),
      short_value: $(this).data("short"),
      long_value: $(this).data("long"),
    };
    customTimers.push(timer);
  });
  localStorage.setItem("customTimers", JSON.stringify(customTimers));
}

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
      resetTimer();
      return;
    }
  }
  updateDisplay(minutesRemaining, secondsRemaining);
}
function resetTimer() {
    // Reset timer to initial value
    if ($("#pomodoro").hasClass("selected")) {
        selectTimer(25);
    } else if ($("#shortbreak").hasClass("selected")) {
        selectTimer(5);
    } else if ($("#longbreak").hasClass("selected")) {
        selectTimer(15);
    }
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


