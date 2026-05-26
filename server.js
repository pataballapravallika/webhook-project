const express = require("express");

const app = express();

app.use(express.json());

app.post("/github-webhook", (req, res) => {

    console.log("Webhook received");

    console.log(req.body);

    res.status(200).send("Success");
});

app.get("/", (req, res) => {
    res.send("Webhook server running");
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
});