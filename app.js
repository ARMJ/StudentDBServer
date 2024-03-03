require("dotenv").config();
require('express-async-errors');

const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors')
const app = express();
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const studentRouter = require("./routes/student");
const bodyParser = require('body-parser');

app.use(express.json());

app.use(
    bodyParser.text({
        type: '/',
    })
);

app.use(cors())
app.use("/api/v1", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/student", studentRouter);

const port = process.env.PORT || 5000;

const start = async () => {

    try {        
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })

    } catch (error) {
       console.log(error); 
    }
}

start();

