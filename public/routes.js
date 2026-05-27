const API_URL = "http://localhost:3000/aircrafts";

const airports = [
  {
    code: "BUD",
    name: "Budapest",
    lat: 47.4979,
    lon: 19.0402,
  },
  {
    code: "LHR",
    name: "London Heathrow",
    lat: 51.47,
    lon: -0.4543,
  },
  {
    code: "JFK",
    name: "New York JFK",
    lat: 40.6413,
    lon: -73.7781,
  },
  {
    code: "CDG",
    name: "Paris Charles de Gaulle",
    lat: 49.0097,
    lon: 2.5479,
  },
  {
    code: "DXB",
    name: "Dubai International",
    lat: 25.2532,
    lon: 55.3657,
  },
];
function populateAirports() {
  const from = document.getElementById("from");
  const to = document.getElementById("to");

  airports.forEach((airport) => {
    const option1 = document.createElement("option");
    option1.value = airport.code;
    option1.textContent = `${airport.name} (${airport.code})`;

    const option2 = option1.cloneNode(true);

    from.appendChild(option1);
    to.appendChild(option2);
  });
}

//Haversine formula : d=2rarcsin(sin2(2φ2​−φ1​​)+cos(φ1​)cos(φ2​)sin2(2λ2​−λ1​​))

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);   

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
async function calculateRoute() {
  const fromCode = document.getElementById("from").value;
  const toCode = document.getElementById("to").value;

  if (fromCode === toCode) {
    alert("Choose different airports!");
    return;
  }

  const fromAirport = airports.find((a) => a.code === fromCode);
  const toAirport = airports.find((a) => a.code === toCode);

  const distance = calculateDistance(
    fromAirport.lat,
    fromAirport.lon,
    toAirport.lat,
    toAirport.lon,
  );

  const response = await fetch(API_URL);
  const aircrafts = await response.json();

  const availableAircrafts = aircrafts.filter(
    (aircraft) => aircraft.range >= distance,
  );
  document.getElementById("route-info").innerHTML = `
    <div class="alert alert-info shadow-sm">
      <strong>${fromAirport.name}</strong>
      →
      <strong>${toAirport.name}</strong>
      <br>
      Distance: <strong>${distance} km</strong>
    </div>
  `;

  const results = document.getElementById("results");

  results.innerHTML = "";

  if (availableAircrafts.length === 0) {
    results.innerHTML = `
      <div class="alert alert-danger">
        No aircraft can complete this route.
      </div>
    `;

    return;
  }
  availableAircrafts.forEach((aircraft) => {
    const flightTime = (distance / aircraft.maxSpeed).toFixed(1);

    results.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow-sm h-100 border-0">

          <img
            src="${aircraft.imageUrl}"
            class="card-img-top"
            style="height:250px; object-fit:contain; padding:10px; background:#f8f9fa;"
          >

          <div class="card-body">
            <h5>${aircraft.name}</h5>

            <p class="mb-1">
              <strong>Factory:</strong> ${aircraft.factory}
            </p>

            <p class="mb-1">
              <strong>Range:</strong> ${aircraft.range} km
            </p>

            <p class="mb-1">
              <strong>Max Speed:</strong> ${aircraft.maxSpeed} km/h
            </p>

            <p class="mb-0">
              <strong>Estimated Flight Time:</strong>
              ${flightTime} hours
            </p>
          </div>

        </div>
      </div>
    `;
  });
}

populateAirports();
