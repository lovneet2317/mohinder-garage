/* =========================================================
   MOHINDER'S GARAGE
   VEHICLE MANAGEMENT SYSTEM
   ========================================================= */


/* ================= DATA ================= */

let vehicles =
    JSON.parse(localStorage.getItem("vehicles")) || [];


/* ================= ELEMENTS ================= */

const vehicleForm =
    document.getElementById("vehicleForm");

const vehicleList =
    document.getElementById("vehicleList");

const searchInput =
    document.getElementById("searchInput");

const emptyMessage =
    document.getElementById("emptyMessage");


/* ================= SAVE ================= */

function saveData() {

    localStorage.setItem(
        "vehicles",
        JSON.stringify(vehicles)
    );

}


/* ================= ADD VEHICLE ================= */

vehicleForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("vehicleInput")
                .value
                .trim();


        const lastService =
            document
                .getElementById("lastService")
                .value;


        const kmDriven =
            document
                .getElementById("kmDriven")
                .value;


        const parts =
            document
                .getElementById("partsInstalled")
                .value
                .trim();


        const cost =
            document
                .getElementById("serviceCost")
                .value;


        const status =
            document
                .getElementById("vehicleStatus")
                .value;


        if (!name) {

            alert(
                "Please enter the vehicle name."
            );

            return;

        }


        const vehicle = {

            id: Date.now(),

            name: name,

            lastService:
                lastService ||
                "Not available",

            kmDriven:
                kmDriven || "0",

            partsInstalled:
                parts ||
                "No parts recorded",

            serviceCost:
                Number(cost) || 0,

            status: status,

            history: [

                {

                    date:
                        new Date()
                            .toLocaleString(),

                    action:
                        "Vehicle added",

                    cost:
                        Number(cost) || 0

                }

            ]

        };


        vehicles.push(vehicle);


        saveData();

        displayVehicles();

        updateDashboard();


        vehicleForm.reset();


        /*
            Scroll to vehicle section
            after adding a vehicle.
        */

        document
            .getElementById("vehicles")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* ================= DISPLAY ================= */

function displayVehicles(
    searchTerm = ""
) {

    vehicleList.innerHTML = "";


    const search =
        searchTerm
            .toLowerCase()
            .trim();


    const filtered =
        vehicles.filter(vehicle => {

            return vehicle.name
                .toLowerCase()
                .includes(search);

        });


    if (filtered.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    filtered.forEach(vehicle => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "vehicle-card";


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

                    <span>
                        KM Driven
                    </span>

                    <strong>
                        ${Number(
                            vehicle.kmDriven
                        ).toLocaleString()}
                        km
                    </strong>

                </div>


                <div>

                    <span>
                        Parts / Work
                    </span>

                    <strong>
                        ${escapeHTML(
                            vehicle.partsInstalled
                        )}
                    </strong>

                </div>


                <div>

                    <span>
                        Service Cost
                    </span>

                    <strong>
                        ₹${Number(
                            vehicle.serviceCost
                        ).toLocaleString()}
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

                <h4>
                    Service History
                </h4>

                ${renderHistory(vehicle)}

            </div>

        `;


        vehicleList.appendChild(card);

    });

}


/* ================= HISTORY ================= */

function renderHistory(vehicle) {

    if (
        !vehicle.history ||
        vehicle.history.length === 0
    ) {

        return `
            <p class="no-history">
                No service history available.
            </p>
        `;

    }


    return vehicle.history
        .slice()
        .reverse()
        .map(entry => {

            return `

                <div class="history-item">

                    <div>

                        <strong>
                            ${escapeHTML(
                                entry.action
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                entry.date
                            )}
                        </small>

                    </div>

                    <span>
                        ₹${Number(
                            entry.cost || 0
                        ).toLocaleString()}
                    </span>

                </div>

            `;

        })
        .join("");

}


/* ================= TOGGLE HISTORY ================= */

function toggleHistory(id) {

    const history =
        document.getElementById(
            `history-${id}`
        );


    if (
        history.style.display ===
        "none"
    ) {

        history.style.display =
            "block";

    } else {

        history.style.display =
            "none";

    }

}


/* ================= EDIT ================= */

function editVehicle(id) {

    const vehicle =
        vehicles.find(
            item => item.id === id
        );


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


    vehicle.history.push({

        date:
            new Date()
                .toLocaleString(),

        action:
            "Vehicle information updated",

        cost:
            Number(vehicle.serviceCost) || 0

    });


    vehicle.name =
        newName.trim() ||
        vehicle.name;


    vehicle.lastService =
        newService ||
        vehicle.lastService;


    vehicle.kmDriven =
        newKm ||
        vehicle.kmDriven;


    vehicle.partsInstalled =
        newParts ||
        vehicle.partsInstalled;


    vehicle.serviceCost =
        Number(newCost) ||
        vehicle.serviceCost;


    saveData();

    displayVehicles(
        searchInput.value
    );

    updateDashboard();

}


/* ================= DELETE ================= */

function deleteVehicle(id) {

    const vehicle =
        vehicles.find(
            item => item.id === id
        );


    if (!vehicle) return;


    const confirmation =
        confirm(
            `Delete ${vehicle.name} from the garage?`
        );


    if (!confirmation) return;


    vehicles =
        vehicles.filter(
            item => item.id !== id
        );


    saveData();

    displayVehicles(
        searchInput.value
    );

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
            (total, vehicle) => {

                return total +
                    (
                        vehicle.history
                            ?.length || 0
                    );

            },
            0
        );


    const totalCost =
        vehicles.reduce(
            (total, vehicle) => {

                return total +
                    Number(
                        vehicle.serviceCost || 0
                    );

            },
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

    switch (status) {

        case "Completed":
            return "completed";

        case "In Service":
            return "in-service";

        default:
            return "pending";

    }

}


/* ================= HTML SECURITY ================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ================= INITIALIZE ================= */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        displayVehicles();

        updateDashboard();

    }
);
