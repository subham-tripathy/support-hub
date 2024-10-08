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
// if (rid == null || rid == "" || rid == supportHubUser) {
//   window.location.href = "/";
// }
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
  console.log(e.key);
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
        p.textContent = msg.message;
        if (msg.sender_id == supportHubUser) {
          p.className = "sender";
        } else {
          p.className = "receiver";
        }
        chat_section.appendChild(p);
      });
    });
};

fetch_messages();

setInterval(fetch_messages, 1000);
