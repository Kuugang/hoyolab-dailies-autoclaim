const { exec } = require('child_process');
const express = require("express");
const app = express();
const port = 6969

app.get("/", (req, res) => {
    res.send("Wow")
});

app.get("/claim", (req, res) => {
    claim()
});

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    install()
});

function claim() {
    const command = 'npx playwright test index.spec.js';
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing the command: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Command produced an error: ${stderr}`);
            return;
        }
        console.log(`Command output:\n${stdout}`);
    });
}

function install() {
    const command = 'npx playwright install';
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing the command: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Command produced an error: ${stderr}`);
            return;
        }
        console.log(`Command output:\n${stdout}`);
    });
}