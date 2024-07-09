const express = require("express");
const path = require("path");
const fs = require("fs");
const pathToFile = path.join(__dirname, "data.json");
if (!fs.existsSync(pathToFile)) {
  const data = [];
  const newData = JSON.stringify(data, null, 2);
  fs.writeFileSync("data.json", newData);
}

const app = express();

const { checkBody, checkParams } = require("./validation/validator");
const { idScheme, userSchema } = require("./validation/scheme");
const users = JSON.parse(fs.readFileSync(pathToFile, "utf-8"));

let uniqueID = 0;
if (users.length > 0) {
  if (users[users.length - 1].id > 0) {
    uniqueID = users[users.length - 1].id;
  }
}

app.use(express.json());

app.get("/users", (req, res) => {
  res.send({ users });
});

app.get("/users/:id", checkParams(idScheme), (req, res) => {
  const user = users.find((user) => user.id === Number(req.params.id));
  if (user) {
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
});

app.post("/users", checkBody(userSchema), (req, res) => {
  uniqueID += 1;
  users.push({ id: uniqueID, ...req.body });
  const newData = JSON.stringify(users, null, 2);
  fs.writeFileSync("data.json", newData);
  res.send({ id: uniqueID });
});

app.put(
  "/users/:id",
  checkParams(idScheme),
  checkBody(userSchema),
  (req, res) => {
    const user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
      const { firstName, secondName, age, city } = req.body;
      user.firstName = firstName;
      user.secondName = secondName;
      user.age = age;
      user.city = city;
      const newData = JSON.stringify(users, null, 2);
      fs.writeFileSync("data.json", newData);
      res.send({ user });
    } else {
      res.status(404);
      res.send({ user: null });
    }
  }
);

app.delete("/users/:id", checkParams(idScheme), (req, res) => {
  const user = users.find((user) => user.id === Number(req.params.id));

  if (user) {
    const userIndex = users.indexOf(user);
    users.splice(userIndex, 1);
    const newData = JSON.stringify(users, null, 2);
    fs.writeFileSync("data.json", newData);
    res.send({ user });
  } else {
    res.status(404);
    res.send({ user: null });
  }
});
app.use((req, res) => {
  res.status(404).send({
    messege: "URL not found!",
  });
});
app.listen(3000);
