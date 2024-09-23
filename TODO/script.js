document.addEventListener("DOMContentLoaded", () => {
  const addBucketBtn = document.getElementById("addBucketBtn");
  loadBuckets();

  addBucketBtn.addEventListener("click", () => {
    const bucketName = prompt("Enter Bucket Name:");
    if (bucketName) {
      createBucket(bucketName);
      saveBucket(bucketName);
    }
  });
});

function createBucket(bucketName) {
  const todoContainer = document.querySelector(".todo-container");
  const newBucketId = bucketName.toLowerCase().replace(/\s+/g, "-");

  // Periksa jika ID sudah ada
  if (document.getElementById(newBucketId)) {
    alert("Bucket dengan nama ini sudah ada.");
    return;
  }

  const newBucket = document.createElement("div");
  newBucket.classList.add("bucket");
  newBucket.id = newBucketId;
  newBucket.innerHTML = `
    <h3>${bucketName}</h3>
    <button class="options-btn" onclick="showBucketOptions(event)">⋮</button>
    <button class="add-task">+ Add task</button>
    <button class="delete-all-tasks" onclick="deleteAllTasks('${newBucket.id}')">Delete All Tasks</button>
    <div class="task-list"></div>
    <div class="options-menu" style="display: none;"></div>
  `;

  todoContainer.appendChild(newBucket);

  const addTaskBtn = newBucket.querySelector(".add-task");
  addTaskBtn.addEventListener("click", () => {
    showTaskForm(newBucket.id);
  });

  loadTasks(newBucket.id);
}

function showBucketOptions(event) {
  const bucket = event.target.closest(".bucket");
  const optionsMenu = bucket.querySelector(".options-menu");
  optionsMenu.style.display =
    optionsMenu.style.display === "block" ? "none" : "block";
  optionsMenu.innerHTML = `
    <button onclick="renameBucket('${bucket.id}')">Rename</button>
    <button onclick="deleteBucket('${bucket.id}')">Delete</button>
  `;
}

function renameBucket(bucketId) {
  const bucket = document.getElementById(bucketId);
  const newName = prompt(
    "Enter new Bucket Name:",
    bucket.querySelector("h3").innerText
  );
  if (newName) {
    const oldName = bucket.querySelector("h3").innerText;
    const newId = newName.toLowerCase().replace(/\s+/g, "-");

    // Update name in DOM
    bucket.querySelector("h3").innerText = newName;

    // Update id only if new id is different
    if (newId !== bucketId) {
      bucket.id = newId;
      updateBucketNameInStorage(oldName, newName, bucketId, newId);
    }
  }
}

function deleteBucket(bucketId) {
  const bucket = document.getElementById(bucketId);
  if (bucket) {
    const bucketName = bucket.querySelector("h3").innerText;
    bucket.remove();
    removeBucketFromStorage(bucketName);
  }
}

function showTaskForm(bucketId) {
  const bucket = document.getElementById(bucketId);
  const taskForm = document.createElement("div");
  taskForm.classList.add("task-form");

  taskForm.innerHTML = `
    <div>
      <input type="text" class="task-input" placeholder="Enter Task Name" required>
    </div>
    <div>
      <label for="task-date">Due Date: </label>
      <input type="date" id="task-date" class="task-date" required>
    </div>
    <div>
      <label for="task-assign">Assign to: </label>
      <select id="task-assign" class="task-assign" required>
        <option value="User 1">User 1</option>
        <option value="User 2">User 2</option>
        <option value="User 3">User 3</option>
      </select>
    </div>
    <div>
      <button class="submit-task-btn">Add Task</button>
    </div>
  `;

  bucket.appendChild(taskForm);

  taskForm.querySelector(".submit-task-btn").addEventListener("click", () => {
    const taskName = taskForm.querySelector(".task-input").value;
    const taskDate = taskForm.querySelector(".task-date").value;
    const taskAssign = taskForm.querySelector(".task-assign").value;

    if (taskName && taskDate && taskAssign) {
      addTaskToBucket(bucketId, taskName, taskDate, taskAssign);
      taskForm.remove();
    } else {
      alert("Please fill out all fields");
    }
  });
}

function addTaskToBucket(bucketId, taskName, taskDate, taskAssign) {
  const bucket = document.getElementById(bucketId);
  const taskList = bucket.querySelector(".task-list");
  const newTask = document.createElement("div");
  newTask.classList.add("task");
  newTask.innerHTML = `
    <input type="checkbox" class="task-checkbox">
    <span>${taskName}</span>
    <div>Due: ${taskDate}</div>
    <div>Assigned to: ${taskAssign}</div>
    <button class="task-options-btn" onclick="showTaskOptions(event)">⋮</button>
    <div class="task-options-menu" style="display: none;">
      <button onclick="editTask(event)">Edit</button>
      <button onclick="deleteTask(event)">Delete</button>
    </div>
  `;

  taskList.appendChild(newTask);
  saveTaskToBucket(bucketId, taskName, taskDate, taskAssign);

  const checkbox = newTask.querySelector(".task-checkbox");
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      moveToDone(bucketId, newTask);
    }
  });
}

