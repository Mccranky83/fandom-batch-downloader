import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export default class {
  constructor(options) {
    this.options = options;
    this.selected = [];
    this.rl = readline.createInterface({ input, output });
    this.rl.on("SIGINT", () => {
      console.log("\n\nInterupted. Exiting...\n");
      process.exit(0);
    });
  }
  async selectMode() {}
  async selectIndex() {
    !this.selectIndex.f &&
      (console.log("\n-- Select --"), (this.selectIndex.f = true));
    const user_input = Number(
      await this.rl.question("\nPick a category (index): "),
    );
    try {
      if (Number.isInteger(user_input)) {
        if (user_input > -1 && user_input < this.options.length) {
          !this.selected.includes(user_input) && this.selected.push(user_input);
          const flag = await this.rl.question(
            "Do you want to pick another category? (y/N): ",
          );
          if (flag.toLowerCase() === "y") {
            return await this.selectIndex();
          } else {
            this.rl.close();
            return this.selected;
          }
        } else {
          throw new Error("Invalid index. Please enter a valid index.");
        }
      } else {
        throw new Error("Invalid input. Please enter a number.");
      }
    } catch (e) {
      console.error(e.message);
      return await this.selectIndex();
    }
  }
}
