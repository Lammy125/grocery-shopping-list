const alert = document.querySelector("p");
const form = document.querySelector("#groceryForm");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector("#submitBtn");
const container = document.querySelector(".groceryContainer");1
const list = document.querySelector("#groceryList");
const clearBtn = document.querySelector("#clearBtn");

let editElement;
let editFlag = false;
let editID = "";

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItem);


// Functions

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = Symbol().toString();
  if (value && !editFlag) {

    createListItems(id, value);
    displayAlert("item added to the list", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();

  } else if (value && editFlag) {

    editElement.innerHTML = value;
    displayAlert("item changed", "success");
    editLocalStorage(editID, value);
    setBackToDefault();

  } else {
    displayAlert("please enter item", "danger");
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1500);
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

function clearItems() {
  const items = document.querySelectorAll(".groceryItem");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}


// Local Storage

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.unshift(grocery);
  localStorage.setItem("list", JSON.stringify(items));
  setBackToDefault();
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
  setBackToDefault();
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}


// Setup

function setupItem() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItems(item.id, item.value)
    })
    container.classList.add("show-container");
  } 
}

function createListItems(id, value) {
  const element = document.createElement("article");
  element.classList.add("groceryItem");
  const attr = document.createAttribute("dataID");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<li class="itemName">${value}</li>
      <div class="divBtn" id="idBtn">
          <button type="button" class="editBtn">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABiElEQVRIS+WX7U3DMBCG7Q06AU03yAh0hG4AG8AEsAEdgQ3oBu0GzQQ0sADZwLyviCvHtS+J4yg/sFRVtX33+L7sq1YLDb0QV80KLkxxX+v6FDIuCIbACpsLfPg9ZFQANO5GQrUyH5irLvpr6yu5AUPgCQIvQ6HYu//U388RqD34yYd3wLQUii5ToDzAxqypgx5zRwfug+meI3cbpWlFJfk5Fj8YUEDP2TOggc6dlZHA25ji0GEYU8yXkNlz3YMT+oi1g5XNAnYSaUVPefBjO3eFEj4Z7EKtNS48FqpJ4BDUgdO179nBEhSwm5iKddwqs1kdTa6p0KQYp0Ah88DShOuv5TkqxqlQ1PSbW8OjLE6E2vuaZdYJ3WCLcQ3+eDeRzZdoIkk5MwZsAqUhZu9c4N6SmQPcC23va/fRSYux9ErF1rJY/C/AfiPAnmpoD2YdVPLy4I++Ombrw3rNPgDe4Mqsg43AXybevWql2exlG6GGUGpvy0zkxn0cohZngvWqmfWfhERfDPwLoZN2Lm4VUxAAAAAASUVORK5CYII=" id="imgEdit">
          </button>
          <button type="button" class="deleteBtn">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABKklEQVRIS+1WURWDMAxsomAKCnMwCeBgOJiEOZmEIQEHQwIOVhyggC70vfEor4V0H2s/4BMuueRytAER6YFIvIJNrPO8oCIvYhxP3mIRO1Cq4TTDItZSPgXAjZOQMC30fbmH3SWmTnOh9XsvkfUd4Eydq60YDnFBxC+TBKCkhK0roRkFA/eNTYPYyDqO61lm83y1rqni3iPhNg6xXspvdWzJFTRUBng1pjSIl3XrLJsMNf27rN8jNNZrrqSIyQM3Ml8uEBUZZTKacL5jqBXUsUsF7ru1/Q7iWRGuhFzcIfVhrkTNFevkYlx+BsI554PM9R9iKR+0edy5ZB5cQxtn5frm7/iX7dJmGKjwyrccbi57dOVNC/w1uGvEwSwQSnW+2N0tM5iUGRCN+AMwmm0unqc7CgAAAABJRU5ErkJggg==" id="imgDelete">
          </button>
      </div>`;
  const deleteBtn = element.querySelector(".deleteBtn");
  const editBtn = element.querySelector(".editBtn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  list.appendChild(element);
}