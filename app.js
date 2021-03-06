const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const authRouter = require("./routes/auth");
const todoRouter = require("./routes/todo");

const app = express();
app.use(require("cors")());
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const host = '0.0.0.0';
    const port = process.env.PORT || 3000;
    
    app.listen(port, host, () =>
      console.log(`App has been started on port ${port}`)
    );
  } catch (e) {
    console.log("Server error", e.message);
    process.exit();
  }
}

app.use(express.json({
  extended: true
}));

app.use("/auth", authRouter);
app.use("/todo", todoRouter);

startServer();