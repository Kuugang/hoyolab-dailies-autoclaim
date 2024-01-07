const { exec } = require('child_process');
const express = require("express");
const app = express();
const port = 6969

app.get("/claim", (req, res) => {
    claim()
});


app.get("/", (req, res) => {
    res.send("Wow")
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