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
      resetTimer();
      return;
    }
  }
  updateDisplay();
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


$(document).ready(function () {
  // Hide task input form initially
  $("#task-input-form").hide();

  // Show/hide task management buttons
  $("#tasks-button").click(function () {
    $(".task-management-buttons").toggle();
    $("#task-list").toggle();
  });

  // Show task input form when "Add" button is clicked
  $("#add-button").click(function () {
    $("#task-input-form").toggle();
  });

 // Edit Task Functionality
$(".edit-button").click(function() {
  // Show the task list
  $(".task-management-buttons").show();
  $("#task-list").show();
});

// Handling task selection for editing
$("#task-list").on("click", ".task-item", function() {
  var taskItem = $(this); // Get the task item
  var taskText = taskItem.text(); // Get the text of the selected task
  var inputField = $("<input type='text' class='edit-input'>"); // Create an input field
  var saveButton = $("<button class='save-button'>Save</button>"); // Create a Save button
  inputField.val(taskText); // Set its value to the task text
  taskItem.empty().append(inputField, saveButton); // Replace task text with input field and save button
  inputField.focus(); // Focus on the input field

  // Save button functionality
  saveButton.click(function() {
    var editedTask = inputField.val().trim(); // Get the edited task text
    if (editedTask !== "") {
      taskItem.text(editedTask); // Update the task text
    } else {
      taskItem.remove(); // Remove the task item if it's empty after editing
    }
  });

  // When the user finishes editing (presses Enter or clicks outside the input field)
  inputField.on("blur keypress", function(e) {
    if (e.type === "blur" || (e.type === "keypress" && e.which === 13)) { // Check if Enter key is pressed or input field loses focus
      saveButton.click(); // Click the Save button
    }
  });
});

// Delete Task Functionality
$(".delete-button").click(function() {
  // Show the task list
  $(".task-management-buttons").show();
  $("#task-list").show();

  // Create an input field for task selection
  var inputField = $("<input type='text' class='delete-input'>");
  inputField.attr("placeholder", "Enter task to delete...");
  
  // Append the input field to the task list
  $("#task-list").append(inputField);

  // When the user finishes deleting (presses Enter or clicks outside the input field)
  inputField.on("blur keypress", function(e) {
    if (e.type === "blur" || (e.type === "keypress" && e.which === 13)) { // Check if Enter key is pressed or input field loses focus
      var taskToDelete = inputField.val().trim(); // Get the task to delete
      if (taskToDelete !== "") {
        // Remove the task item from the task list
        $(".task-item:contains(" + taskToDelete + ")").remove();
      }
      // Hide the task list and input field after deleting task
      $(".task-management-buttons").hide();
      $("#task-list").hide();
      inputField.remove(); // Remove the input field
    }
  });

  // Focus on the input field
  inputField.focus();
});


  // Save task when "Save" button is clicked
  $("#save-task-button").click(function () {
    var task = $("#task-input").val();
    if (task.trim() !== "") {
      $("#task-list").append("<li class='task-item'>" + task + "</li>");
      $("#task-input").val(""); // Clear input field
      $("#task-input-form").hide(); // Hide input form after saving task
    }
  });

  // Function to display tasks in a list
  function displayTaskList() {
    $("#task-list").empty(); // Clear existing task list
    // Populate task list from existing tasks
    $(".task").each(function (index) {
      var taskText = $(this).text();
      var taskItem = $("<li class='task-item'>" + taskText + "</li>");
      taskItem.click(function () {
        var editedTask = prompt("Edit Task:", taskText); // Prompt user to edit task
        if (editedTask !== null && editedTask.trim() !== "") {
          $(this).text(editedTask); // Update task text
        }
      });
      $("#task-list").append(taskItem);
    });
  }
});
