// Select elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
let editMode = false;
let taskToEdit = null;

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task event
addTaskBtn.addEventListener('click', function() {
    if (editMode) {
        // Update the task if we are in edit mode
        updateTask();
    } else {
        // Add new task
        addTask();
    }
});

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === "") return;

    const taskItem = createTaskElement(taskText);

    // Add task to localStorage
    saveTaskToLocalStorage(taskText);

    taskList.appendChild(taskItem);
    taskInput.value = '';
}

// Create a new task element
function createTaskElement(taskText, completed = false) {
    const taskItem = document.createElement('li');
    taskItem.textContent = taskText;

    if (completed) {
        taskItem.classList.add('completed');
    }

    // Mark as complete
    taskItem.addEventListener('click', function() {
        taskItem.classList.toggle('completed');
        updateTaskStatusInLocalStorage(taskText, taskItem.classList.contains('completed'));
    });

    // Add edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', function() {
        enterEditMode(taskItem, taskText);
    });

    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        taskList.removeChild(taskItem);
        removeTaskFromLocalStorage(taskText);
    });

    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);
    return taskItem;
}

// Save task to localStorage
function saveTaskToLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        taskList.appendChild(taskItem);
    });
}

// Get tasks from localStorage
function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task status in localStorage
function updateTaskStatusInLocalStorage(taskText, completed) {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        if (task.text === taskText) {
            task.completed = completed;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Enter edit mode for a task
function enterEditMode(taskItem, taskText) {
    taskInput.value = taskText;
    editMode = true;
    taskToEdit = taskItem;
    addTaskBtn.textContent = 'Update Task';
}

// Update task after editing
function updateTask() {
    const newTaskText = taskInput.value.trim();

    if (newTaskText === "") return;

    // Update task text in the UI
    taskToEdit.childNodes[0].textContent = newTaskText;

    // Update task in localStorage
    updateTaskInLocalStorage(taskToEdit.childNodes[0].textContent, newTaskText);

    // Reset form
    taskInput.value = '';
    editMode = false;
    taskToEdit = null;
    addTaskBtn.textContent = 'Add Task';
}

// Update task in localStorage
function updateTaskInLocalStorage(oldTaskText, newTaskText) {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        if (task.text === oldTaskText) {
            task.text = newTaskText;
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