function showTaskOptions(event) {
  const task = event.target.closest(".task");
  const optionsMenu = task.querySelector(".task-options-menu");
  optionsMenu.style.display =
    optionsMenu.style.display === "block" ? "none" : "block";
}

function editTask(event) {
  const task = event.target.closest(".task");
  const bucket = task.closest(".bucket");
  const bucketId = bucket.id;
  const taskName = task.querySelector("span").innerText;
  const newTaskName = prompt("Edit Task Name:", taskName);
  if (newTaskName) {
    task.querySelector("span").innerText = newTaskName;
    updateTaskInStorage(bucketId, task, newTaskName);
  }
}

function deleteTask(event) {
  const task = event.target.closest(".task");
  const bucket = task.closest(".bucket");
  const bucketId = bucket.id;
  task.remove();
  removeTaskFromStorage(bucketId, task);
}

function deleteAllTasks(bucketId) {
  const bucket = document.getElementById(bucketId);
  const taskList = bucket.querySelector(".task-list");
  taskList.innerHTML = "";
  localStorage.removeItem(bucketId); // Hapus semua tugas dari localStorage
}

function updateTaskInStorage(bucketId, taskElement, newTaskName) {
  const tasks = JSON.parse(localStorage.getItem(bucketId)) || [];
  const oldTaskName = taskElement.querySelector("span").innerText;

  const updatedTasks = tasks.map((task) =>
    task.taskName === oldTaskName ? { ...task, taskName: newTaskName } : task
  );

  localStorage.setItem(bucketId, JSON.stringify(updatedTasks));
}

function removeTaskFromStorage(bucketId, taskElement) {
  const taskName = taskElement.querySelector("span").innerText;
  const tasks = JSON.parse(localStorage.getItem(bucketId)) || [];
  const updatedTasks = tasks.filter((task) => task.taskName !== taskName);
  localStorage.setItem(bucketId, JSON.stringify(updatedTasks));
}

function moveToDone(bucketId, taskElement) {
  const doneBucket = document.getElementById("done");
  const taskClone = taskElement.cloneNode(true);
  taskClone.querySelector(".task-checkbox").remove();
  doneBucket.querySelector(".task-list").appendChild(taskClone);
  taskElement.remove();
  removeTaskFromStorage(bucketId, taskElement);
}

function saveBucket(bucketName) {
  const buckets = JSON.parse(localStorage.getItem("buckets")) || [];
  buckets.push(bucketName);
  localStorage.setItem("buckets", JSON.stringify(buckets));
}

function loadBuckets() {
  const buckets = JSON.parse(localStorage.getItem("buckets")) || [];
  buckets.forEach((bucket) => createBucket(bucket));
}

function saveTaskToBucket(bucketId, taskName, taskDate, taskAssign) {
  const tasks = JSON.parse(localStorage.getItem(bucketId)) || [];
  if (!tasks.some((task) => task.taskName === taskName)) {
    tasks.push({ taskName, taskDate, taskAssign });
    localStorage.setItem(bucketId, JSON.stringify(tasks));
  }
}

function loadTasks(bucketId) {
  const tasks = JSON.parse(localStorage.getItem(bucketId)) || [];
  tasks.forEach((task) => {
    addTaskToBucket(bucketId, task.taskName, task.taskDate, task.taskAssign);
  });
}

function updateBucketNameInStorage(oldName, newName, oldId, newId) {
  const buckets = JSON.parse(localStorage.getItem("buckets")) || [];
  const updatedBuckets = buckets.map((bucket) =>
    bucket === oldName ? newName : bucket
  );
  localStorage.setItem("buckets", JSON.stringify(updatedBuckets));

  // Update tasks associated with the bucket
  const tasks = JSON.parse(localStorage.getItem(oldId)) || [];
  localStorage.setItem(newId, JSON.stringify(tasks));
  localStorage.removeItem(oldId); // Hapus old bucket's tasks
}

function removeBucketFromStorage(bucketName) {
  const buckets = JSON.parse(localStorage.getItem("buckets")) || [];
  const updatedBuckets = buckets.filter((bucket) => bucket !== bucketName);
  localStorage.setItem("buckets", JSON.stringify(updatedBuckets));
}
function moveToDone(bucketId, taskElement) {
  const doneBucket = document.getElementById("done");
  const taskClone = taskElement.cloneNode(true);

  // Tambahkan kelas done-task agar teks tercoret
  taskClone.querySelector("span").classList.add("done-task");

  // Hapus checkbox dari clone dan tambahkan ke bucket "Done"
  taskClone.querySelector(".task-checkbox").remove();
  doneBucket.querySelector(".task-list").appendChild(taskClone);

  // Hapus task dari bucket lama
  taskElement.remove();
  removeTaskFromStorage(bucketId, taskElement);
}
