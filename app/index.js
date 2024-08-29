import puppeteer from "puppeteer-core";
import default_config from "../config.js";
import Generic from "./pom/Generic.js";

(async () => {
  const config = new default_config();
  const browser = await puppeteer.launch(config.launchOptions);
  const generic = new Generic(browser, config);
  const categories = await generic.traverseCategories();
  console.log(categories);
})();
