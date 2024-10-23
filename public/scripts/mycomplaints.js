var uid;
document.cookie.split(";").forEach((e) => {
    if (e.trim().split("=")[0] == "supporthubuser") {
        uid = e.trim().split("=")[1];
    }
});

fetch("/fetchMyComplaints", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        id: uid,
    }),
})
    .then((res) => res.json())
    .then((data) => {
        data.forEach((complaint) => {
            const tr = document.createElement("tr");
            const title = document.createElement("td");
            const desc = document.createElement("td");
            const status = document.createElement("td");
            const action = document.createElement("td");
            const btn1 = document.createElement("button");
            const btn2 = document.createElement("button");

            btn1.textContent = "View Solution";
            btn1.addEventListener("click", () => {
                viewComplaint(complaint.solution);
            });
            btn1.style.backgroundColor = "rgb(160, 160, 160)";
            if (complaint.status == "pending") {
                btn2.textContent = "Mark As Solved";
                btn2.style.backgroundColor = "#29ab87";
                btn1.addEventListener("click", () => {
                    markAsCompleted();
                });
            } else {
                btn2.style.display = "none";
            }

            action.classList.add("action");
            action.appendChild(btn1);
            action.appendChild(btn2);

            tr.classList.add(complaint.status);
            title.textContent = complaint.title.replaceAll("%20", " ");
            desc.textContent = complaint.text.replaceAll("%20", " ");
            status.textContent = complaint.status;

            tr.appendChild(title);
            tr.appendChild(desc);
            tr.appendChild(status);
            tr.appendChild(action);

            document.querySelector("table").appendChild(tr);
        });
    });

function viewComplaint(solution_description) {
    if (solution_description == null) {
        document.querySelector("#viewcomplaint p").innerHTML =
            "Solution Not Provided";
    } else {
        document.querySelector("#viewcomplaint p").textContent =
            solution_description;
    }
    document.querySelector("#viewcomplaint").style.display = "block";
}

function markAsCompleted() {}

document.querySelector("#closeviewcomplaint").addEventListener("click", () => {
    document.querySelector("#viewcomplaint").style.display = "none";
});
