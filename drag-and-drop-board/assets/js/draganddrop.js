const form = document.querySelector('.drag-form');
const input = document.getElementById('drag-input');
const todoLine = document.getElementById('todo-line');
const progressLine = document.getElementById('progress-line');
const doneLine = document.getElementById('done-line');

const dragTasks = document.querySelectorAll('.drag-task');
const dragLines = document.querySelectorAll('.drag-line');

const dialog1 = document.getElementById("dialog-drag1");
const dialog1Input = document.getElementById("modal-drag1-input");
const dialog1InputId = document.getElementById("modal-drag1-id");
const dialog1CloseBtn = document.querySelector(".modal-drag1-close");
const dialog1Form = document.querySelector("#dialog-drag1 form");

const dialog2 = document.getElementById("dialog-drag2");
const dialog2InputId = document.getElementById("modal-drag2-id");
const dialog2CloseBtn = document.querySelector(".modal-drag2-close");
const dialog2DeleteBtn = document.querySelector(".modal-drag2-delete");
const dialog2Form = document.querySelector("#dialog-drag2 form");

const message1 = document.querySelector(".drag-message1");
const message2 = document.querySelector(".drag-message2");

// helper function: save tasks from a local storage
const setItemInLocalSorage = (nameOFList, elements) => {
    const tranElements = JSON.stringify(elements);
    localStorage.setItem(nameOFList, tranElements);
};

// helper function: get tasks from a local storage
const getItemsFromLocalSorage = (nameOFList) => {
    let elements = localStorage.getItem(nameOFList);

    if (elements) {
        elements = JSON.parse(localStorage.getItem(nameOFList));
    } else {
        elements = [];
    }

    return elements;
};

// helper function: delete the task from a local storage
const deleteTaskFromLocalStorage = (nameOFList, id) => {
    let storedToDoTasks = getItemsFromLocalSorage(nameOFList);

    const newStoredToDoTasks = storedToDoTasks.filter( task => task.id !== id );

    setItemInLocalSorage(nameOFList, newStoredToDoTasks);
};

// helper function: task date transformation
const showTransformedDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const d = new Date(date);
    const year = d.getFullYear();
    const month = months[d.getMonth()];
    const day = d.getDate();

    const tranDate = day + ' ' + month + ' ' + year;

    return tranDate;
};

// getting tasks from the local storage
const storedToDoTasks = getItemsFromLocalSorage("todoListOfTasks");

// creating a card for all tasks from the local storage
storedToDoTasks.forEach( (task) => {

    const newTask = document.createElement("div");
    newTask.classList.add('drag-task');
    newTask.setAttribute('draggable', 'true');
    newTask.id = task.id;

    const newTaskText = document.createElement("p");
    newTaskText.classList.add('drag-text');
    newTaskText.innerText = task.text;

    newTask.appendChild(newTaskText);

    const newTaskInfo = document.createElement("div");
    newTaskInfo.classList.add('drag-info');

    newTask.appendChild(newTaskInfo);

    const newTaskDate = document.createElement("p");
    newTaskDate.classList.add('drag-date');
    const transformedDate = showTransformedDate(task.date);
    newTaskDate.innerText = `created: ${transformedDate}`;

    newTaskInfo.appendChild(newTaskDate);

    const newTaskBtns = document.createElement("div");
    newTaskBtns.classList.add('drag-btns');

    newTaskInfo.appendChild(newTaskBtns);

    const newTaskEdit = document.createElement("button");
    newTaskEdit.classList.add('drag-edit');
    newTaskEdit.setAttribute('data-task-id', task.id);
    newTaskEdit.innerHTML = "&#9998;";

    const newTaskDelete = document.createElement("button");
    newTaskDelete.classList.add('drag-delete');
    newTaskDelete.setAttribute('data-task-id', task.id);
    newTaskDelete.innerHTML = "&#10006;";

    newTaskBtns.appendChild(newTaskEdit);
    newTaskBtns.appendChild(newTaskDelete);

    newTaskEdit.addEventListener('click', () => {
        dialog1.showModal();

        const elementWithText = document.querySelector(`#${task.id} .drag-text`);

        dialog1Input.value = elementWithText.innerText;
        dialog1InputId.value = task.id;
    });

    newTaskDelete.addEventListener('click', () => {
        dialog2.showModal();

        dialog2InputId.value = task.id;
    });

    newTask.addEventListener('dragstart', () => {
        newTask.classList.add('is-dragging');
    });

    newTask.addEventListener('dragend', () => {
        newTask.classList.remove('is-dragging');
    });

    if (task.status === "done-line") {

        doneLine.appendChild(newTask);
        newTask.classList.add("done-btns");

    } else if (task.status === "progress-line") {

        progressLine.appendChild(newTask);
        newTask.classList.add("progress-btns");

    } else if (task.status === "todo-line") {

        todoLine.appendChild(newTask);
    }
});

// adding drag events for all tasks
dragTasks.forEach( (task) => {
    task.addEventListener('dragstart', () => {
        task.classList.add('is-dragging');
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('is-dragging');
    });
});

