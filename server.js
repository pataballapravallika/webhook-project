require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Webhook server running");
});

const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
const emailPass = (process.env.EMAIL_PASS || process.env.APP_PASSWORD || "").replace(/\s+/g, "");
const toEmail = process.env.TO_EMAIL;

if (!emailUser || !emailPass) {
    console.error("Missing email configuration. Set EMAIL_USER/EMAIL_PASS or EMAIL/APP_PASSWORD.");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

app.post("/github-webhook", async (req, res) => {

    try {

        console.log("Webhook received");

        const commits = Array.isArray(req.body.commits) ? req.body.commits : [];

        const commitMessages = commits
            .map(commit => `• ${commit.message || "(no commit message)"}`)
            .join("\n") || "No commits included";

        const repo = req.body.repository?.full_name || "unknown repository";

        if (!emailUser || !emailPass) {
            throw new Error("Email configuration is missing");
        }

        if (!toEmail) {
            throw new Error("TO_EMAIL is missing");
        }

        await transporter.sendMail({
            from: emailUser,
            to: toEmail,
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

        res.status(500).send(error.message || "Error sending mail");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});