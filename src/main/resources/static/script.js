const API = "/tasks";

async function loadTasks() {

    const response = await fetch(API);
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    // Dashboard

    const completedTasks =
        tasks.filter(task => task.completed).length;

    document.getElementById("totalCount").textContent =
        tasks.length;

    document.getElementById("completedCount").textContent =
        completedTasks;

    document.getElementById("pendingCount").textContent =
        tasks.length - completedTasks;

    document.getElementById("streakCount").textContent =
        completedTasks;

    // Progress

    const progress =
        tasks.length === 0
            ? 0
            : (completedTasks / tasks.length) * 100;

    document.getElementById("progressBar")
        .style.width = progress + "%";

    // Search

    const searchValue =
        document.getElementById("search")
            .value
            .toLowerCase();

    const filteredTasks =
        tasks.filter(task =>
            task.title.toLowerCase()
                .includes(searchValue)
        );

    // Render Tasks

    filteredTasks.forEach(task => {

        let badgeClass = "low";

        if(task.priority === "HIGH"){
            badgeClass = "high";
        }
        else if(task.priority === "MEDIUM"){
            badgeClass = "medium";
        }

        const li = document.createElement("li");

        li.className = "task-card";

        li.innerHTML = `

            <div>

                <span class="priority ${badgeClass}">
                    ${task.priority ?? "LOW"}
                </span>

                <div class="task-title ${
            task.completed ? "completed" : ""
        }">

                    ${task.title}

                </div>

                <div class="task-meta">

                    📚 ${task.category || "General"}

                </div>

                <div class="task-meta">

                    📅 ${task.dueDate || "No Due Date"}

                </div>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(
                        ${task.id},
                        ${task.completed}
                    )">

                    ${
            task.completed
                ? "Undo"
                : "Done"
        }

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    Delete

                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

// Add Task

async function addTask() {

    const title =
        document.getElementById("taskInput")
            .value
            .trim();

    if(title === ""){
        alert("Enter Task");
        return;
    }

    const priority =
        document.getElementById("priority")
            .value;

    const category =
        document.getElementById("category")
            .value;

    const dueDate =
        document.getElementById("dueDate")
            .value;

    await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            title: title,

            completed: false,

            priority: priority,

            category: category,

            dueDate: dueDate
        })
    });

    document.getElementById("taskInput")
        .value = "";

    document.getElementById("category")
        .value = "";

    document.getElementById("dueDate")
        .value = "";

    loadTasks();
}

// Delete

async function deleteTask(id) {

    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

// Toggle Complete

async function toggleTask(id, completed) {

    const response =
        await fetch(API);

    const tasks =
        await response.json();

    const task =
        tasks.find(t => t.id === id);

    if(!task) return;

    await fetch(`${API}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            title: task.title,

            completed: !completed,

            priority: task.priority,

            category: task.category,

            dueDate: task.dueDate
        })
    });

    loadTasks();
}

// CSV Export

async function exportCSV() {

    const response =
        await fetch(API);

    const tasks =
        await response.json();

    let csv =
        "Title,Completed,Priority,Category,DueDate\n";

    tasks.forEach(task => {

        csv +=
            `"${task.title}",` +
            `"${task.completed}",` +
            `"${task.priority}",` +
            `"${task.category}",` +
            `"${task.dueDate}"\n`;
    });

    const blob =
        new Blob(
            [csv],
            {type:"text/csv"}
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "student_tasks.csv";

    a.click();

    URL.revokeObjectURL(url);
}

// Enter Key

document
    .getElementById("taskInput")
    .addEventListener("keypress", e => {

        if(e.key === "Enter"){
            addTask();
        }
    });

// Dark Mode

const toggleBtn =
    document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {

    document.body.classList
        .toggle("dark");

    if(
        document.body.classList
            .contains("dark")
    ){
        toggleBtn.innerText =
            "☀️ Light Mode";
    }
    else{
        toggleBtn.innerText =
            "🌙 Dark Mode";
    }
});

// Initial Load

loadTasks();