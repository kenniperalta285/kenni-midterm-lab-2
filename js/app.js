document.addEventListener("DOMContentLoaded", function () {
  const dom = {
    input: document.getElementById("taskInput"),
    addBtn: document.getElementById("addTaskBtn"),
    loadBtn: document.getElementById("loadSamplesBtn"),
    list: document.getElementById("taskList"),
    message: document.getElementById("taskMessage"),
    total: document.getElementById("totalCount"),
    pending: document.getElementById("pendingCount"),
    completed: document.getElementById("completedCount"),
  };

  let taskCounter = 0;

  function nextTaskId() {
    taskCounter = taskCounter + 1;
    return "task-" + taskCounter;
  }

  function showMessage(text) {
    dom.message.textContent = text;
  }

  function clearMessage() {
    dom.message.textContent = "";
  }

  function createTaskElement(taskText, taskId) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.taskId = taskId;
    li.dataset.state = "pending";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = "Complete";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";

    li.append(span, completeBtn, editBtn, removeBtn);
    return li;
  }

  function addTask(taskText) {
    const clean = taskText.trim();
    if (clean === "") {
      showMessage("Task cannot be empty");
      return;
    }

    const task = createTaskElement(clean, nextTaskId());
    dom.list.appendChild(task);

    dom.input.value = "";
    clearMessage();
    updateTaskCounts();
  }

  function toggleTaskComplete(taskItem) {
    const isDone = taskItem.classList.toggle("completed");
    taskItem.dataset.state = isDone ? "completed" : "pending";
    updateTaskCounts();
  }

  function beginTaskEdit(taskItem) {
    const span = taskItem.querySelector(".task-text");
    const editBtn = taskItem.querySelector(".edit-btn");

    const input = document.createElement("input");
    input.className = "edit-input";
    input.value = span.textContent;

    taskItem.replaceChild(input, span);
    editBtn.textContent = "Save";
  }

  function saveTaskEdit(taskItem) {
    const input = taskItem.querySelector(".edit-input");
    const editBtn = taskItem.querySelector(".edit-btn");

    const clean = input.value.trim();
    if (clean === "") {
      showMessage("Task cannot be empty");
      return;
    }

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = clean;

    taskItem.replaceChild(span, input);
    editBtn.textContent = "Edit";
    clearMessage();
  }

  function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
  }

  function updateTaskCounts() {
    const items = dom.list.querySelectorAll(".task-item");
    let completed = 0;

    items.forEach(function (item) {
      if (item.dataset.state === "completed") {
        completed = completed + 1;
      }
    });

    const total = items.length;
    dom.total.textContent = total;
    dom.completed.textContent = completed;
    dom.pending.textContent = total - completed;
  }

  function handleTaskListClick(event) {
    const button = event.target;
    const taskItem = button.closest(".task-item");
    if (!taskItem) {
      return;
    }

    if (button.matches(".complete-btn")) {
      toggleTaskComplete(taskItem);
    } else if (button.matches(".edit-btn")) {
      if (button.textContent === "Edit") {
        beginTaskEdit(taskItem);
      } else {
        saveTaskEdit(taskItem);
      }
    } else if (button.matches(".remove-btn")) {
      removeTask(taskItem);
    }
  }

  function loadSampleTasks() {
    const samples = [
      "Review DOM selectors",
      "Practice createElement",
      "Study event delegation",
    ];

    const fragment = document.createDocumentFragment();
    samples.forEach(function (text) {
      fragment.appendChild(createTaskElement(text, nextTaskId()));
    });

    dom.list.appendChild(fragment);
    updateTaskCounts();
  }

  dom.addBtn.addEventListener("click", function () {
    addTask(dom.input.value);
  });

  dom.input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask(dom.input.value);
    }
  });

  dom.loadBtn.addEventListener("click", loadSampleTasks);
  dom.list.addEventListener("click", handleTaskListClick);

  updateTaskCounts();
});
