export default class {
  constructor(browser, config) {
    this.browser = browser;
    this.config = config;
  }

  async traverseCategories(
    url = `${this.config.base_url}Content`,
    output = [],
  ) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    try {
      const categories = await this.getCategories(page);
      for (let category of categories) {
        if (output.includes(category)) continue;
        else {
          output.push(category);
          const new_url = `${this.config.base_url}${category}`;
          await this.traverseCategories(new_url, output);
        }
      }
      await page.close();
      return output;
    } catch (e) {
      page.close();
    }
  }

  async getCategories(page) {
    const category_xpath = "xpath/.//ul//a[text()[contains(., 'Category:')]]";
    await page.waitForSelector(category_xpath, { timeout: 3_000 });
    return await page.$$eval(category_xpath, (elements) =>
      elements.map((cur) => cur.innerText.split(":")[1]),
    );
  }
}
