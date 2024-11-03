const cookie = document.cookie.split(";");
let gotCookie = false;
cookie.forEach((element) => {
    element = element.split("=");
    if (String(element[0]).trim() == "supporthubuser") {
        if (element[1].toLowerCase() == "admin") {
            document.querySelector("header nav ul").innerHTML = `
        <li><a href="/">Home</a></li>
        <li><a href="/profile">Hi, ${element[1]}</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="/logout">Logout</a></li>
        `;
        } else {
            document.querySelector("header nav ul").innerHTML = `
            <li><a href="/">Home</a></li>
            <li><a href="/profile">Hi, ${element[1]}</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="/registercomplaint">Complaint Register</a></li>
            <li><a href="/logout">Logout</a></li>
            `;
        }
        gotCookie = true;
    }
});
if (gotCookie === false) {
    window.location.href = "/login";
}

const userbtn = document.getElementById("userbtn");
const combtn = document.getElementById("combtn");
const users = document.getElementById("users");
const issues = document.getElementById("issues");
userbtn.addEventListener("click", () => {
    users.style.display = "block";
    issues.style.display = "none";
});
combtn.addEventListener("click", () => {
    users.style.display = "none";
    issues.style.display = "block";
});

document.querySelector("#complaintBox button").addEventListener("click", () => {
    document.querySelector("#complaintBox").style.display = "none";
});

document.querySelector("#solveItBox button").addEventListener("click", () => {
    document.querySelector("#solveItBox").style.display = "none";
    document.querySelector("#solveItBox").removeAttribute("class");
});

document.querySelector("#solveItBox input").addEventListener("click", (e) => {
    fetch("/sendSolution", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userID: e.target.parentElement.classList[0],
            solution: e.target.parentElement.querySelector("textarea").value,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.msg == "error") {
                alert("error");
            } else {
                alert("successfully sent the solution");
            }
        });
});

fetch("/fetchUsers")
    .then((res) => res.json())
    .then((data) => {
        data.forEach((element) => {
            const tr = document.createElement("tr");
            const tduserid = document.createElement("td");
            const tdname = document.createElement("td");
            tdname.textContent = element.name.replaceAll("%20", " ");
            tduserid.textContent = element.id;
            tr.appendChild(tduserid);
            tr.appendChild(tdname);
            document.querySelector("#users table").appendChild(tr);
        });
    });

fetch("/fetchComplaints")
    .then((res) => res.json())
    .then((data) => {
        data.forEach((element) => {
            const tr = document.createElement("tr");
            const tdcomplaintid = document.createElement("td");
            const tdcomplaint = document.createElement("td");
            const tdstatus = document.createElement("td");
            const tdaction = document.createElement("td");
            const viewbtn = document.createElement("button");
            const solvebtn = document.createElement("button");
            tdcomplaintid.textContent = element.id;
            tdcomplaint.textContent = element.title.replaceAll("%20", " ");
            viewbtn.textContent = "View Complaint";
            viewbtn.addEventListener("click", () => {
                document.querySelector("#complaintBox p").textContent =
                    element.text.replaceAll("%20", " ");
                document.querySelector("#solveItBox").style.display = "none";
                document.querySelector("#complaintBox").style.display = "block";
            });
            solvebtn.textContent = "Solve It";
            solvebtn.addEventListener("click", (e) => {
                let username =
                    e.target.parentElement.parentElement.querySelectorAll(
                        "td"
                    )[0].textContent;
                document.querySelector("#solveItBox").classList.add(username);
                document.querySelector("#complaintBox").style.display = "none";
                document.querySelector("#solveItBox").style.display = "block";
            });
            tdstatus.textContent = "Pending";
            tr.appendChild(tdcomplaintid);
            tr.appendChild(tdcomplaint);
            tr.appendChild(tdstatus);
            tdaction.appendChild(viewbtn);
            tdaction.appendChild(solvebtn);
            tr.appendChild(tdaction);
            document.querySelector("#issues table").appendChild(tr);
        });
    });
