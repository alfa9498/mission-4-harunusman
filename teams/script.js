function switchMode(mode) {
  // Mengambil elemen konten
  var content = document.getElementById("content");

  // Menghapus semua kelas mode
  content.classList.remove(
    "grid-mode",
    "board-mode",
    "calendar-mode",
    "chart-mode"
  );

  // Menambahkan kelas mode yang dipilih
  content.classList.add(mode + "-mode");

  // Mengubah konten berdasarkan mode
  if (mode === "grid") {
    content.innerHTML = `
          <table>
              <thead>
                  <tr>
                      <th>Title</th>
                      <th>Assignment</th>
                      <th>Start date</th>
                      <th>Due date</th>
                      <th>Bucket</th>
                      <th>Progress</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td colspan="6"><button>+ Add new task</button></td>
                  </tr>
              </tbody>
          </table>
      `;
  } else if (mode === "board") {
    content.innerHTML = `
          <div class="bucket" id="todo">
              <h3>To Do</h3>
              <button class="add-task">+ Add task</button>
              <div class="task-list">
                  <!-- Tempat untuk menampilkan tugas -->
              </div>
          </div>
          <div class="bucket" id="in-progress">
              <h3>In Progress</h3>
              <button class="add-task">+ Add task</button>
              <div class="task-list">
                  <!-- Task cards or list items will be here -->
              </div>
          </div>
          <div class="bucket" id="Done">
              <h3>Done</h3>
             
              <div class="task-list">
                  <!-- Task cards or list items will be here -->
              </div>
          </div>
          <!-- Additional buckets could be included for other categories like 'Completed', etc. -->
      `;
  } else {
    content.innerHTML = ""; // Kosongkan konten untuk mode lain atau ganti dengan konten lain sesuai mode
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addTaskButton = document.querySelector(".add-task");
  const modal = document.getElementById("task-modal");
  const closeModal = document.querySelector(".close");
  const taskForm = document.getElementById("task-form");
  const taskListContainers = {
    todo: document.querySelector("#todo .task-list"),
    "in-progress": document.querySelector("#in-progress .task-list"),
    done: document.querySelector("#done .task-list"),
  };

  // Show modal
  addTaskButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const assignment = document.getElementById("assignment").value;
    const startDate = document.getElementById("start-date").value;
    const dueDate = document.getElementById("due-date").value;
    const bucket = document.getElementById("bucket").value;
    const progress = document.getElementById("progress").value;

    // Create new task card
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.innerHTML = `
          <h4>${title}</h4>
          <p>${assignment}</p>
          <p><strong>Start Date:</strong> ${startDate}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
          <p><strong>Progress:</strong> ${progress}%</p>
      `;

    // Append task card to appropriate bucket
    if (taskListContainers[bucket]) {
      taskListContainers[bucket].appendChild(taskCard);
    }

    // Close modal
    modal.style.display = "none";

    // Reset form
    taskForm.reset();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const addTaskButtons = document.querySelectorAll(".add-task");
  const modal = document.getElementById("task-modal");
  const closeModal = document.querySelector(".close");
  const taskForm = document.getElementById("task-form");
  const taskTableBody = document.querySelector("#task-table tbody");

  // Show modal
  addTaskButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.style.display = "block";
    });
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle form submission
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const assignment = document.getElementById("assignment").value;
    const startDate = document.getElementById("start-date").value;
    const dueDate = document.getElementById("due-date").value;
    const bucket = document.getElementById("bucket").value;
    const progress = document.getElementById("progress").value;

    // Create new row for the table
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
          <td>${title}</td>
          <td>${assignment}</td>
          <td>${startDate}</td>
          <td>${dueDate}</td>
          <td>${bucket}</td>
          <td>${progress}%</td>
      `;

    // Append new row to the table
    taskTableBody.appendChild(newRow);

    // Close modal
    modal.style.display = "none";

    // Reset form
    taskForm.reset();
  });
});
