const API_URL = "http://localhost:3000/aircrafts";

async function loadAircrafts() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const aircraftList = document.getElementById("aircraft-list");
  aircraftList.innerHTML = "";

  data.forEach((aircraft) => {
    aircraftList.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">

          <img 
            id="img-${aircraft.id}"
            src="${aircraft.imageUrl}" 
            class="card-img-top img-fluid"
            alt="${aircraft.name}"
            style="
              height: 250px;
              width: 100%;
              object-fit: contain;
              background-color: #f8f9fa;
              padding: 10px;
            "
          >

          <div class="card-body">

            <label class="form-label fw-bold">Image URL</label>
            <input id="imageUrl-${aircraft.id}" class="form-control mb-2"
              value="${aircraft.imageUrl}" disabled>

            <label class="form-label fw-bold">Name</label>
            <input id="name-${aircraft.id}" class="form-control mb-2"
              value="${aircraft.name}" disabled>

            <label class="form-label fw-bold">Factory</label>
            <input id="factory-${aircraft.id}" class="form-control mb-2"
              value="${aircraft.factory}" disabled>

            <label class="form-label fw-bold">Type</label>
            <input id="type-${aircraft.id}" class="form-control mb-2"
              value="${aircraft.type}" disabled>

            <label class="form-label fw-bold">Capacity</label>
            <input type="number" id="capacity-${aircraft.id}"
              class="form-control mb-2"
              value="${aircraft.capacity}" disabled>

            <label class="form-label fw-bold">Max Speed</label>
            <input type="number" id="maxSpeed-${aircraft.id}"
              class="form-control mb-2"
              value="${aircraft.maxSpeed}" disabled>

            <label class="form-label fw-bold">Range</label>
            <input type="number" id="range-${aircraft.id}"
              class="form-control mb-2"
              value="${aircraft.range}" disabled>

          </div>

          <div class="card-footer d-flex justify-content-between">

            <button 
              id="edit-btn-${aircraft.id}"
              class="btn btn-primary btn-sm"
              onclick="toggleEdit(${aircraft.id})"
            >
              Edit
            </button>

            <button 
              class="btn btn-danger btn-sm"
              onclick="deleteAircraft(${aircraft.id})"
            >
              Delete
            </button>

          </div>

        </div>
      </div>
    `;
  });
}

async function toggleEdit(id) {
  const fields = [
    document.getElementById(`imageUrl-${id}`),
    document.getElementById(`name-${id}`),
    document.getElementById(`factory-${id}`),
    document.getElementById(`type-${id}`),
    document.getElementById(`capacity-${id}`),
    document.getElementById(`maxSpeed-${id}`),
    document.getElementById(`range-${id}`),
  ];

  const capacity = Number(fields[4].value);
  const maxSpeed = Number(fields[5].value);
  const range = Number(fields[6].value);

  const button = document.getElementById(`edit-btn-${id}`);
  const editing = !fields[0].disabled;

  if (editing) {
    if (
      !fields[0].value ||
      !fields[1].value ||
      !fields[2].value ||
      !fields[3].value
    ) {
      alert("All fields are required!");
      return;
    }

    if (isNaN(capacity) || isNaN(maxSpeed) || isNaN(range)) {
      alert("Numeric values must be numbers!");
      return;
    }

    if (capacity <= 0 || maxSpeed <= 0 || range <= 0) {
      alert("Capacity, max speed, and range values must be greater than 0!");
      return;
    }

    const updatedAircraft = {
      imageUrl: fields[0].value,
      name: fields[1].value,
      factory: fields[2].value,
      type: fields[3].value,
      capacity,
      maxSpeed,
      range,
    };

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAircraft),
    });

    document.getElementById(`img-${id}`).src = fields[0].value;

    fields.forEach((field) => (field.disabled = true));

    button.textContent = "Edit";
    button.classList.remove("btn-success");
    button.classList.add("btn-primary");

    return;
  }

  fields.forEach((field) => (field.disabled = false));

  button.textContent = "Save";
  button.classList.remove("btn-primary");
  button.classList.add("btn-success");
}

async function deleteAircraft(id) {
  if (!confirm("Delete this aircraft?")) return;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  loadAircrafts();
}

async function addAircraft() {
  const newAircraft = {
    imageUrl:
      "https://img.magnific.com/free-psd/isolated-plane-details_23-2151839970.jpg?semt=ais_hybrid&w=740&q=80",
    name: "New Aircraft",
    factory: "Factory",
    type: "Passenger",
    capacity: 100,
    maxSpeed: 800,
    range: 3000,
  };

  if (
    newAircraft.capacity <= 0 ||
    newAircraft.maxSpeed <= 0 ||
    newAircraft.range <= 0
  ) {
    alert("Capacity, max speed, and range values must be greater than 0!");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAircraft),
  });

  loadAircrafts();
}

loadAircrafts();
