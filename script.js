/* =========================================================
   MOHINDER'S GARAGE
   Vehicle Management System
   ========================================================= */


/* ================= DATA ================= */

let vehicles =
    JSON.parse(localStorage.getItem("vehicles")) || [];


/* ================= DOM ELEMENTS ================= */

const vehicleForm =
    document.getElementById("vehicleForm");

const vehicleList =
    document.getElementById("vehicleList");

const searchInput =
    document.getElementById("searchInput");

const emptyMessage =
    document.getElementById("emptyMessage");


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        "vehicles",
        JSON.stringify(vehicles)
    );

}


/* ================= ADD VEHICLE ================= */

vehicleForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const vehicleName =
        document.getElementById("vehicleInput").value.trim();

    const lastService =
        document.getElementById("lastService").value;

    const kmDriven =
        document.getElementById("kmDriven").value;

    const partsInstalled =
        document.getElementById("partsInstalled").value.trim();

    const serviceCost =
        document.getElementById("serviceCost").value;

    const status =
        document.getElementById("vehicleStatus").value;


    if (!vehicleName) {

        alert("Please enter the vehicle name.");

        return;

    }


    const vehicle = {

        id: Date.now(),

        name: vehicleName,

        lastService: lastService || "Not available",

        kmDriven: kmDriven || "0",

        partsInstalled:
            partsInstalled || "No parts recorded",

        serviceCost:
            Number(serviceCost) || 0,

        status: status,

        history: [

            {
                date: new Date().toLocaleString(),

                action: "Vehicle added",

                cost: Number(serviceCost) || 0

            }

        ]

    };


    vehicles.push(vehicle);


    saveData();

    displayVehicles();

    updateDashboard();


    vehicleForm.reset();

});


/* ================= DISPLAY VEHICLES ================= */

