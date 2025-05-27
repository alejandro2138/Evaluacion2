const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const gradeInput = document.getElementById("grade");
const averageDisplay = document.getElementById("average");
const tableBody = document.querySelector("#studentsTable tbody");

let students = [];
let editIndex = -1;

// Función para validar datos
function validarDatos(name, lastName, grade) {
  const regexTexto = /^[A-Za-zÀ-ÿ\s]+$/;
  if (!name.trim() || !lastName.trim()) {
    alert("Nombre y Apellido son obligatorios.");
    return false;
  }
  if (!regexTexto.test(name) || !regexTexto.test(lastName)) {
    alert("Nombre y Apellido solo deben contener letras y espacios.");
    return false;
  }
  if (isNaN(grade) || grade < 1 || grade > 7) {
    alert("La nota debe estar entre 1.0 y 7.0");
    return false;
  }
  return true;
}

// Función para renderizar la tabla
function renderTabla() {
  tableBody.innerHTML = "";

  students.forEach((student, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.lastName}</td>
      <td>${student.grade.toFixed(1)}</td>
      <td>
        <button class="action-btn edit-btn" data-index="${index}">Editar</button>
        <button class="action-btn delete-btn" data-index="${index}">Eliminar</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  actualizarEstadisticas();
}

// Función para actualizar promedio y estadísticas
function actualizarEstadisticas() {
  const total = students.length;
  if (total === 0) {
    averageDisplay.textContent = "Promedio General del Curso : N/A";
    mostrarEstadisticas(0, 0, 0);
    return;
  }

  const sumaNotas = students.reduce((acc, cur) => acc + cur.grade, 0);
  const promedio = sumaNotas / total;

  const aprobados = students.filter(s => s.grade >= 4).length;
  const reprobados = total - aprobados;

  averageDisplay.textContent = `Promedio General del Curso : ${promedio.toFixed(2)}`;

  mostrarEstadisticas(total, aprobados, reprobados);
}

// Mostrar estadísticas adicionales debajo
function mostrarEstadisticas(total, aprobados, reprobados) {
  let statsDiv = document.querySelector(".stats");
  if (!statsDiv) {
    statsDiv = document.createElement("div");
    statsDiv.classList.add("stats");
    averageDisplay.insertAdjacentElement('afterend', statsDiv);
  }

  if (total === 0) {
    statsDiv.innerHTML = `<p>No hay estudiantes registrados.</p>`;
    return;
  }

  const porcentajeAprobados = ((aprobados / total) * 100).toFixed(1);
  const porcentajeReprobados = ((reprobados / total) * 100).toFixed(1);

  statsDiv.innerHTML = `
    <p><strong>Total de estudiantes:</strong> ${total}</p>
    <p><strong>Aprobados (≥ 4.0):</strong> ${porcentajeAprobados}%</p>
    <p><strong>Reprobados (< 4.0):</strong> ${porcentajeReprobados}%</p>
  `;
}

// Reiniciar formulario
function reiniciarFormulario() {
  form.reset();
  editIndex = -1;
  form.querySelector("button[type='submit']").textContent = "Guardar Alumno";
}

// Agregar o editar estudiante
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const grade = parseFloat(gradeInput.value);

  if (!validarDatos(name, lastName, grade)) return;

  if (editIndex === -1) {
    // agregar
    students.push({ name, lastName, grade });
  } else {
    // editar
    students[editIndex] = { name, lastName, grade };
  }

  renderTabla();
  reiniciarFormulario();
});

// Delegación para botones editar y eliminar en la tabla
tableBody.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("delete-btn")) {
    const index = Number(target.dataset.index);
    students.splice(index, 1);
    renderTabla();
    reiniciarFormulario();
  }

  if (target.classList.contains("edit-btn")) {
    const index = Number(target.dataset.index);
    const student = students[index];

    nameInput.value = student.name;
    lastNameInput.value = student.lastName;
    gradeInput.value = student.grade;

    editIndex = index;
    form.querySelector("button[type='submit']").textContent = "Guardar Cambios";
  }
});
