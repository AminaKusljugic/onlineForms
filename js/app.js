// Administration view 
const adminSearchInput = document.getElementById("adminSearchInput");
const adminSearchBtn = document.getElementById("adminSearchBtn");
const adminOutputForm = document.getElementById("adminOutputForm");

// Forms view
const formsSearchInput = document.getElementById("formsSearchInput");
const formsVersionInput = document.getElementById("formsVersionInput");
const formsSearchBtn = document.getElementById("formsSearchBtn");
const formsOutputForm = document.getElementById("formsOutputForm");

// In memory storage
const createdForms = []; 
const formsValues = [];


function changeView() {
  const name = this.textContent;

  if (name.trim() == "Administration") {
    this.style.color = "grey";
    this.nextElementSibling.style.color = "black";
    document.getElementById("administration").style.display = "block";
    document.getElementById("forms").style.display = "none";
  } else {
    this.style.color = "grey";
    this.previousElementSibling.style.color = "black";
    document.getElementById("forms").style.display = "block";
    document.getElementById("administration").style.display = "none";
  }
}





/*
 *
 *
 * Administration view
 *
 *
 */



// Event that triggers form creation step
adminSearchBtn &&
adminSearchBtn.addEventListener("click", function () {
    if (adminSearchInput.value != "") {
      let foundForm = createdForms.find((form) => adminSearchInput.value === form.name);

      if (foundForm == undefined) {
        addButton();
      } else {
        createForm(foundForm);
        addButton();
      }
    
    } else {
      addButton();
    }
  });


function createForm(foundForm) {
  let formRows = foundForm.formElements;

  for (let i = 0; i < formRows.length; i++) {
    // Creates div for every form row
    const tempDiv = document.createElement("div");
    adminOutputForm.appendChild(tempDiv);

    // Adding tags for every row
    tempDiv.innerHTML = `<label>Element${i + 1}</label>
      <input type="text" name="labelName" value="${formRows[i].labelName}">
      <select name="inputOption" id="inputOption" onchange="additionalOption.apply(this)">
        <option value="textbox" ${
          formRows[i].type == "textbox" ? "selected" : null
        }>Textbox</option>
        <option value="checkbox" ${
          formRows[i].type == "checkbox" ? "selected" : null
        }>Checkbox</option>
        <option value="radiobutton"${
          formRows[i].type == "radiobutton" ? "selected" : null
        }>RadioButton</option>
      </select>`;

    // Option number for radiobutton
    if (formRows[i].type === "radiobutton") {
      tempDiv.innerHTML += `<input type="number" min="2" value="${formRows[i].options.length}" onchange="addOptionsForRadioButton.apply(this)">`;
    }

    tempDiv.innerHTML += `<select name="validation" id="validation">
        <option value="none" ${
          formRows[i].validation == "none" ? "selected" : null
        }>None</option>
        <option value="mandatory" ${
          formRows[i].validation == "mandatory" ? "selected" : null
        }>Mandatory</option>
        <option value="numeric" ${
          formRows[i].validation == "numeric" ? "selected" : null
        }>Numeric</option>
      </select>`;

    // Renders option for radiobutton
    if (formRows[i].type === "radiobutton") {
      tempDiv.innerHTML += `<div>`;
      for (let j = 0; j < formRows[i].options.length; j++) {
        tempDiv.innerHTML += `<label>Option${
          j + 1
        }</label><input type="text" value="${formRows[i].options[j]}"/><br>`;
      }
      tempDiv.innerHTML += `</div>`;
    }
  }
}



let called = false;
function addButton() {
  if (called == false) {
    let addBtn = document.createElement("button");
    let saveBtn = document.createElement("button");

    addBtn.textContent = "Add";
    saveBtn.textContent = "Save";

    addBtn.id = "add";
    saveBtn.id = "save";

    // Creating rows
    let counter = 1;
    addBtn.addEventListener("click", function () {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `<label>Element${counter++}</label>
        <input type="text" name="labelName" value="New Label">
        <select name="inputOption" id="inputOption" onchange="additionalOption.apply(this)">
          <option value="textbox" selected>Textbox</option>
          <option value="checkbox">Checkbox</option>
          <option value="radiobutton">RadioButton</option>
        </select>
        <select name="validation" id="validation">
          <option value="none" selected>None</option>
          <option value="mandatory">Mandatory</option>
          <option value="numeric">Numeric</option>
        </select>`;
      adminOutputForm.insertBefore(tempDiv, this);
    });

    // Saving form
    saveBtn.addEventListener("click", function () {
      if (adminSearchInput.value == "")
        return alert("Please enter a name of the form that you want to save!");

      const elements = adminOutputForm.children;
      
      const temp = {
        name: adminSearchInput.value,
        formElements: [],
      };

      for (let i = 0; i < elements.length - 2; i++) {
        const row = {};
        row.labelName = elements[i].children[1].value;
        row.type = elements[i].children[2].value;
      
        if (elements[i].children[2].value === "radiobutton") {
          row.options = [];
          row.validation = elements[i].children[4].value;
          for (let j = 1; j < elements[i].children[5].children.length; j += 3) {
            row.options.push(elements[i].children[5].children[j].value);
          }
        } else {
          row.validation = elements[i].children[3].value;
        }
        temp.formElements.push(row);
      }
      let indexOfElement = createdForms.findIndex(
        (formObject) => formObject.name === temp.name
      );
      if (indexOfElement != -1) {
        createdForms[indexOfElement] = temp;
      } else {
        createdForms.push(temp);
      }
      alert("New form has been stored!");
      called = false;
      adminSearchInput.value = "";
      adminOutputForm.innerHTML = "";
    });

    adminOutputForm.appendChild(addBtn);
    adminOutputForm.appendChild(saveBtn);

    called = true;
  }
}