function displayVehicles(searchTerm = "") {

    vehicleList.innerHTML = "";


    const filteredVehicles =
        vehicles.filter(vehicle => {

            const search =
                searchTerm.toLowerCase();

            return (

                vehicle.name
                    .toLowerCase()
                    .includes(search)

            );

        });


    if (filteredVehicles.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    filteredVehicles.forEach(vehicle => {

        const card =
            document.createElement("article");

        card.className = "vehicle-card";


        card.innerHTML = `

            <div class="vehicle-top">

                <div>

                    <span class="vehicle-icon">
                        🚗
                    </span>

                    <div class="vehicle-title">

                        <h3>
                            ${escapeHTML(vehicle.name)}
                        </h3>

                        <p>
                            Last Service:
                            ${escapeHTML(vehicle.lastService)}
                        </p>

                    </div>

                </div>


                <span class="status ${getStatusClass(vehicle.status)}">

                    ${escapeHTML(vehicle.status)}

                </span>

            </div>


            <div class="vehicle-info">

                <div>

                    <span>KM Driven</span>

                    <strong>
                        ${Number(vehicle.kmDriven).toLocaleString()}
                        km
                    </strong>

                </div>


                <div>

                    <span>Parts / Work</span>

                    <strong>
                        ${escapeHTML(vehicle.partsInstalled)}
                    </strong>

                </div>


                <div>

                    <span>Service Cost</span>

                    <strong>
                        ₹${Number(vehicle.serviceCost).toLocaleString()}
                    </strong>

                </div>

            </div>


            <div class="vehicle-actions">

                <button
                    class="details-btn"
                    onclick="toggleHistory(${vehicle.id})"
                >
                    📋 History
                </button>


                <button
                    class="edit-btn"
                    onclick="editVehicle(${vehicle.id})"
                >
                    ✏️ Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteVehicle(${vehicle.id})"
                >
                    🗑 Delete
                </button>

            </div>


            <div
                id="history-${vehicle.id}"
                class="history-panel"
                style="display:none"
            >

                <h4>Service History</h4>

                ${renderHistory(vehicle)}

            </div>

        `;


        vehicleList.appendChild(card);

    });

}


/* ================= SERVICE HISTORY ================= */

function renderHistory(vehicle) {

    if (!vehicle.history ||
        vehicle.history.length === 0) {

        return `
            <p class="no-history">
                No service history available.
            </p>
        `;

    }


    return vehicle.history
        .slice()
        .reverse()
        .map(entry => `

            <div class="history-item">

                <div>

                    <strong>
                        ${escapeHTML(entry.action)}
                    </strong>

                    <small>
                        ${escapeHTML(entry.date)}
                    </small>

                </div>


                <span>
                    ₹${Number(entry.cost || 0).toLocaleString()}
                </span>

            </div>

        `)
        .join("");

}


/* ================= TOGGLE HISTORY ================= */

function toggleHistory(id) {

    const history =
        document.getElementById(`history-${id}`);


    if (history.style.display === "none") {

        history.style.display = "block";

    } else {

        history.style.display = "none";

    }

}


/* ================= EDIT VEHICLE ================= */

function editVehicle(id) {

    const vehicle =
        vehicles.find(v => v.id === id);


    if (!vehicle) return;


    const newName =
        prompt(
            "Vehicle name:",
            vehicle.name
        );


    if (newName === null) return;


    const newService =
        prompt(
            "Last service date:",
            vehicle.lastService
        );


    const newKm =
        prompt(
            "Kilometers driven:",
            vehicle.kmDriven
        );


    const newParts =
        prompt(
            "Parts / work done:",
            vehicle.partsInstalled
        );


    const newCost =
        prompt(
            "Service cost:",
            vehicle.serviceCost
        );


    /* Save previous data to history */

    vehicle.history.push({

        date: new Date().toLocaleString(),

        action: "Vehicle information updated",

        cost: Number(vehicle.serviceCost) || 0

    });


    vehicle.name =
        newName.trim() || vehicle.name;

    vehicle.lastService =
        newService || vehicle.lastService;

    vehicle.kmDriven =
        newKm || vehicle.kmDriven;

    vehicle.partsInstalled =
        newParts || vehicle.partsInstalled;

    vehicle.serviceCost =
        Number(newCost) || vehicle.serviceCost;


    saveData();

    displayVehicles(searchInput.value);

    updateDashboard();

}


/* ================= DELETE VEHICLE ================= */

function deleteVehicle(id) {

    const vehicle =
        vehicles.find(v => v.id === id);


    if (!vehicle) return;


    const confirmed =
        confirm(
            `Delete ${vehicle.name} from the garage?`
        );


    if (!confirmed) return;


    vehicles =
        vehicles.filter(v => v.id !== id);


    saveData();

    displayVehicles(searchInput.value);

    updateDashboard();

}


/* ================= SEARCH ================= */

searchInput.addEventListener(
    "input",
    function () {

        displayVehicles(
            this.value
        );

    }
);


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const totalVehicles =
        vehicles.length;


    const totalServices =
        vehicles.reduce(
            (total, vehicle) =>
                total + (vehicle.history?.length || 0),
            0
        );


    const totalCost =
        vehicles.reduce(
            (total, vehicle) =>
                total + Number(vehicle.serviceCost || 0),
            0
        );


    document.getElementById(
        "totalVehicles"
    ).textContent =
        totalVehicles;


    document.getElementById(
        "totalServices"
    ).textContent =
        totalServices;


    document.getElementById(
        "totalCost"
    ).textContent =
        `₹${totalCost.toLocaleString()}`;

}


/* ================= STATUS ================= */

function getStatusClass(status) {

    if (status === "Completed") {

        return "completed";

    }

    if (status === "In Service") {

        return "in-service";

    }

    return "pending";

}


/* ================= SECURITY ================= */

/*
   Prevent HTML entered by a user from being
   interpreted as actual HTML.
*/

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ================= INITIALIZE ================= */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        displayVehicles();

        updateDashboard();

    }
);
