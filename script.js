// Saves the tasks objects with an unique id
const ToDoList = new Map;
// Container of the task in the HTML
const tasks_container = document.querySelector('.tasks_cont');
// Form used to add tasks
const myform = document.querySelector('.myform');
// Array containing information of each task
const tasks = JSON.parse(localStorage.getItem('todolist')) || [];

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
        this.arrinfo = [this.task_name, this.task, this.deadline, this.completedbox.checked, this.mapid];
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
        tasks.push(this.arrinfo)
        localStorage.setItem('todolist', JSON.stringify(tasks))
    }

// Removes the task from localStorage

    removeTask() {
        const idx_toremove = tasks.indexOf(this.arrinfo);
        tasks.splice(idx_toremove, 1)
        localStorage.setItem('todolist', JSON.stringify(tasks));
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
    let state = false
    tasks.forEach((tsk) => {
        if (tsk[0] == task.task_name) {
            state = true;
        }
    });
    if (!state) {
        task.saveTask();
        return true;
    } else {
        alert("Task was already added")
        return false;
    };
}

// Checks form values, create a new task object in the scope, if is not in the system; adds it to the Map.

myform.addEventListener('submit', () => {
    event.preventDefault();
    if (myform['task_name'].value != '' && myform['task'].value != '' && myform['deadline'].value != '') {
        const task = new Task(myform['task_name'].value, myform['task'].value, myform['deadline'].value, myform['completed'].checked, Math.random()*100000000);
        if (checkIfinSystem(task)) {
            addTasktoList(task)
            myform['task_name'].value = ''
            myform['task'].value = ''
            myform['deadline'].value = ''
            myform['completed'].checked = false
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
    if (tasks != null) {
        tasks.forEach((task) => {
            const task_obj = new Task(task[0], task[1], task[2], task[3], task[4]);
            addTasktoList(task_obj)
        });
    }
})
