const input_message = document.getElementById("input_message");
const sendBTN = document.getElementById("sendBTN");
const chat_section = document.getElementById("chat_section");
const cookies = document.cookie.split(";");

let supportHubUser = null;
cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name === "supporthubuser") {
        supportHubUser = value;
    }
});
const rid = new URLSearchParams(window.location.search).get("rid");
fetch("/check_rid", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        rid: rid,
    }),
})
    .then((response) => response.json())
    .then((data) => {
        if (data.status == "error") {
            window.location.href = "/";
        } else {
            document.getElementById("receiver_name").textContent =
                data.name.replaceAll("%20", " ");
            document.getElementById("r_id").textContent = data.id;
        }
    });

input_message.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const message = input_message.value;
        fetch("/insertMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                s_id: supportHubUser,
                r_id: rid,
                msg: message,
            }),
        });
        input_message.value = "";
        fetch_messages();
    }
});
sendBTN.addEventListener("click", () => {
    const message = input_message.value;
    fetch("/insertMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            s_id: supportHubUser,
            r_id: rid,
            msg: message,
        }),
    });
    input_message.value = "";
    fetch_messages();
});

const fetch_messages = () => {
    fetch("/getMessages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            rid: rid,
            sid: supportHubUser,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            chat_section.innerHTML = "";
            data.forEach((msg) => {
                const p = document.createElement("p");
                p.id = msg.id;
                if (msg.sender_id == supportHubUser) {
                    p.className = "sender";

                    const ebtn = document.createElement("btn");
                    const eIMG = document.createElement("img");
                    eIMG.src = "/public/images/edit.png";
                    eIMG.style.position = "relative";
                    eIMG.style.height = "100%";
                    ebtn.classList.add("edit-btn");
                    ebtn.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                    ebtn.style.height = "20px";
                    ebtn.style.padding = "5px";
                    ebtn.style.borderRadius = "5px";
                    ebtn.appendChild(eIMG);
                    ebtn.addEventListener("click", () => {
                        editBTN(ebtn);
                    });

                    const dbtn = document.createElement("btn");
                    const dIMG = document.createElement("img");
                    dIMG.src = "/public/images/red-delete.png";
                    dIMG.style.position = "relative";
                    dIMG.style.height = "100%";
                    dbtn.classList.add("delete-btn");
                    dbtn.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                    dbtn.style.height = "20px";
                    dbtn.style.padding = "5px";
                    dbtn.style.borderRadius = "5px";
                    dbtn.appendChild(dIMG);
                    dbtn.addEventListener("click", () => {
                        deleteBTN(dbtn);
                    });

                    const l = document.createElement("label");
                    l.textContent = msg.message;

                    p.appendChild(ebtn);
                    p.appendChild(dbtn);
                    p.appendChild(l);
                } else {
                    p.textContent = msg.message;
                    p.className = "receiver";
                }
                chat_section.appendChild(p);
            });
        });
};

fetch_messages();
setInterval(fetch_messages, 1000);

function deleteBTN(b) {
    console.log(b.parentElement.id);
    fetch("/deleteMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messageID: b.parentElement.id,
        }),
    });
}

function editBTN(b) {
    const editINPUT = document.querySelector("#editINPUT");
    editINPUT.style.display = "block";
    editINPUT.value = b.parentElement.querySelector("label").textContent;
    editINPUT.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            editINPUT.style.display = "none";
            fetch("/editMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messageID: b.parentElement.id,
                    newMessage: editINPUT.value,
                }),
            });
        }
    });
}
