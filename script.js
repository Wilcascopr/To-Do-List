// Saves the tasks objects with an unique id
const ToDoList = new Map;
// Container of the task in the HTML
const tasks_container = document.querySelector('.tasks_cont');
// Form used to add tasks
const myform = document.querySelector('.myform');

//task object

class Task {

    //task instances, name of the task, task to complete, deadline, completed task boolean and a unique map id

    constructor(name, task, deadline, completed, mapid) {
        this.task_name = name;
        this.task = task;
        this.deadline = deadline;
        this.id = name;
        this.mapid = mapid;
        this.fields = [];
        this.container = document.createElement('div');
        this.remove = document.createElement('button');
        this.completedbox = document.createElement('input');
        this.completedbox.setAttribute('type', 'checkbox');
        this.completedbox.checked = completed;
    }

    //creates the container of each task

    setContainer() {
        const temp_cont = document.createElement('div');
        temp_cont.setAttribute('class', 'in-line-op')
        this.remove.setAttribute('onClick', 'removeTaskfromList(this)')
        this.remove.innerHTML = 'Remove';
        this.remove.setAttribute('class', `${this.mapid}`)
        this.completedbox.setAttribute('id', `${this.mapid}`);
        this.completedbox.setAttribute('class', 'check');
        this.completedbox.setAttribute('onClick', 'Completed(this)');
        this.container.setAttribute('id', `${this.id.toLowerCase()}`);
        this.container.setAttribute('class', 'task-container');
        this.fields[0] = document.createElement('div');
        this.fields[1] = document.createElement('div');
        this.fields[2] = document.createElement('div');
        this.fields[0].setAttribute('class', 'task-name')
        this.fields[1].setAttribute('class', 'task-field')
        this.fields[2].setAttribute('class', 'task-field') 
        this.fields[0].innerHTML = this.task_name;      
        this.fields[1].innerHTML = 'Task:      ' + this.task;
        this.fields[2].innerHTML = 'Deadline:      ' + this.deadline;
        this.container.appendChild(this.fields[0]);
        this.container.appendChild(this.fields[1]);
        this.container.appendChild(this.fields[2]);
        temp_cont.appendChild(this.remove);
        temp_cont.appendChild(this.completedbox);
        this.container.appendChild(temp_cont)
    }

    // Saves the task information inside an array to save it in the localStorage

    saveTask() {
        const key = this.task_name;
        localStorage.setItem(key.toLowerCase(), JSON.stringify([this.task_name, this.task, this.deadline, this.completedbox.checked, this.mapid]))
    }

    // Removes the task from localStorage

    removeTask() {
        localStorage.removeItem(this.id.toLowerCase());
    }
    
}

// Creates the container and adds it to the document.

function addTasktoList(task) {
    task.setContainer();
    tasks_container.appendChild(task.container)
    ToDoList.set(task.mapid, task)
}

// Checks if the task is in localStorage to wheter save it or not, return true to add it to the map or false to not

function checkIfinSystem(task) {
    const name = task.task_name;
    if (!(name.toLowerCase() in localStorage)) {
        task.saveTask();
        return true;
    } else if (name.toLowerCase() in localStorage) {
        alert("Task was already added")
        return false;
    };
}

// Checks form values, create a new task object in the scope, if is not in the system; adds it to the Map.

myform.addEventListener('submit', () => {
    event.preventDefault();
    if (myform['task_name'].value != '' && myform['task'].value != '' && myform['deadline'].value != '') {
        const task = new Task(myform['task_name'].value, myform['task'].value, myform['deadline'].value, false, Math.random()*100000000);
        if (checkIfinSystem(task)) {
            addTasktoList(task)
            myform['task_name'].value = ''
            myform['task'].value = ''
            myform['deadline'].value = ''
        };
    } else {
        alert('Please fill all the cells')
    }
})

// Called when the remove button is clicked to remove the task from the document and localStorage in case the task is not completed. Uses as argument the remove button object

function removeTaskfromList(btn) {
    const task_container = btn.parentNode.parentNode;
    const id = btn.nextSibling['id']*1;
    const task = ToDoList.get(id);
    if (!task.completedbox.checked) {
        task.removeTask()
        tasks_container.removeChild(task_container);
    } else {
        alert('Completed tasks cannot be removed')
    }
}

// Called when the task checkbox is clicked to change the status of the task (completed, not completed). Uses as argument the checkbox object

function Completed(check) {
    const id = check['id']*1;
    const task = ToDoList.get(id);
    task.completedbox.checked = check.checked
    task.saveTask()
}

// Loads the tasks stored in localStorage, creates the tasks objects and add them to the document, and the map

document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const arr = JSON.parse(localStorage.getItem(key));
        const task = new Task(arr[0], arr[1], arr[2], arr[3], arr[4]);
        addTasktoList(task);
    }
})
