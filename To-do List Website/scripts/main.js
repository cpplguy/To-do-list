"use strict";
import { tim } from "./time.js";
// very good website made by me, may 18 2025
const tableBody = document.querySelector("tbody");
const table = document.querySelector("table");
let date = new Date();
const dateChecker = (row) => {
  let rowDate = new Date(row.children[1].textContent.trim());
  let rowTime = row.children[2].textContent.trim();
  let [rowHours, rowMinutes] = rowTime.split(":").map(Number);
  rowDate.setHours(rowHours, rowMinutes);
  return rowDate;
};
const statusChecker = () => {
  document.querySelectorAll("tr:not(#header)").forEach((row) => {
    if (row.children[3].textContent === "finished") {
      row.style.backgroundColor = "lime";
    } else if (row.children[3].textContent === "ongoing") {
      row.style.backgroundColor = "yellow";
    } else if (row.children[3].textContent === "not done") {
      if (date > dateChecker(row)) {
        row.style.backgroundColor = "#FF4D4D";
      } else {
        row.style.backgroundColor =
          Array.from(row.parentNode.children).indexOf(row) % 2 === 0
            ? "white"
            : "gainsboro";
      }
    }
  });
};
const settings = document.querySelector("#settings");
const settingsContainer = document.querySelector("#settingscontainer");
let settingsOpen = false;
settings.addEventListener("click", () => {
  if (settingsOpen) {
    settingsContainer.style.transform = "translateY(-150%)";
    settingsContainer.style.opacity = "0";
    settingsOpen = false;
  } else {
    settingsContainer.style.transform = "translateY(0%)";
    settingsContainer.style.opacity = "1";
    settingsOpen = true;
  }
});
const nightStatus = () => {
      document.querySelectorAll("tr:not(#header)").forEach((element) => {

  if (element.children[3].textContent === "finished") {
        element.style.backgroundColor = "darkgreen";
      } else if (element.children[3].textContent === "ongoing") {
        element.style.backgroundColor = "orange";
      } else if (
        element.children[3].textContent === "not done" &&
        date > dateChecker(element)
      ) {
        element.style.backgroundColor = "darkred";
      } else {
        element.style.backgroundColor = "darkgray";
      }
          });
}
let nightMode = localStorage.getItem("nightMode") === "true";
const nightButton = document.querySelector("#nightmodebutton");
const circle = document.querySelector("#circle");
const neetMode = () => {
  if (nightMode) {
    console.log(nightMode);
    circle.style.transform = "translateX(55px)";
    nightButton.style.backgroundColor = "lime";
    document
      .querySelectorAll("h1,h2,h3,h5,h6,label,button,input,label,td,li")
      .forEach((element) => {
        element.style.color ="#FFF0F5";
      });
    document.querySelectorAll("body,form,input,table,nav").forEach((element) => {
      element.style.backgroundColor = "#2b2727";
    });
    document.querySelector("footer").style.color = "white";
    document.querySelector("#tim").style.color = "white";
    nightStatus();
  } else {
    document.querySelector("footer").style.color = "gray";
    document.getElementById("tim").style.color = "gray";
    circle.style.transform = "translateX(0%)";
    nightButton.style.backgroundColor = "lightgray";
    document
      .querySelectorAll("h1,h2,h3,h5,h6,label,input,td,li")
      .forEach((element) => {
        element.style.color = "black";
      });
    document.querySelectorAll("body,form,table,nav,input").forEach((element) => {
      element.style.backgroundColor = "white";
    });
    statusChecker();
  }
};

