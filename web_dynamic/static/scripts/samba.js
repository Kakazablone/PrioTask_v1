class TaskScheduler {
    constructor() {
        this.modal = $('#schedule-modal');
        this.toggleTasksButton = $('#toggle-tasks');
        this.closeButton = $('.close');
        this.saveButton = $('#save-schedule');
        this.container = $('.container');
        this.bindEvents();
    }
  
    bindEvents() {
        const self = this;
  
        // Function to close modal
        this.closeButton.on('click', function () {
            self.closeModal(); // Call the closeModal function
        });
  
        $(document).on('click', function(event) {
            if ($(event.target).closest(self.modal).length === 0) {
                self.closeModal(); // Call the closeModal function
            }
        });
  
        // Function to open scheduling modal and blur content
        $(document).on('click', '.schedule-events', function () {
            // Get the modal associated with the clicked schedule button
            const modal = $(this).siblings('.modal');
            modal.css('display', 'block');
            self.container.addClass('blur'); // Add blur class
        });
  
        // Function to handle saving task and close modal
        this.saveButton.on('click', function () {
            const taskForm = $(this).closest('form'); // Get the form associated with the clicked button
            const taskTime = taskForm.find('#task-time').val();
            const taskDate = taskForm.find('#task-date').val();
  
            // Check if taskTime and taskDate are not empty
            if (taskTime && taskDate) {
                // Send POST request to Flask route to save task data
                $.post('/schedule_task/<task_id>', { 'task-time': taskTime, 'task-date': taskDate }, function(response) {
                    // Handle response if needed
                    console.log(response);
                });

                // Reset the form
                taskForm[0].reset();
  
                self.modal.css('display', 'none');
                self.container.removeClass('blur');
            } else {
                // Inform the user that both date and time need to be selected
                alert("Please select both date and time before saving.");
            }
        });
    }
  
    // Define the closeModal function
    closeModal() {
        this.modal.css('display', 'none');
        this.container.removeClass('blur');
    }
}

$(document).ready(function () {
    const taskScheduler = new TaskScheduler();
    const $taskList = $('#task-list ul');

    $(document).on("click", ".schedule-events", function() {
        // Open the schedule modal
        $("#scheduleModal").show();
    });

    $(document).on("click", ".edit-task", function() {
        const taskIdWithPrefix = $(this).closest("li").attr("id"); // Get the task id from the closest <li>
        const taskId = taskIdWithPrefix.substring("task-".length); // Remove the "task-" prefix
        $("#editModal").data("task-id", taskId); 
        $("#editModal").show();
    });
    
    // Close modal when close button is clicked
    $(document).on("click", ".close", function() {
        $(".modal").hide();
    });
    
    // Close modal when clicked outside of modal
    $(document).on("click", function(event) {
        if ($(event.target).is(".modal")) {
            // Hide the modal
            $(".modal").hide();
        }
    });
    
    // Handle update button click
    $("#updateButton").on("click", function() {
        const taskId = $("#editModal").data("task-id");
        const userId = $("body").data("user-id");
        const content = $("#editedContent").val(); 
    
        $.ajax({
            url: `http://127.0.0.1:5001/api/v1/users/${userId}/tasks/${taskId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ content: content }),
            success: function(data) {
                $('#editedContent').val('');
                fetchTasks(userId);
                console.log('Task updated:', data);
                $("#editModal").hide(); // Close the modal after successful update
                // You may want to update the UI with the updated task data here
            },
            error: function(xhr, status, error) {
                console.error('Error updating task:', error);
            }
        });
    });

    $(document).on('click', ".delete-task", function() {
        const task_id = $(this).data("task-id");
        const user_id = $('body').data('user-id');
        const url = "http://127.0.0.1:5001/api/v1/users/" + user_id + "/tasks/" + task_id;

        $.ajax({
            url: url,
            type: "DELETE",
            success: function(response) {
                // Remove the deleted task from the DOM
                $('#task-' + task_id).remove();
                
                // Fetch tasks again to update the task list
                fetchTasks(user_id);
                
                console.log("Task deleted successfully.");
            },
            error: function(xhr, status, error) {
                // Handle error response here
                console.error("Error deleting task:", error);
            }
        });
    });

    $('.tasks form').submit(function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Get user_id from body data attribute
        let userId = $('body').data('user-id');
        
        // Reference to the textarea field
        let $taskTextArea = $('textarea[name=task_name]');
        
        // Send POST request
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5001/api/v1/users/' + userId + '/tasks',
            contentType: 'application/json',
            data: JSON.stringify({ content: $taskTextArea.val() }),
            success: function(data) {
                // Handle success response here
                console.log('Success:', data);
                $('#success-message').fadeIn().delay(3000).fadeOut(); // Display for 3 seconds
                
                // Clear/reset the textarea
                $taskTextArea.val('');
                fetchTasks(userId);
                const $toggleTasksButton = $('#toggle-tasks');
                $toggleTasksButton.text('Hide Tasks');
            },
            error: function(xhr, status, error) {
                // Handle error here
                console.error('Error:', error);
            },
        });
    });
    
    $('#toggle-tasks').click(function() {
        // Get user_id from body data attribute
        const userId = $('body').data('user-id');
        
        // Call the function to fetch tasks when the button is clicked
        fetchTasks(userId);
    });
    
    function fetchTasks(userId) {
        // Send GET request
        $.ajax({
            type: 'GET',
            url: `http://127.0.0.1:5001/api/v1/users/${userId}/tasks`,
            success: function(data) {
                // Handle success response here
                console.log('Tasks:', data);
                const tasksArray = Object.values(data);
                displayTasks(tasksArray); // Function to display tasks
            },
            error: function(xhr, status, error) {
                // Handle error here
                console.error('Error:', error);
                if (xhr.status === 404) {
                    // Append message if status is 404
                    $taskList.empty();
                    $taskList.append('<p>No tasks available.</p>');
                }
            }
        });
    }
    
    function displayTasks(tasks) {
        // const $taskList = $('#task-list ul');
        $taskList.empty(); // Clear existing tasks
        
        if (tasks) {
            tasks.forEach(function(task) {
                const content = task.content;
                const taskItemHtml = `
                    <li id="task-${task.id}">
                        ${content}
                        <div class="button-group">
                            <button class="schedule-events btn" type="button">Schedule</button>
                            <button class="edit-task btn" type="button">Edit</button>
                            <button class="delete-task btn" type="button" data-task-id="${task.id}">Delete</button>
                           
                        </div>
                    </li>`;
                
                $taskList.append(taskItemHtml);
            });
        } else {
            $taskList.append('<p>No tasks available.</p>');
        }
        
        // Show the task list
        $('#task-list').show();
    }    
}); 
