export default class {
  constructor(browser, config) {
    this.browser = browser;
    this.config = config;
  }

  /**
   * Uncomment commented for linear traversal
   */
  async fetchCategories() {
    console.log("Fetching Categories...\n");
    let categories = [];
    const traverse = async (url = `${this.config.base_url}Content`) => {
      const page = await this.browser.newPage();
      try {
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60_000,
        });
      } catch (e) {
        console.error(e.message);
        await page.close();
        process.exit(1);
      }
      try {
        // let lockfile = false;
        await Promise.all(
          (await this.util(page)).map(
            (cur) =>
              new Promise(async (res) => {
                /* while (lockfile) {
                  await new Promise((res) => {
                    setTimeout(res, 500);
                  });
                }
                lockfile = true; */
                if (!categories.includes(cur)) {
                  categories.push(cur);
                  const new_url = `${this.config.base_url}${cur}`;
                  await traverse(new_url);
                }
                // lockfile = false;
                res();
              }),
          ),
        );
        await page.close();
      } catch (e) {
        await page.close();
      }
    };
    await traverse();
    return categories;
  }

  async util(page) {
    const category_xpath = "xpath/.//ul//a[text()[contains(., 'Category:')]]";
    await page.waitForSelector(category_xpath, { timeout: 3_000 });
    return await page.$$eval(category_xpath, (elements) =>
      elements.map((cur) => cur.innerText.split(":")[1]),
    );
  }
}
