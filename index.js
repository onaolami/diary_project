const express = require("express");
const app = express();
const auth = require("./routes/auth");
const diary = require("./routes/diary")
const verifyAuth = require("./middleware/verifyAuth")


app.use(express.json());
app.use("/auth",auth);
app.use("/diary",verifyAuth, diary);



app.listen(5001,()=>{
    console.log("server is still running on port 5001")
})