nightButton.addEventListener("click", () => {
  if (nightMode) {
    localStorage.setItem("nightMode", "false");
  } else {
    localStorage.setItem("nightMode", "true");
  }
  nightMode = !nightMode;
  neetMode();
});
document.querySelector("#addRow").addEventListener("click", () => {
  displayForm();
});
document.querySelector("#x").addEventListener("click", () => {
  hideForm();
});
let stats;
const createRow = () => {
  let task = document.querySelector("#task").value;
  let date = document.querySelector("#date").value;
  let time = document.querySelector("#time").value;
  let b = document.createElement("tr");

  stats = "not done";
  let JSONS = {
    task: task,
    date: date,
    time: time,
    status: stats,
  };
  let key = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  b.setAttribute("data-id", key);
  localStorage.setItem(key, JSON.stringify(JSONS));
  b.innerHTML = `<td>${escapeHTML(task)}</td>
                    <td>${escapeHTML(date)}</td>
                    <td>${escapeHTML(time)}</td>
                    <td>${escapeHTML(stats)}</td>
                    <td><button class='delete-btn'>X</button></td>`;
  b.classList.add("new-row");
  tableBody.appendChild(b);
  Overflow();
  sortRows();
  requestAnimationFrame(() => {
    document.querySelector(`tr[data-id="${key}"]`)?.classList.add("show");
    if(nightMode){
      nightStatus();
    }else{
      statusChecker();
    }
  });
};
const Overflow = () => {
  if (table.childElementCount >= 7 && table.childElementCount < 10) {
    document.querySelector("h2").style.opacity = "1";
    setTimeout(() => {
      document.querySelector("h2").style.opacity = "0";
    }, 1500);
  }
};
const deleteRow = (key) => {
  let row = document.querySelector(`tr[data-id="${key}"]`);
  const confirmYes = confirm("Are you sure you want to delete this row?");
  if (row && confirmYes) {
    console.log("h");
    row.style.transform = "translate(0,-100px) rotate(-0.05turn)";
    row.classList.remove("show");
    row.classList.remove("new-row");
    localStorage.removeItem(key);
    setTimeout(() => {
      row.remove();
    }, 1000);
    return;
  }
};
document.querySelector("#submit").addEventListener("click", (event) => {
  event.preventDefault();
  let inputChecker = Array.from(document.querySelectorAll("input")).every(
    (input) => {
      return input.value.trim() !== "";
    }
  );
  if (inputChecker) {
    createRow();
    hideForm();
    sortRows();
    statusChecker();
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    setTimeout(() => {
      alert("Task added");
    }, 100);
  } else {
    alert("Please fill in all fields");
  }
});
const form = document.querySelector("form");
const addRow = document.querySelector("#addRow");
const x = document.querySelector("#x");
const submit = document.querySelector("#submit");
const displayForm = () => {
  form.style.display = "block";
  form.style.opacity = "100%";
  addRow.style.opacity = "0";
  setTimeout(() => {
    addRow.style.display = "none";
  }, 1000);
  submit.disabled = true;
  x.disabled = true;
  setTimeout(() => {
    x.disabled = false;
    submit.disabled = false;
  }, 1000);
};
const hideForm = () => {
  form.style.opacity = "0";
  setTimeout(() => {
    form.style.display = "none";
  }, 1000);
  addRow.style.display = "block";
  addRow.style.opacity = "100%";
};
const escapeHTML = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
const displayJSONValues = () => {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key !== "nightMode") {
      let value = localStorage.getItem(key);
      let JSONS = JSON.parse(value);
      let b = document.createElement("tr");
      b.setAttribute("data-id", key);
      b.innerHTML = `<td>${escapeHTML(JSONS.task)}</td>
                    <td>${escapeHTML(JSONS.date)}</td>
                    <td>${escapeHTML(JSONS.time)}</td>
                    <td>${escapeHTML(JSONS.status)}</td>
                    <td><button class="delete-btn">X</button></td>`;
      b.classList.add("new-row");
      tableBody.appendChild(b);
      setTimeout(() => {
        b.classList.add("show");
      }, 10);
      Overflow();
    }
  }
};

tableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row || row.id === "header") return;

  const key = row.getAttribute("data-id");
  if (!key) return;

  if (e.target.classList.contains("delete-btn")) {
    e.stopPropagation();
    deleteRow(key);
    return;
  }

  let status = row.children[3].textContent.trim();
  let value = localStorage.getItem(key);
  if (!value) return;
  let JSONS = JSON.parse(value);

  if (status === "not done") {
    status = "ongoing";
    row.style.backgroundColor = "yellow";
  } else if (status === "ongoing") {
    status = "finished";
    row.style.backgroundColor = "lime";
  }

  row.children[3].textContent = status;

  let rowDate = new Date(row.children[1].textContent.trim());
  let rowTime = row.children[2].textContent.trim();
  let [rowHours, rowMinutes] = rowTime.split(":").map(Number);
  rowDate.setHours(rowHours, rowMinutes);

  if (new Date() > rowDate && status !== "finished") {
    row.style.backgroundColor = "#FF4D4D";
  }
  if(nightMode){
    nightStatus();
  }

  JSONS.status = status;
  localStorage.setItem(key, JSON.stringify(JSONS));
  console.log(row);
});
const sortRows = () => {
  let rows = Array.from(tableBody.querySelectorAll("tr"));
  if (rows.length === 0) return;
  if (rows.length > 1) {
    rows.sort((a, b) => {
      let dateA = new Date(a.children[1].textContent.trim());
      let dateB = new Date(b.children[1].textContent.trim());
      let rowTimeA = a.children[2].textContent.trim();
      let [rowHoursA, rowMinutesA] = rowTimeA.split(":").map(Number);
      dateA.setHours(rowHoursA, rowMinutesA);
      let rowTimeB = b.children[2].textContent.trim();
      let [rowHoursB, rowMinutesB] = rowTimeB.split(":").map(Number);
      dateB.setHours(rowHoursB, rowMinutesB);
      return dateA - dateB;
    });
    rows.forEach((row) => {
      tableBody.appendChild(row);
    });
  }
};
addEventListener("DOMContentLoaded", () => {
  displayJSONValues();
  sortRows();
  tim();
  statusChecker();
  neetMode();
});
setInterval(tim, 1000);