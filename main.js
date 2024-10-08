const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

// Database connection
var mysql = require("mysql2");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rajabhai",
  database: "supporthub",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});

// Middlewares
app.use("/public", express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/profile", (req, res) => {
  res.sendFile(__dirname + "/profile.html");
});

app.get("/registercomplaint", (req, res) => {
  res.sendFile(__dirname + "/registercomplaint.html");
});

app.get("/logout", (req, res) => {
  res.clearCookie("supporthubuser");
  res.redirect("/");
});

app.get("/checkstatus", (req, res) => {
  res.sendFile(__dirname + "/checkstatus.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

app.get("/messages", (req, res) => {
  res.sendFile(__dirname + "/message.html");
});

// APIs
app.post("/signupAccount", (req, res) => {
  const url = req.url;
  const q = url.split("?");
  const data = q[1].split("&");

  const name = data[0].split("=")[1];
  const id = data[1].split("=")[1];
  const pw = data[2].split("=")[1];

  con.query(
    "select * from users where id = '" + id + "'",
    function (err, result) {
      if (err) throw err;
      else {
        if (result.length > 0) {
          res.json({ error: "User already exists" });
        } else {
          con.query(
            "insert into users values ('" +
              name +
              "', '" +
              id +
              "', '" +
              pw +
              "')",
            function (err, result) {
              if (err) throw err;
              else {
                res.cookie("supporthubuser", id);
                res.json({
                  message: "Account created successfully",
                });
              }
            }
          );
        }
      }
    }
  );
});

app.post("/loginAccount", (req, res) => {
  const url = req.url;
  const q = url.split("?");
  const data = q[1].split("&");

  const id = data[0].split("=")[1];
  const pw = data[1].split("=")[1];

  con.query(
    "select * from users where id = '" + id + "'",
    function (err, result) {
      if (err) throw err;
      else {
        if (result.length == 0) {
          res.json({ message: "User not found" });
        } else {
          if (result[0].password.toLowerCase() == pw.toLowerCase()) {
            res.cookie("supporthubuser", id);
            res.json({ message: "Login successful" });
          } else {
            res.json({ message: "Incorrect password" });
          }
        }
      }
    }
  );
});

app.post("/registerComplaint", (req, res) => {
  const url = req.url;
  const q = url.split("?");
  const data = q[1].split("&");

  const id = data[1].split("=")[1];
  const title = data[0].split("=")[1];
  const text = data[2].split("=")[1];

  con.query(
    "insert into complaints values ('" +
      id +
      "', '" +
      title +
      "', '" +
      text +
      "')",
    function (err, result) {
      if (err) throw err;
      else {
        res.json({ status: "success" });
      }
    }
  );
});

app.get("/fetchUsers", (req, res) => {
  con.query("select * from users", function (err, result) {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/fetchComplaints", (req, res) => {
  con.query("select * from complaints", function (err, result) {
    if (err) throw err;
    else {
      res.json(result);
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("supporthubuser");
  res.redirect("/");
});

app.post("/insertMessage", (req, res) => {
  const { s_id, r_id, msg } = req.body;
  con.query(
    `insert into messages (sender_id, receiver_id, message) values ("${s_id}", "${r_id}", "${msg}")`,
    function (err, result) {
      if (err) throw err;
      else {
        res.json({ status: "success" });
      }
    }
  );
});

app.post("/getMessages", (req, res) => {
  const { rid, sid } = req.body;
  con.query(
    `select * from messages where receiver_id = "${rid}" and sender_id = "${sid}" or receiver_id = "${sid}" and sender_id = "${rid}" order by sent_at`,
    function (err, result) {
      if (err) throw err;
      else {
        res.json(result);
      }
    }
  );
});

app.post("/check_rid", (req, res) => {
  const { rid } = req.body;
  con.query(`select * from users where id = "${rid}"`, function (err, result) {
    if (err) throw err;
    else {
      if (result.length == 0) {
        res.json({ status: "error" });
      } else {
        res.json(result[0]);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