const additionalOption = function () {
  if (this.nextSibling.type === "number") {
    this.parentNode.removeChild(this.nextSibling);
    if (this.parentNode.childElementCount == 6)
      return this.parentNode.removeChild(this.parentNode.lastChild);
  }
  if (this.value !== "radiobutton") return;
  if (this.nextSibling.type === "number") return;

  const numberOfRadioButtons = document.createElement("input");
  numberOfRadioButtons.type = "number";
  numberOfRadioButtons.min = 2;
  numberOfRadioButtons.addEventListener("change", addOptionsForRadioButton);
  this.after(numberOfRadioButtons);
};

const addOptionsForRadioButton = function () {
  let tempDiv;
  const elementsInRow = 6;
  if (this.parentNode.childElementCount == elementsInRow) {
    this.parentNode.lastChild.innerHTML = "";
    tempDiv = this.parentNode.lastChild;
  } else {
    tempDiv = document.createElement("div");
    this.parentNode.appendChild(tempDiv);
  }

  for (let i = 0; i < this.value; i++) {
    tempDiv.innerHTML += `<label>Option${i + 1
      }</label><input type="text" /><br>`;
  }
};

/*
 *
 *
 * Forms view
 *
 *
 */


// Event that triggers version creation step 
formsSearchBtn &&
formsSearchBtn.addEventListener("click", function () {
    let foundForm = createdForms.find((form) => formsSearchInput.value === form.name);
    let foundVersion = formsValues.find(
      (form) => formsVersionInput.value === form.version && formsSearchInput.value === form.name
    );
    
    if (
      formsSearchInput.value == (foundForm && foundForm.name) &&
      formsVersionInput.value == (foundVersion && foundVersion.version)
    ) {
      buildForm(foundForm);
      populateForm(foundVersion);
      return;
    }
    if (formsSearchInput.value == (foundForm && foundForm.name)) {
      buildForm(foundForm);
      return;
    }

    if(formsSearchInput.value == "")
      alert("Enter the name of the form!");
    else
      alert("Form not found!");
  });

function populateForm(foundVersion) {
  const allInputs = document.querySelectorAll("#formsOutputForm input");
  let entered = false;
  for(let i = 1, a = 0; i < allInputs.length; i++){
    console.log(allInputs[i].type)
    if (allInputs[i].type == "checkbox") {
      allInputs[i].checked = foundVersion.formElements[a];
      a++;
      continue;
    }
   if(allInputs[i].type == "text" || allInputs[i].type == "number") {
      allInputs[i].value = foundVersion.formElements[a];
      a++;
      continue;
    }
    if (allInputs[i].type == "radio" && entered == false) {
      const allRadioButtons = document.querySelectorAll('#formsOutputForm input[type="radio"]');
      for (let j = 0; j < allRadioButtons.length; j++) {
        if (allRadioButtons[j].value == foundVersion.formElements[a]) {
          allRadioButtons[j].checked = true;
          entered = true;
          a++;
          break;
        }
      }
    }
   
  }
}



function buildForm(foundForm) {
  let formArray = foundForm.formElements;
  formsOutputForm.innerHTML = `<input type="hidden" name="number" value="${formArray.length}">`;
  for (let i = 0; i < formArray.length; i++) {
    formsOutputForm.innerHTML += `<br><label>${formArray[i].labelName}</label>`;
    if (formArray[i].type === "radiobutton") {
      for (let j = 0; j < formArray[i].options.length; j++) {
        formsOutputForm.innerHTML += `<br><input type="radio" id="inputValue${i}${j}" name="labelName${i}" value="${formArray[i].options[j]
          }" ${j == 0 ? "checked" : null}>
        <label for="inputValue${i}${j}">${formArray[i].options[j]}</label>`;
      }
    } else {
      formsOutputForm.innerHTML += `<input type="${formArray[i].validation == "numeric"
        ? "number"
        : formArray[i].type == "checkbox"
          ? "checkbox"
          : "text"
        }" name="labelName${i}" id="inputValue${i}" ${formArray[i].validation == "none" || formArray[i].validation == "numeric" ? null : "required"
        }>`;
    }
  }
  formsOutputForm.innerHTML += `<button id="save">Save</button>`;
}

formsOutputForm &&
formsOutputForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (formsVersionInput.value == "")
      return alert("Please enter the version of the form.");
    let temp = {
      name: formsSearchInput.value,
      version: formsVersionInput.value,
      formElements: [],
    };
    for (let i = 0; i < this.number.value; i++) {
      if (this[`labelName${i}`].type == "checkbox") {
        temp.formElements.push(this[`labelName${i}`].checked);
        console.log(this[`labelName${i}`].checked);
      }
      else {
        temp.formElements.push(this[`labelName${i}`].value);
        console.log(this[`labelName${i}`].value);
      }
    }
    let indexOfElement = formsValues.findIndex(
      (formObject) => formObject.name === temp.name && formObject.version == temp.version
    );
    if (indexOfElement != -1) {
      formsValues[indexOfElement] = temp;
    } else {
      formsValues.push(temp);
    }
    alert(`Form:${temp.name} has been stored at version: ${temp.version}!`);
    formsOutputForm.innerHTML = "";
  });
