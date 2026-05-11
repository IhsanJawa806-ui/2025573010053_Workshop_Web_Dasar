const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const counter = document.getElementById("counter");
const clearCompletedBtn = document.getElementById("clear-completed");
const prioritySelect = document.getElementById("priority");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

// ================== SAVE ==================
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ================== RENDER ==================
function renderTodos() {
  list.innerHTML = "";

  let filtered = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach((todo, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", true);
    li.classList.add(`priority-${todo.priority}`);
    if (todo.completed) li.classList.add("completed");

    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""}>
      <span>${todo.text}</span>
      <button>Hapus</button>
    `;

    // Checkbox
    li.querySelector("input").addEventListener("change", () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    // Delete
    li.querySelector("button").addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    // EDIT (double click)
    const span = li.querySelector("span");
    span.addEventListener("dblclick", () => {
      const editInput = document.createElement("input");
      editInput.value = todo.text;

      span.replaceWith(editInput);
      editInput.focus();

      function saveEdit() {
        if (editInput.value.trim().length >= 3) {
          todo.text = editInput.value.trim();
          saveTodos();
          renderTodos();
        } else {
          alert("Minimal 3 karakter");
        }
      }

      editInput.addEventListener("blur", saveEdit);
      editInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") saveEdit();
      });
    });

    // DRAG
    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      updateOrder();
    });

    list.appendChild(li);
  });

  updateCounter();
}

// ================== ADD ==================
addBtn.addEventListener("click", () => {
  const text = input.value.trim();

  if (text === "" || text.length < 3 || text.length > 100) {
    alert("Tugas harus 3-100 karakter!");
    return;
  }

  todos.push({
    text,
    completed: false,
    priority: prioritySelect.value,
  });

  input.value = "";
  saveTodos();
  renderTodos();
});

// ================== FILTER ==================
document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");

    filter = btn.dataset.filter;
    renderTodos();
  });
});

// ================== CLEAR COMPLETED ==================
clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

// ================== COUNTER ==================
function updateCounter() {
  const active = todos.filter((todo) => !todo.completed).length;
  counter.textContent = `${active} tugas tersisa`;
}

// ================== DRAG DROP ==================
list.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(list, e.clientY);
  if (afterElement == null) {
    list.appendChild(dragging);
  } else {
    list.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll("li:not(.dragging)")];

  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

function updateOrder() {
  const items = document.querySelectorAll("li");
  const newTodos = [];

  items.forEach((item) => {
    const text = item.querySelector("span").innerText;
    const found = todos.find((t) => t.text === text);
    if (found) newTodos.push(found);
  });

  todos = newTodos;
  saveTodos();
}

// ================== INIT ==================
renderTodos();
