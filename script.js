// Get the input box, buttons, and list from the page
var taskInput = document.getElementById('taskInput');
var addBtn = document.getElementById('addBtn');
var taskList = document.getElementById('taskList');
var emptyState = document.getElementById('emptyState');
var totalTasks = document.getElementById('totalTasks');
var deleteAllBtn = document.getElementById('deleteAllBtn');

// array to hold all tasks
var tasks = [];

// try to load saved tasks when page starts
try {
  var saved = localStorage.getItem("myTasks");
  if (saved != null) {
    tasks = JSON.parse(saved);
  }
} catch (e) {
  console.log("localStorage not available, starting empty");
}

// save tasks into localStorage
function saveTasks() {
  try {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
  } catch (e) {
    console.log("localStorage not available, could not save");
  }
}

// makes text safe to show, so no bad code can run if typed in
function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// draws all tasks on the screen
function render() {
  taskList.innerHTML = "";

  if (tasks.length == 0) {
    emptyState.style.display = "flex";
    taskList.classList.remove("has-items");
  } else {
    emptyState.style.display = "none";
    taskList.classList.add("has-items");

    for (var i = 0; i < tasks.length; i++) {
      var li = document.createElement("li");

      if (tasks[i].done == true) {
        li.className = "task-item completed";
      } else {
        li.className = "task-item";
      }

      var checkedText = "";
      if (tasks[i].done == true) {
        checkedText = "checked";
      }

      li.innerHTML =
        '<input type="checkbox" ' + checkedText + ' data-index="' + i + '" class="toggle-check">' +
        "<span>" + escapeHtml(tasks[i].text) + "</span>" +
        '<button class="remove-btn" data-index="' + i + '">DELETE</button>';

      taskList.appendChild(li);
    }
  }

  totalTasks.textContent = "Total Tasks: " + tasks.length;
}

// adds a new task
function addTask() {
  var value = taskInput.value.trim();
  if (value == "") {
    return;
  }

  var newTask = {};
  newTask.text = value;
  newTask.done = false;

  tasks.push(newTask);
  saveTasks();

  taskInput.value = "";
  render();
  taskInput.focus();
}

// click add button
addBtn.addEventListener("click", function () {
  addTask();
});

// press enter key inside input box
taskInput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    addTask();
  }
});

// clicking checkbox or delete button inside the list
taskList.addEventListener("click", function (e) {
  var index = e.target.getAttribute("data-index");
  if (index == null) {
    return;
  }
  index = parseInt(index);

  if (e.target.classList.contains("toggle-check")) {
    tasks[index].done = e.target.checked;
    saveTasks();
    render();
  }

  if (e.target.classList.contains("remove-btn")) {
    tasks.splice(index, 1);
    saveTasks();
    render();
  }
});

// delete all tasks button
deleteAllBtn.addEventListener("click", function () {
  if (tasks.length == 0) {
    return;
  }
  tasks = [];
  saveTasks();
  render();
});

// draw the page for the first time when it loads
render();