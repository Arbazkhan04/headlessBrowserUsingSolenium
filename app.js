const express = require('express');
const { Builder, By, Key, until, Actions } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { randomInt } = require('crypto'); // for generating random delays

const app = express();
const port = 3000;

// Define route handler for the root URL
app.get('/', async (req, res) => {
  try {
    // Set up Chrome options
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless'); 
    chromeOptions.addArguments('--disable-gpu'); // Disable GPU acceleration
    chromeOptions.addArguments('--disable-dev-shm-usage'); // Disable /dev/shm usage
    chromeOptions.addArguments('--no-sandbox'); // Disable sandbox for Docker
    chromeOptions.addArguments('--disable-extensions');
    chromeOptions.addArguments('--disable-popup-blocking');
    chromeOptions.addArguments('--disable-infobars');
    chromeOptions.setUserPreferences({ credential_enable_service: false });

    // Create a new WebDriver instance with custom Chrome options
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();

    // Navigate to a webpage
    await driver.get('https://www.instagram.com');

    // Emulate human-like behavior
    const actions = driver.actions({ async: true });

    // Randomize mouse movement within the viewport
    await actions.move({
      x: randomInt(0, 800), // adjust according to viewport width
      y: randomInt(0, 600), // adjust according to viewport height
      duration: randomInt(1000, 3000) // random duration between 1 to 3 seconds
    }).perform();

    // Randomize scrolling behavior
    await driver.executeScript(`window.scrollBy(0, ${randomInt(100, 500)})`);

    // Wait for a random interval before performing the next action
    await driver.sleep(randomInt(2000, 5000)); // random delay between 2 to 5 seconds

    // Get the page title
    const title = await driver.getTitle();

    // Close the WebDriver instance
    await driver.quit();

    // Send the page title as the response
    res.send(`Title: ${title}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
