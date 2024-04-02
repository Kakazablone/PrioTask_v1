let timerInterval;
let minutesRemaining = 25; // Initial value for countdown timer (25 minutes)
let secondsRemaining = 0;
let pomodoroTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;
let timerRunning = false;

$(document).ready(function () {
  let dataLoaded = false;
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
    $(this).next(".dropdown-content").fadeIn("slow");

    let user_id = $("#user_id").data("id");
    let $toggleTasksButton = $("#toggle-tasks");

    if ($toggleTasksButton.text() === "Hide Tasks") {
      // Hide the task list
      $("#task-list").fadeOut("slow");

      // Switch toggle tasks button back to "Show Tasks"
      $toggleTasksButton.text("Show Tasks");
    }

    // Check if data has already been loaded, if not, make AJAX request to fetch custom data
    if (!dataLoaded) {
      $.ajax({
        url: "/api/v1/users/" + user_id + "/custom",
        type: "GET",
        dataType: "json",
        success: function (customData) {
          console.log("Received custom data:", customData);

          // Check if customData is not null and not undefined
          if (customData !== null && customData !== undefined) {
            // Set dataLoaded flag to true to indicate data has been loaded
            dataLoaded = true;

            // Assuming customData is an object with properties
            $.each(customData, function (key, value) {
              let radioHtml =
                '<div class="check">' +
                "<label>" +
                '<input type="radio" name="time-option" data-pomodoro="' +
                value.pomodoro_value +
                '" data-short="' +
                value.short_value +
                '" data-long="' +
                value.long_value +
                '" value="' +
                value.name +
                '" data-custom-id="' +
                value.id +
                '">' +
                value.name +
                ' <span class="default">' +
                value.pomodoro_value +
                "min . " +
                value.short_value +
                "min . " +
                value.long_value +
                "min</span>" +
                '<input type="button" class="delete-custom" value="Delete" data-custom-id="' +
                value.id +
                '">' +
                "</label>" +
                "</div>";

              $("#customTimersContainer").append(radioHtml);
            });

            // Bind click event to dynamically created delete buttons
            $(".delete-custom").on("click", function () {
              let customId = $(this).data("custom-id");
              deleteCustom(customId);
            });
          } else {
            console.error("Custom data is null or undefined:", customData);
          }
        },
      });
    }
  });

  // Define deleteCustom function outside click event handler
  function deleteCustom(customId) {
    let user_id = $("#user_id").data("id");
    let selectedTimer = $(
      "input[type='radio'][data-custom-id='" + customId + "']"
    );
    let isSelected = selectedTimer.is(":checked");
    if (isSelected) {
      stopTimer();
            
    }

    // Send DELETE request to delete custom
    $.ajax({
      type: "DELETE",
      url:
        "/api/v1/users/" + user_id + "/custom/" + customId,
      success: function (response) {
        // Handle success response
        console.log("Custom timer deleted successfully:", response);

        // Remove the radio button from the DOM
        selectedTimer.parent().parent().remove();
        resetTimer();
      },
      error: function (error) {
        console.error("Error deleting custom timer:", error);
      },
    });
  }

  $("#saveCustom").click(function (event) {
    event.preventDefault(); // Prevent default form submission
    let user_id = $("#user_id").data("id");

    // Get form data
    let formData = {
      name: $("#name").val(),
      pomodoro_value: parseInt($("#pomodoro_value").val()),
      short_value: parseInt($("#short_value").val()),
      long_value: parseInt($("#long_value").val()),
    };
    console.log(formData);

    // Send POST request to save custom
    $.ajax({
      type: "POST",
      url: "/api/v1/users/" + user_id + "/custom",
      data: JSON.stringify(formData),
      contentType: "application/json",
      success: function (response) {
        // Handle success response
        console.log("Data saved successfully:", response);

        // Extract custom ID from the response
        let custom_id = response.id;

        // Send GET request to fetch specific custom using the obtained custom ID
        $.ajax({
          type: "GET",
          url:
            "/api/v1/users/" +
            user_id +
            "/custom/" +
            custom_id,
          dataType: "json",
          success: function (customData) {
            // Handle success response for fetching specific custom
            console.log("Fetched custom data:", customData);

            // Create radio button dynamically
            let radioHtml =
              '<div class="check">' +
              "<label>" +
              '<input type="radio" name="time-option" data-pomodoro="' +
              customData.pomodoro_value +
              '" data-short="' +
              customData.short_value +
              '" data-long="' +
              customData.long_value +
              '" value="' +
              customData.name +
              '" data-custom-id="' +
              custom_id +
              '">' + // Add data-custom-id attribute
              customData.name +
              ' <span class="default">' +
              customData.pomodoro_value +
              "min . " +
              customData.short_value +
              "min . " +
              customData.long_value +
              "min</span>" +
              '<input type="button" class="delete-custom" value="Delete" data-custom-id="' +
              custom_id +
              '">' +
              "</label>" +
              "</div>";

            $("#customTimersContainer").append(radioHtml);

            // Event listener for delete button
            $(".delete-custom").on("click", function () {
              let customId = $(this).data("custom-id");
              deleteCustom(customId);
            });

            function deleteCustom(customId) {
              let user_id = $("#user_id").data("id");
              let selectedTimer = $(
                "input[type='radio'][data-custom-id='" + customId + "']"
              );
              let isSelected = selectedTimer.is(":checked");

              if (isSelected) {
                stopTimer();                                            
                
              }

              // Send DELETE request to delete custom
              $.ajax({
                type: "DELETE",
                url:
                  "/api/v1/users/" +
                  user_id +
                  "/custom/" +
                  customId,
                success: function (response) {
                  // Handle success response
                  console.log("Custom timer deleted successfully:", response);

                  // Remove the radio button from the DOM
                  selectedTimer.parent().parent().remove();
                  resetTimer();
                },
                error: function (error) {
                  console.error("Error deleting custom timer:", error);
                },
              });
            }
          },
        });
      },
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

      if (timerRunning) {
        stopTimer();
      }

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
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".dropdown").length) {
      $(".dropdown-content").fadeOut("slow");
    }
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
      // Timer has reached 00:00
      clearInterval(timerInterval);
      timerRunning = false;
      resetTimer();
      // Play the alarm sound when it's 8 seconds before reaching 00:00
      if (secondsRemaining === 8) {
        playAlarmBefore();
      }
      // Play another alarm sound at exactly 00:00
      if (secondsRemaining === 0) {
        playAlarmAtZero();
      }
      return;
    }
  }
  updateDisplay();
}

function playAlarmBefore() {
  $("#alarmBeforeSound")[0].play();
}

function playAlarmAtZero() {
  $("#alarmAtZeroSound")[0].play();
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
