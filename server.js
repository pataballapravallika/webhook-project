const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Webhook server running");
});

app.post("/github-webhook", (req, res) => {

    console.log("Webhook received");

    console.log(JSON.stringify(req.body, null, 2));

    // SEND RESPONSE IMMEDIATELY
    res.status(200).send("Success");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});