const express = require("express");
const server = express();
const createError = require("http-errors");
const mongoose = require("mongoose");
const logger = require("morgan");
const multer = require("multer");
const nodemailer = require("nodemailer");

const indexRoute = require("./routes/indexRoute");
const eventRoute = require("./routes/eventRoute");
const userRoute = require("./routes/userRoute");
const workshopRoute = require("./routes/workshopRoute");
const conventionRoute = require("./routes/conventionRoute");
const meetupsRoute = require("./routes/meetupsRoute");
const imgRoute = require("./routes/imgRoute");
const emailRoute = require("./routes/emailRoute");
const { cors } = require("./middleware/security");

const port = process.env.PORT || 4000;

mongoose.connect("mongodb://127.0.0.1:27017/devents", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", (err) => console.log(err));
mongoose.connection.on("open", () => console.log("database connected"));



server.use(express.json());
server.use(logger("dev"));
server.use(cors);
server.use(express.urlencoded({ extended: false }));



server.use("/", indexRoute);
server.use("/users", userRoute)
server.use("/events", eventRoute);
server.use("/workshops", workshopRoute);
server.use("/conventions", conventionRoute);
server.use("/meetups", meetupsRoute);
server.use("/image", imgRoute);
// server.use("/send-email", emailRoute);

server.post('/send-email', async (req, res) => {
    const { userName, userEmail, userMessage } = req.body;
    const contentHTML = `
        <h1>A user contacted you!</h1>
        <h2>User Information:</h2>
        <ul>
        <li>Username: ${userName}</li>
        <li>Email: ${userEmail}</li>
        </ul>
        <h2>Message:</h2>
        <p>${userMessage}</p>
        `;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_EMISOR,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    await transporter.sendMail({
        from: `${userName} <${userEmail}>`,
        to: "devents.team2020@gmail.com",
        subject: 'A user contacted you!',
        html: contentHTML
    });
    res.json({ status: true });
    console.log('and... message sent!!!');
});

server.use((req, res, next) => {
    next(createError(404));
});

server.use((err, req, res, next) => {
    res.json({ status: err.status, err: err.message });
});

server.listen(port, () => console.log(`server is running on port ${port}`));

