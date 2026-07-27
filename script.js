// Get the input box, buttons, and list from the page
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasks = document.getElementById('totalTasks');
const deleteAllBtn = document.getElementById('deleteAllBtn');

// This array holds all our tasks. It resets if page is refreshed.
let tasks = [];

// This function draws the tasks on the screen every time something changes
function render() {
  taskList.innerHTML = ''; // remove old list first

  if (tasks.length === 0) {
    // if no tasks, show the "empty" message
    emptyState.style.display = 'flex';
    taskList.classList.remove('has-items');
  } else {
    // if tasks exist, hide the "empty" message
    emptyState.style.display = 'none';
    taskList.classList.add('has-items');

    // go through each task and make a list item for it
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' completed' : '');

      // checkbox + task text + delete button
      // data-index tells us which task this is
      li.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''} data-index="${index}" class="toggle-check">
        <span>${escapeHtml(task.text)}</span>
        <button class="remove-btn" data-index="${index}">DELETE</button>
      `;

      taskList.appendChild(li);
    });
  }

  // update the total task count text
  totalTasks.textContent = `Total Tasks: ${tasks.length}`;
}

// makes text safe to show, so no bad code can run if typed in
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// adds a new task when user types something and hits add
function addTask() {
  const value = taskInput.value.trim();
  if (value === '') return; // do nothing if input is empty

  tasks.push({ text: value, done: false });
  taskInput.value = ''; // clear the input box
  render();
  taskInput.focus(); // put cursor back in input box
}

// run addTask when Add button is clicked
addBtn.addEventListener('click', addTask);

// run addTask when Enter key is pressed
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// this listens for clicks anywhere inside the task list
// it checks if checkbox or delete button was clicked
taskList.addEventListener('click', (e) => {
  const index = e.target.getAttribute('data-index');
  if (index === null) return; // click was not on checkbox or delete button

  // if checkbox clicked, mark task done or not done
  if (e.target.classList.contains('toggle-check')) {
    tasks[index].done = e.target.checked;
    render();
  }

  // if delete button clicked, remove that task
  if (e.target.classList.contains('remove-btn')) {
    tasks.splice(index, 1);
    render();
  }
});

// delete all tasks when this button is clicked
deleteAllBtn.addEventListener('click', () => {
  if (tasks.length === 0) return; // nothing to delete
  tasks = [];
  render();
});

// draw the page for the first time when it loads
render();