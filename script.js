let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

const subject = document.getElementById("subject");
const deadline = document.getElementById("deadline");
const priority = document.getElementById("priority");
const mainBtn = document.getElementById("mainBtn");
const container = document.getElementById("tasks");

mainBtn.addEventListener("click", handleTask);

function handleTask() {

  if (!subject.value || !deadline.value) {
    alert("Fill all fields");
    return;
  }

  if (editIndex === null) {

    let exists = tasks.some(t => t.subject === subject.value && t.deadline === deadline.value);
    if (exists) {
      alert("Task already exists");
      return;
    }

    let today = new Date();
    let end = new Date(deadline.value);

    let days = Math.ceil((end - today) / (1000*60*60*24));
    let workload = priority.value === "High" ? 3 : priority.value === "Medium" ? 2 : 1;

    tasks.push({
      subject: subject.value,
      deadline: deadline.value,
      priority: priority.value,
      daysLeft: days,
      progress: 0,
      workload,
      lastUpdated: null
    });

  } else {

    tasks[editIndex].subject = subject.value;
    tasks[editIndex].deadline = deadline.value;
    tasks[editIndex].priority = priority.value;

    editIndex = null;
    mainBtn.innerText = "Add Task";
  }

  subject.value = "";
  deadline.value = "";

  save();
  render();
}

function render() {
  container.innerHTML = "";

  tasks.forEach((t, i) => {

    let div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <b>${t.subject}</b><br>
      Deadline: ${t.deadline}<br>
      Priority: ${t.priority}<br>
      Progress: ${t.progress}%<br>

      <div class="progress-bar">
        <div class="progress-fill" style="width:${t.progress}%"></div>
      </div>

      <br>
      <input type="checkbox" ${t.lastUpdated === new Date().toDateString() ? "checked" : ""} data-index="${i}" class="check">

      <div class="actions">
        <button class="edit-btn" data-index="${i}">Edit</button>
        <button class="delete-btn" data-index="${i}">Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

container.addEventListener("click", function(e) {

  let index = e.target.dataset.index;

  if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
    save();
    render();
  }

  if (e.target.classList.contains("edit-btn")) {
    subject.value = tasks[index].subject;
    deadline.value = tasks[index].deadline;
    priority.value = tasks[index].priority;

    editIndex = index;
    mainBtn.innerText = "Update Task";
  }

  if (e.target.classList.contains("check")) {
    let today = new Date().toDateString();

    if (tasks[index].lastUpdated === today) return;

    tasks[index].progress += 10;
    if (tasks[index].progress > 100) tasks[index].progress = 100;

    tasks[index].lastUpdated = today;

    save();
    render();
  }

});

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

render();