// @ts-check

//npx playwright test index --browser=chromium
const USERNAME = "kuugang"
const PASSWORD = "maotka12369"
const fs = require('fs');
const FILEURL = "tests/last.txt"
let DATE

fs.readFile(FILEURL, (err, data) => {
    if (err) throw err;
});



const { test, expect } = require('@playwright/test');

const exp = require('constants');

test.setTimeout(0)



test('has title', async ({ page }) => {
    let loggedIn = false
    await page.goto("https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481&mhy_auth_required=true&mhy_presentation_style=fullscreen");

    await expect(page).toHaveTitle(/Genshin Impact Daily Check-In/);

    const close = await page.waitForSelector('.components-home-assets-__sign-guide_---guide-close---2VvmzE');
    if (close) {
        await close.click();
    } else {
        console.error('Close button not found or attached to the DOM.');
    }

    const account = await page.waitForSelector(".mhy-hoyolab-account-block__avatar")
    if (account) {
        await account.click();

        // Add a longer timeout to allow the modal to appear
        await page.waitForTimeout(3000); // You can adjust this timeout value as needed

        const iframeElement = await page.waitForSelector(`iframe#hyv-account-frame`);


        if (iframeElement) {
            const frame = await iframeElement.contentFrame();
            if (frame) {
                await (await frame.waitForSelector(".facebook")).click()
                const newPage = await page.context().waitForEvent('page');
                await page.waitForTimeout(3000);

                await (await newPage.waitForSelector(".inputtext._55r1[type='text']")).fill(USERNAME)
                await (await newPage.waitForSelector(".inputtext._55r1[type='password']")).fill(PASSWORD)
                await (await newPage.waitForSelector("input[name='login']")).click()

                await page.waitForTimeout(5000);
                await page.reload()
                await page.waitForTimeout(5000);

                loggedIn = true;
            }
        }

    } else {
        console.error('Account element not found or attached to the DOM.');
    }

    if (loggedIn == true) {

        while (true) {
            await sleep(1)
            let newDay = new Date().getDate();

            if (newDay != DATE) {
                await page.reload();
                try {
                    const claimButton = await page.waitForSelector(".components-home-assets-__sign-content-test_---red-point---2jUBf9", { timeout: 5000 })
                    await claimButton.click()
                    DATE = newDay
                    fs.writeFile(FILEURL, String(DATE), (err) => {
                        if (err) throw err;
                    })

                    console.log(`Claimed reward for ${new Date()}`)
                } catch (error) {
                    console.log("Claim button not found")
                }
            }
        }
    }
});

const sleep = (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}