const { test, expect } = require('@playwright/test');
const { USERNAME, PASSWORD } = require('./index.spec');

test('has title', async ({ page }) => {
    let loggedIn = false;
    await page.goto("https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481&mhy_auth_required=true&mhy_presentation_style=fullscreen");

    await expect(page).toHaveTitle(/Genshin Impact Daily Check-In/);

    const close = await page.waitForSelector('.components-home-assets-__sign-guide_---guide-close---2VvmzE');
    if (close) {
        await close.click();
    } else {
        console.error('Close button not found or attached to the DOM.');
    }

    const account = await page.waitForSelector(".mhy-hoyolab-account-block__avatar");
    if (account) {
        await account.click();

        // Add a longer timeout to allow the modal to appear
        await page.waitForTimeout(3000); // You can adjust this timeout value as needed

        const iframeElement = await page.waitForSelector(`iframe#hyv-account-frame`);


        if (iframeElement) {
            const frame = await iframeElement.contentFrame();
            if (frame) {
                await (await frame.waitForSelector('.el-input__inner:nth-of-type(1)')).fill(USERNAME);
                await (await frame.waitForSelector('.el-input__inner[type="password"]')).fill(PASSWORD);
                await (await frame.waitForSelector("button[type='submit']")).click();
                await page.waitForTimeout(5000);
                loggedIn = true;
            }

        }

    } else {
        console.error('Account element not found or attached to the DOM.');
    }

    if (loggedIn == true) {
        let currentDate = new Date();

        while (true) {
            console.log(currentDate.getTime() === new Date().getTime());
            // if (currentDate.getTime() !== new Date().getTime()) {
            //     await page.reload();
            //     try {
            //         const claimButton = await page.waitForSelector(".components-home-assets-__sign-content-test_---red-point---2jUBf9", { timeout: 5000 })
            //         await claimButton.click()
            //         currentDate = new Date();
            //     } catch (error) {
            //         console.log("Claim button not found")
            //     }
            // }
        }
    }
});
