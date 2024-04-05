//mongoDB connection
require("./config/db");

const app = require("express")();
const cors = require("cors");
const port = process.env.PORT || 3000;

const UserRouter = require("./api/User");

//Accepting post form data
const bodyParser = require("express").json;
app.use(bodyParser());

app.use(cors());

app.use("/user", UserRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
