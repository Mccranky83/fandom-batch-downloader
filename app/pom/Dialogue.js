import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export default class {
  constructor(options) {
    this.options = options;
  }
  async selectIndex(selected = []) {
    !this.selectIndex.f &&
      (console.log("\n-- Select --"), (this.selectIndex.f = true));
    const rl = readline.createInterface({ input, output });
    rl.on("SIGINT", () => {
      console.log("\n\nInterupted. Exiting...\n");
      process.exit(0);
    });
    const user_input = Number(await rl.question("\nPick a category (index): "));
    try {
      if (Number.isInteger(user_input)) {
        if (user_input > -1 && user_input < this.options.length) {
          !selected.includes(user_input) && selected.push(user_input);
          const flag = await rl.question(
            "Do you want to pick another category? (y/N): ",
          );
          if (flag.toLowerCase() === "y") {
            rl.close();
            return await this.selectIndex(selected);
          } else {
            rl.close();
            return selected;
          }
        } else {
          throw new Error("Invalid index. Please enter a valid index.");
        }
      } else {
        throw new Error("Invalid input. Please enter a number.");
      }
    } catch (e) {
      console.error(e.message);
      rl.close();
      return await this.selectIndex(selected);
    }
  }
}
