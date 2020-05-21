const puppeteer = require("puppeteer");
import { Page } from "puppeteer";

const escapeXpathString = (str: String) => {
  const splitedQuotes = str.replace(/'/g, `', "'", '`);
  return `concat('${splitedQuotes}', '')`;
};

const clickByText = async (page: Page, text: String) => {
  const escapedText = escapeXpathString(text);
  const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);

  if (linkHandlers.length > 0) {
    await linkHandlers[0].click();
  } else {
    throw new Error(`Link not found: ${text}`);
  }
};

(async () => {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ headless: false });
  const page: Page = await browser.newPage();
  await page.goto("http://localhost:5000", {
    waitUntil: "networkidle2"
  });

  await page.$eval(
    "[name=email]",
    (el: HTMLInputElement) => (el.value = "peter.nham@gmail.com")
  );
  await page.$eval(
    "[name=password]",
    (el: HTMLInputElement) => (el.value = "Peter711")
  );

  await page.$eval("[value=Login]", (el: HTMLButtonElement) => el.click());

  // await page.waitForNavigation({waitUntil: 'load'});

  await clickByText(page, "Automatic");

  await page.select("select#fueltype", "52")

  await page.$eval("[name=submit]", (el: HTMLButtonElement) => console.log(el));

  return browser.close();
})();
