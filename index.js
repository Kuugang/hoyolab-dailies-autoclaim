const { exec } = require('child_process');
const { execSync } = require('child_process');
const { chromium } = require('playwright');
const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const port = 6969

let DATE = 6;
let loggedIn = false
let USERNAME = "gideon.yople@gmail.com"
let PASSWORD = "detectiveconan27"

await execSync("npx playwright install")

app.get("/", (req, res) => {
    res.send("<a href = 'https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481'>Here</a>")
});

app.get("/install", (req, res) => {
    install()
    res.status(200)
});


app.get("/claim", async (req, res) => {
    try {
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481&mhy_auth_required=true&mhy_presentation_style=fullscreen");
        await (await page.waitForSelector('.components-home-assets-__sign-guide_---guide-close---2VvmzE')).click()

        await check(page)

        while (true) {
            await sleep(1)
            let newDay = new Date().getDate();

            if (newDay != DATE) {
                await page.reload();
                try {
                    const claimButton = await page.waitForSelector(".components-home-assets-__sign-content-test_---red-point---2jUBf9", { timeout: 5000 })
                    await claimButton.click()
                    DATE = newDay
                    console.log(`Claimed reward for ${new Date()}`)
                } catch (error) {
                    console.log("Claim button not found")
                }
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500)
    }
});

const server = app.listen(port, () => {
    install()
    console.log(`Server listening on port ${port}`);
});


async function check(page) {
    await login(page)
    if (loggedIn == false) {
        await check(page)
    }
}

function install() {
    const command = 'npx playwright install';
    execSync(command)
}

async function login(page) {
    await page.reload()
    const account = await page.waitForSelector(".mhy-hoyolab-account-block__avatar")
    if (account) {
        await account.click();
        const iframeElement = await page.waitForSelector(`iframe#hyv-account-frame`);
        const frame = await iframeElement.contentFrame();
        if (frame) {

            await (await frame.waitForSelector(".el-input__inner[type='text']")).fill(USERNAME)
            await (await frame.waitForSelector(".el-input__inner[type='password']")).fill(PASSWORD)
            await (await frame.waitForSelector("button[type='submit']")).click()
            await page.waitForTimeout(1000)
            try {
                await frame.waitForSelector(".geetest_wrap", { timeout: 5000 });
                return
            } catch (error) {
                loggedIn = true;
                return
            }
        }
    }
}

const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}