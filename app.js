
const ValueTask = document.querySelector('[data-value-task]');
const addTask = document.querySelector('[data-add-task]');
const collection = document.querySelector('[data-collection]');
const editModal = document.querySelector('[data-edit-modal]');
const inputEdit = document.querySelector('[data-edit-task]');
const saveEditTask = document.querySelector('[data-save-edit-task]');
const clearAll = document.querySelector('[data-clear-all]');
const filterTask = document.querySelector('[data-filter-task]');
let tasks = JSON.parse(localStorage.getItem('tasks'));
addTask.addEventListener('click' , function(e) {
    e.preventDefault();
    const value = ValueTask.value;
    if (value) {
        storeTaskInLocaleStorage(value);
        ValueTask.value = '';
        filterTask.value = '';
    } else {
        alert('повина бути мінімум 1-на літера');
    }

})

// SET DATA IN LOCALSTORAGE
function storeTaskInLocaleStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (Array.isArray(tasks)) {
        tasks.push({task, id: new Date().getTime()});
    } else {
        tasks = [];
        tasks.push({task, id: new Date().getTime()});
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks)
}

// RENDER TASKS
if (tasks !== null) {
    renderTasks(tasks);
}
function renderTasks(tasks) {
    const getTasks = JSON.parse(localStorage.getItem('tasks'));
    collection.innerHTML = '';
    tasks.map(item => {
        return collection.innerHTML += `<li id="${item.id}">${item.task} <span><span class="remove-task">remove</span><span class="edit-task">Change</span></span></li>`;
    });
}
// SAVE TASK
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const getTasks = JSON.parse(localStorage.getItem('tasks'));
    renderTasks(getTasks);
}

//remove task
window.addEventListener('click' , function(event) {
    //remove
    if (event.target.classList.contains('remove-task')) {
        const taskID = event.target.closest('li').id;
        removeTask(taskID)
    }
    if (event.target.classList.contains('edit-task')) {
        const taskID = event.target.closest('li').id;
        editTask(taskID);
    }
})
function removeTask(id) {
    const getAllTasks = JSON.parse(localStorage.getItem('tasks'));
    const removed = getAllTasks.filter(item => item.id !== Number(id));
    saveTasks(removed);
}

// EDIT TASK
function showModalEditTask() {
    editModal.classList.add('open');
}
function closeModal() {
    editModal.classList.remove('open');
}

function editTask(id) {
    showModalEditTask();
    const getAllTasks = JSON.parse(localStorage.getItem('tasks'));
    const edit = getAllTasks.find(item => item.id === Number(id));
    inputEdit.value=edit.task;
    inputEdit.id=edit.id;
}


// Save After Edit Task

saveEditTask.addEventListener('click' , saveAfterEditTask);
function saveAfterEditTask() {
    const getAllTasks = JSON.parse(localStorage.getItem('tasks'));
    const id = inputEdit.id
    const valueEdit = inputEdit.value;

    if (valueEdit.length > 0) {
        const newState = getAllTasks.map(obj =>obj.id === Number(id) ? { ...obj, task: valueEdit } : obj);
        saveTasks(newState);
        closeModal();
        filterTask.value = '';
        ValueTask.value = '';

    } else {
        alert('повина бути мінімум 1-на літера');
    }


}

// clearAll
clearAll.addEventListener('click' , clearAllTasks);
function clearAllTasks() {
    localStorage.setItem('tasks', '[]');
    collection.innerHTML = '';
    filterTask.value = '';
    ValueTask.value = '';
}

// find task
filterTask.addEventListener('input' , findTasks);
function findTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks !== null) {
        if (this.value.length > 0) {
            const newState = tasks.filter(item => item.task.includes(this.value) === true);
            renderTasks(newState)
            newState.length === 0 ? collection.innerHTML = 'Завдань не знайдено' : null ;
        } else {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            renderTasks(tasks)
        }
    }
}