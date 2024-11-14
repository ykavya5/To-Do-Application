document.addEventListener("DOMContentLoaded", function(){
    const inputTask = document.getElementById("input-task");
    const addTask = document.getElementById("add-task");
    const taskList = document.getElementById("task-list-container");
    const noTasksMessage = document.getElementById("no-tasks");
    const showAll = document.getElementById("all-tasks");
    const showCompleted = document.getElementById("completed-tasks");
    const showIncomplete = document.getElementById("incomplete-tasks");

   
    let tasks = JSON.parse(localStorage.getItem("tasks")) ||[];
    let draggedTaskId = null;
    renderTasks();
    addTask.addEventListener("click", addTaskFun);
    function addTaskFun(){
        const taskName= inputTask.value.trim();
        if(taskName){
            const task ={
                id:Date.now(),
                name:taskName,
                completed:false
            };
            tasks.push(task);
            inputTask.value = "";
            saveTasks();
            renderTasks();
            }
        }
    
    function renderTasks(filteredTasks = tasks){
        taskList.innerHTML = "";
        filteredTasks.forEach(task =>{
            const taskItem = document.createElement("li");
            taskItem.className = "task-item";
            taskItem.draggable = true;
            if(task.completed) taskItem.classList.add("completed");

            const taskComplete = document.createElement("input");
            taskComplete.type = "checkbox";
            taskComplete.className = "task-complete";
            taskComplete.checked = task.completed;
            taskComplete.addEventListener("change", () => completeTaskFun(task.id));
            taskItem.appendChild(taskComplete);

            const taskName = document.createElement("span");    
            taskName.className = "task-name";
            taskName.innerText = task.name;
            taskItem.appendChild(taskName);

            const editButton = document.createElement("button");
            editButton.className = "task-edit";
            editButton.innerText = "Edit";
            editButton.addEventListener("click",()=> editTaskFun(task.id));
            taskItem.appendChild(editButton);

            const taskDelete = document.createElement("button");
            taskDelete.className = "task-delete";
            taskDelete.innerText = "Delete";
            taskDelete.addEventListener("click", ()=>deleteTaskFun(task.id));
            taskItem.appendChild(taskDelete);

            

            taskItem.addEventListener("dragstart", () => handleDragStart(task.id));
            taskItem.addEventListener("dragover", handleDragOver);
            taskItem.addEventListener("drop", () => handleDrop(task.id));
            taskItem.addEventListener("dragend", handleDragEnd);

            taskList.appendChild(taskItem);
        });
        noTasksMessage.style.display = filteredTasks.length ? "none" : "block";
    }

    function editTaskFun(id){
        const task = tasks.find(task=>task.id === id);
        if(task){
            const updatedName = prompt("Enter a new name for the task", task.name);
            if(updatedName){
                task.name = updatedName.trim();
                saveTasks();
                renderTasks();
            }
        }
    }

    function deleteTaskFun(id){
        const task = tasks.find(task=>task.id === id);
        if(task){
            tasks = tasks.filter(task=>task.id !== id);
            saveTasks();
            renderTasks();
        }
    }
    function completeTaskFun(id){
        const task = tasks.find(task=>task.id === id);
        if(task){
            console.log(task);
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function saveTasks(){
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    showAll.addEventListener("click", ()=>{
        renderTasks(tasks);
    })
    showCompleted.addEventListener("click", ()=>{
        renderTasks(tasks.filter(task=>task.completed));
    })
    showIncomplete.addEventListener("click", ()=>{
        renderTasks(tasks.filter(task=>!task.completed));
    })

    function handleDragStart(id) {
        draggedTaskId = id; 
    }
    function handleDragOver(event) {
        event.preventDefault(); 
    }

    function handleDrop(targetId) {
        if (draggedTaskId !== targetId) {
           
            const draggedIndex = tasks.findIndex(task => task.id === draggedTaskId);
            const targetIndex = tasks.findIndex(task => task.id === targetId);

            
            const [draggedTask] = tasks.splice(draggedIndex, 1);
            tasks.splice(targetIndex, 0, draggedTask);

            saveTasks(); 
            renderTasks(); 
        }
    }

    function handleDragEnd() {
        draggedTaskId = null; 
    }

    
})
