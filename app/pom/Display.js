import fs from "node:fs/promises";
import path from "node:path";

import Categories from "./Categories.js";

export default class {
  constructor(browser, config) {
    this.browser = browser;
    this.config = config;
  }

  async displayCategories() {
    const menu_path = path.resolve(import.meta.dirname, "../..", "menu.txt");
    return await fs
      .readFile(menu_path, { encoding: "utf-8" })
      .then((menu) => {
        console.log(menu);
        return menu
          .split("\n")
          .slice(1)
          .reduce((acc, cur) => {
            cur !== "" && acc.push(cur);
            return acc;
          }, [])
          .map((cur) => {
            return cur
              .split("(")
              .slice(1)
              .map((cur) => cur.trim().slice(4));
          })
          .flat();
      })
      .catch(async () => {
        console.error("No menu.txt file found. Generating menu...\n");
        const categories = await new Categories(
          this.browser,
          this.config,
        ).fetchCategories();
        const menu = categories.reduce((acc, cur, i) => {
          !i && acc.push("Categories:");
          !(i % 4) && acc.push("\n");
          const index = ("" + i).padStart(2, "0");
          acc[acc.length - 1] = acc[acc.length - 1].concat(
            `${`(${index}) ${cur}`.padEnd(30)}`,
          );
          return acc;
        }, []);
        menu.forEach((e) => console.log(e));
        await fs.writeFile(menu_path, menu.join("\n"), { encoding: "utf-8" });
        return categories;
      });
  }
}
