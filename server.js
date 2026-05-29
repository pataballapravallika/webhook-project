const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Webhook server running");
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post("/github-webhook", async (req, res) => {

    try {

        console.log("Webhook received");

        const commits = req.body.commits || [];

        const commitMessages = commits
            .map(commit => `• ${commit.message}`)
            .join("\n");

        const repo = req.body.repository.full_name;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.TO_EMAIL,
            subject: "New GitHub Push Event",
            text: `
Repository: ${repo}

Commit Messages:
${commitMessages}
            `
        });

        console.log("Email sent successfully");

        res.status(200).send("Success");

    } catch (error) {

        console.error(error);

        res.status(500).send("Error sending mail");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});