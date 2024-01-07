// @ts-check

//npx playwright test index --browser=chromium
const dotenv = require("dotenv").config();
// const FILEURL = "./tests/last.txt"
let DATE = 6;
let loggedIn = false

let USERNAME = process.env.USERNAME
let PASSWORD = process.env.PASSWORD;

// fs.readFile(FILEURL, 'utf8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   DATE = data
// });


const { test, expect } = require('@playwright/test');

const exp = require('constants');

test.setTimeout(0)

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


async function check(page) {
    await login(page)
    if (loggedIn == false) {
        await check(page)
    }
}

test('claim', async ({ page }) => {
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
                // fs.writeFile(FILEURL, String(DATE), (err) => {
                //     if (err) throw err;
                // })
                console.log(`Claimed reward for ${new Date()}`)
            } catch (error) {
                console.log("Claim button not found")
            }
        }
    }
});

const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}