// helper function for dragging tasks
const insertAboveTask = (line, mouseY) => {
    const els = line.querySelectorAll('.drag-task:not(.is-dragging)');

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach( (task) => {
        const {top} = task.getBoundingClientRect();

        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
};

// adding dragover events to to-do, in-progress, and done lists
dragLines.forEach((line) => {
    line.addEventListener('dragover', (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(line, e.clientY);
        const curentTask = document.querySelector('.is-dragging');

        let storedToDoTasks = getItemsFromLocalSorage("todoListOfTasks");

        const curentTaskID = curentTask.id;

        const indexOfCurentTask = storedToDoTasks.findIndex( (task) => task.id === curentTaskID);

        if (indexOfCurentTask < 0) {
            return;
        }

        if (line.id === "todo-line") {

            curentTask.classList.remove("progress-btns", "done-btns");

        } else if (line.id === "progress-line") {

            curentTask.classList.remove("done-btns");
            curentTask.classList.add("progress-btns");

        } else if (line.id === "done-line") {

            curentTask.classList.remove("progress-btns");
            curentTask.classList.add("done-btns");
        }

        if (!bottomTask) {
            line.appendChild(curentTask);
        } else {
            line.insertBefore(curentTask, bottomTask);
        }

        storedToDoTasks[indexOfCurentTask].status = line.id;

        setItemInLocalSorage("todoListOfTasks", storedToDoTasks);

    });
});

// adding a new task
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const value = input.value;

    const valueTrim = value.trim();

    let storedToDoTasks = getItemsFromLocalSorage("todoListOfTasks");

    if (storedToDoTasks.length >= 20) {
        input.value = "";
        message1.style.display = "none";
        message2.style.display = "block"; 
        message2.innerText = "* There can be a maximum of 20 tasks, delete some of the existing tasks.";
        return;
    }

    if (valueTrim.length < 4) {
        input.value = "";
        message1.style.display = "none";
        message2.style.display = "block"; 
        message2.innerText = "* The task must have more than 3 characters.";
        return;
    }

    if (valueTrim.length > 100) {
        input.value = "";
        message1.style.display = "none";
        message2.style.display = "block"; 
        message2.innerText = "* The task must be less than 100 characters.";
        return;
    }

    const d = new Date();
    const taskDate = d.getTime();
    const taskID = taskDate.toString(36) + Math.random().toString(36).substring(2, 12);

    const newTask = document.createElement("div");
    newTask.classList.add('drag-task');
    newTask.setAttribute('draggable', 'true');
    newTask.id = taskID;

    const newTaskText = document.createElement("p");
    newTaskText.classList.add('drag-text');
    newTaskText.innerText = value;

    newTask.appendChild(newTaskText);

    const newTaskInfo = document.createElement("div");
    newTaskInfo.classList.add('drag-info');

    newTask.appendChild(newTaskInfo);

    const newTaskDate = document.createElement("p");
    newTaskDate.classList.add('drag-date');
    const transformedDate = showTransformedDate(taskDate);
    newTaskDate.innerText = `created: ${transformedDate}`;

    newTaskInfo.appendChild(newTaskDate);

    const newTaskBtns = document.createElement("div");
    newTaskBtns.classList.add('drag-btns');

    newTaskInfo.appendChild(newTaskBtns);

    const newTaskEdit = document.createElement("button");
    newTaskEdit.classList.add('drag-edit');
    newTaskEdit.setAttribute('data-task-id', taskID);
    newTaskEdit.innerHTML = "&#9998;";

    const newTaskDelete = document.createElement("button");
    newTaskDelete.classList.add('drag-delete');
    newTaskDelete.setAttribute('data-task-id', taskID);
    newTaskDelete.innerHTML = "&#10006;";

    newTaskBtns.appendChild(newTaskEdit);
    newTaskBtns.appendChild(newTaskDelete);

    newTaskEdit.addEventListener('click', () => {
        dialog1.showModal();

        const elementWithText = document.querySelector(`#${taskID} .drag-text`);

        dialog1Input.value = elementWithText.innerText;
        dialog1InputId.value = taskID;
    });

    newTaskDelete.addEventListener('click', () => {
        dialog2.showModal();

        dialog2InputId.value = taskID;
    });

    newTask.addEventListener('dragstart', () => {
        newTask.classList.add('is-dragging');
    });

    newTask.addEventListener('dragend', () => {
        newTask.classList.remove('is-dragging');
    });

    todoLine.appendChild(newTask);

    storedToDoTasks.push({text:value, status: "todo-line", id: taskID, date: taskDate});

    setItemInLocalSorage("todoListOfTasks", storedToDoTasks);

    input.value = "";
});

// adding the input event to the input element
input.addEventListener('input', () => {

    if (input.value.length > 3) {
        message1.style.display = "block";
        message2.style.display = "none"; 
        message2.innerText = "";
    } 
});

// dialog1: close button
dialog1CloseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    dialog1.close();
});

// dialog1: edit button
dialog1Form.addEventListener('submit', (e) => {
    e.preventDefault();

    const editTaskText = dialog1Input.value;
    const editTaskId = dialog1InputId.value;

    let storedToDoTasks = getItemsFromLocalSorage("todoListOfTasks");

    const indexOfEditTask = storedToDoTasks.findIndex( (task) => task.id === editTaskId );

    if (indexOfEditTask < 0) {
        dialog1.close();
        return;
    }

    storedToDoTasks[indexOfEditTask].text = editTaskText;

    setItemInLocalSorage("todoListOfTasks", storedToDoTasks);

    const changeText = document.querySelector(`#${editTaskId} .drag-text`);

    changeText.innerText = editTaskText;

    dialog1.close();
});

// dialog2: close button
dialog2CloseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    dialog2.close();
});

// dialog2: delete button
dialog2DeleteBtn.addEventListener('click', (e) => {
    e.preventDefault;

    const deleteTaskId = dialog2InputId.value;

    const deleteTask = document.getElementById(deleteTaskId);

    deleteTask.parentElement.removeChild(deleteTask);

    deleteTaskFromLocalStorage("todoListOfTasks", deleteTaskId);

    dialog1.close();
});