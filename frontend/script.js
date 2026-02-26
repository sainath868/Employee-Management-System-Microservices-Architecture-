const API_BASE = "http://localhost:8080";

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const message = document.getElementById("loginMessage");
        if (!response.ok) {
            message.textContent = "Login failed";
            return;
        }

        const payload = await response.json();
        localStorage.setItem("token", payload.token);
        window.location.href = "index.html";
    });
}

const employeeForm = document.getElementById("employeeForm");
const employeesContainer = document.getElementById("employees");

function authHeaders(extra = {}) {
    return {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...extra
    };
}

async function fetchEmployees() {
    if (!employeesContainer) return;

    const response = await fetch(`${API_BASE}/employees`, {
        headers: authHeaders()
    });

    if (!response.ok) {
        employeesContainer.innerHTML = "<p>Unable to load employees.</p>";
        return;
    }

    const employees = await response.json();
    employeesContainer.innerHTML = "";

    employees.forEach((employee) => {
        const card = document.createElement("div");
        card.className = "employee-card";
        card.innerHTML = `
            ${employee.photoPath ? `<img src="${API_BASE}/files/${employee.photoPath}" alt="${employee.name}" />` : ""}
            <h3>${employee.name}</h3>
            <p><strong>Department:</strong> ${employee.department}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>Salary:</strong> ${employee.salary}</p>
            <input type="file" id="file-${employee.id}" />
            <button data-upload="${employee.id}">Upload Photo</button>
            <button class="danger" data-delete="${employee.id}">Delete</button>
        `;
        employeesContainer.appendChild(card);
    });
}

if (employeeForm) {
    employeeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById("name").value,
            department: document.getElementById("department").value,
            salary: Number(document.getElementById("salary").value),
            email: document.getElementById("email").value
        };

        await fetch(`${API_BASE}/employees`, {
            method: "POST",
            headers: authHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(payload)
        });

        employeeForm.reset();
        fetchEmployees();
    });

    document.getElementById("refreshBtn").addEventListener("click", fetchEmployees);

    employeesContainer.addEventListener("click", async (e) => {
        const uploadId = e.target.getAttribute("data-upload");
        const deleteId = e.target.getAttribute("data-delete");

        if (uploadId) {
            const fileInput = document.getElementById(`file-${uploadId}`);
            if (!fileInput.files.length) return;
            const data = new FormData();
            data.append("file", fileInput.files[0]);

            await fetch(`${API_BASE}/employees/${uploadId}/photo`, {
                method: "POST",
                headers: authHeaders(),
                body: data
            });
            fetchEmployees();
        }

        if (deleteId) {
            await fetch(`${API_BASE}/employees/${deleteId}`, {
                method: "DELETE",
                headers: authHeaders()
            });
            fetchEmployees();
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    } else {
        fetchEmployees();
    }
}
