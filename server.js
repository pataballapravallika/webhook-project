const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    }
});

app.post('/github-webhook', async (req, res) => {
    try {
        const commits = req.body.commits || [];

        if (commits.length === 0) {
            return res.status(200).send('No commits');
        }

        const commitMessages = commits
            .map(c => `- ${c.message}`)
            .join('\n');

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.TO_EMAIL,
            subject: 'New GitHub Commit',
            text: `
Repository: ${req.body.repository.full_name}

Branch: ${req.body.ref}

Commits:
${commitMessages}
            `
        };

        await transporter.sendMail(mailOptions);

        console.log('Email sent');

        res.status(200).send('Webhook received');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});