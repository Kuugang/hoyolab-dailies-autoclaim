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

app.get("/install", (req, res) => {
    install()
});


const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

function claim() {
    const command = 'npx playwright test index';
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