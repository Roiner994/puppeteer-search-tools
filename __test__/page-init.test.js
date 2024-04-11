const puppeteer = require("puppeteer");
const puppeteerTools = require("../src");

let browser;
let page;
jest.setTimeout(60000);
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    slowMo: 15,
  });
  page = await browser.newPage();

  await page.goto("https://aws-apppreprod.ucrop.it/Authentication/SignIn", {
    waitUntil: "networkidle0",
  });
});

afterAll(async () => {
  if (browser) await browser.close();
});

test("cerrar bienvenida", async () => {
  await page.waitForSelector('[data-testid="fab_button"]');
  await page.click('[data-testid="close_button"]');
});

test("Pantalla 1 de Onboarding", async () => {
  await puppeteerTools.setValueToInputByPlaceHolder(
    page,
    "Email",
    "correoSinRegustrar2@ucrop.it"
  );

  const btnToContinue = await puppeteerTools.findElementByText(
    page,
    "Continue"
  );
  await btnToContinue.click();
});

test("resgister input text form new user", async () => {
  await page.waitForSelector('[data-testid="first_name"]');
  await page.type('[data-testid="first_name"]', "First Name");
  await page.waitForSelector('[data-testid="last_name"]');
  await page.type('[data-testid="last_name"]', "Last Name");
});

test("register phone number", async () => {
  await page.waitForSelector('[data-testid="icon_flag"]');
  await page.evaluate(() => {
    const iconFlag = document.querySelector('[data-testid="icon_flag"]');
    if (!iconFlag?.parentNode) return;
    iconFlag.parentNode.click();
    iconFlag.parentNode.click();
  });

  const resultIndex = await page.evaluate(async () => {
    let listDiv = Array.from(
      document.querySelectorAll(
        "#simple-menu > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > div > div"
      )
    );
    const children = listDiv[0].children;
    const elementIndex = Array.from(children).findIndex(
      (child) => child.textContent && child.textContent.includes("Argentina")
    );
    return elementIndex;
  });

  const listElement = await page.waitForSelector(
    `#simple-menu > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > div > div > div:nth-child(${
      resultIndex + 1
    })`
  );
  listElement.click();

  await puppeteerTools.setValueToInputByPlaceHolder(
    page,
    "Mobile",
    "91162973516"
  );

  const btnCreateAccount = await puppeteerTools.findElementByText(
    page,
    "Continue"
  );
  await btnCreateAccount.click();
});
