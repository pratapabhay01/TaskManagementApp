const API_URL = "/api";


// Check Login
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}


// Load Tasks
async function loadTasks() {

    try {

        const response = await fetch(`${API_URL}/tasks`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }

        const tasks = await response.json();

        displayTasks(tasks);

    } catch (error) {

        document.getElementById("taskList").innerHTML =
            "<p>Unable to load tasks.</p>";
    }
}


// Display Tasks
function displayTasks(tasks) {

    const taskList = document.getElementById("taskList");

    if (tasks.length === 0) {

        taskList.innerHTML =
            "<p class='no-tasks'>No tasks found. Add your first task!</p>";

        return;
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";

        taskCard.innerHTML = `
            <div class="task-content">

                <h3>${task.title}</h3>

                <p>${task.description || "No description"}</p>

                <div class="task-info">

                    <span class="status">
                        ${task.status}
                    </span>

                    <span class="priority">
                        ${task.priority}
                    </span>

                    <span>
                        ${task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "No due date"}
                    </span>

                </div>

            </div>

            <div class="task-actions">

                <button onclick="editTask('${task._id}')">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task._id}')">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskCard);
    });
}


// Add Task
async function addTask() {

    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDescription").value;
    const status = document.getElementById("taskStatus").value;
    const priority = document.getElementById("taskPriority").value;
    const dueDate = document.getElementById("taskDueDate").value;

    if (!title) {
        alert("Please enter a task title.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/tasks`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                title,
                description,
                status,
                priority,
                dueDate
            })
        });

        const data = await response.json();

        if (response.ok) {

            alert("Task added successfully!");

            clearForm();

            loadTasks();

        } else {

            alert(data.message || "Failed to add task.");
        }

    } catch (error) {

        alert("Server error.");
    }
}


// Delete Task
async function deleteTask(taskId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Task deleted successfully!");

            loadTasks();

        } else {

            alert(data.message);
        }

    } catch (error) {

        alert("Server error.");
    }
}


// Edit Task
async function editTask(taskId) {

    const newTitle =
        prompt("Enter new task title:");

    if (!newTitle) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    title: newTitle,
                    description: "",
                    status: "In Progress",
                    priority: "Medium"
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Task updated successfully!");

            loadTasks();

        } else {

            alert(data.message);
        }

    } catch (error) {

        alert("Server error.");
    }
}


// Clear Form
function clearForm() {

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskStatus").value = "Pending";
    document.getElementById("taskPriority").value = "Medium";
    document.getElementById("taskDueDate").value = "";
}


// Logout
function logout() {

    localStorage.removeItem("token");

    window.location.href = "index.html";
}


// Load tasks when dashboard opens
loadTasks();
