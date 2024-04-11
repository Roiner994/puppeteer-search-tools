export const findElementByText = async (page: any, text: string) => {
  const xPath = `//*[contains(text(), '${text}')]`;
  await page.waitForXPath(xPath);
  const elements = await page.$x(xPath);
  return elements[elements.length - 1];
};

export const setValueToInputByPlaceHolder = async (
  page: any,
  placeholder: string,
  value: string | number
) => {
  const xPath = `//input[@placeholder='${placeholder}']`;
  await page.waitForXPath(xPath);
  const [inputElement] = await page.$x(xPath);
  if (inputElement) {
    await inputElement.type(value);
  }
};
