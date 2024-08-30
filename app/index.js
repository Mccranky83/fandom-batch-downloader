import puppeteer from "puppeteer-core";
import default_config from "../config.js";
import Categories from "./pom/Categories.js";

(async () => {
  const config = new default_config();
  const browser = await puppeteer.launch(config.launchOptions);
  const categories = await new Categories(browser, config).getCategories();
  console.log(categories);
})();
