import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export default class {
  constructor(options) {
    this.options = options;
    this.selected = [];
    this.modes = Object.freeze(["Select", "delete", "list", "quit"]);
    this.rl = readline.createInterface({ input, output });
    this.rl.on("SIGINT", () => {
      console.log("\n\nInterupted. Exiting...\n");
      process.exit(0);
    });
  }
  async selectMode() {
    try {
      // Reset flags for displaying header
      this.selectIndex.f = false;
      this.deleteIndex.f = false;
      const prompt =
        "\nPick a mode: " +
        this.modes.reduce((acc, cur, i, self) => {
          const option = `(${cur[0]})${cur.slice(1)}`;
          i !== self.length - 1
            ? (acc += option + " / ")
            : (acc += option + "\nYour choice: ");
          return acc;
        }, "");
      const user_input = await this.rl.question(prompt);
      switch (user_input.toLowerCase()) {
        case "s":
        case "":
          await this.selectIndex();
          break;
        case "d":
          await this.deleteIndex();
          break;
        case "l":
          await this.listSelected();
          break;
        case "q":
          console.log(`\nYou've selected: ${this.selected.join(", ")}`);
          break;
        default:
          throw new Error("\nInvalid input. Please enter a valid mode.");
      }
    } catch (e) {
      console.error(e.message);
      await this.selectMode();
    }
  }
  async selectIndex() {
    !this.selectIndex.f &&
      (console.log("\n-- SELECT --"), (this.selectIndex.f = true));
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
            await this.selectIndex();
          } else {
            console.log("\n(END)");
            await this.selectMode();
          }
        } else {
          throw new Error("Invalid index. Please enter a valid index.");
        }
      } else {
        throw new Error("Invalid input. Please enter a number.");
      }
    } catch (e) {
      console.error(e.message);
      await this.selectIndex();
    }
  }

  async deleteIndex() {
    try {
      if (!this.selected.length) throw new Error("\nSuch empty...");
      !this.selectIndex.f &&
        (console.log("\n-- DELETE --"), (this.selectIndex.f = true));
      await this.listSelected(true);
      const user_input = Number(await this.rl.question("\nRemove index: "));
      try {
        if (Number.isInteger(user_input)) {
          if (this.selected.includes(user_input)) {
            this.selected = this.selected.filter((e) => e !== user_input);
            const flag = await this.rl.question(
              "Do you want to delete another index? (y/N): ",
            );
            if (flag.toLowerCase() === "y") {
              await this.deleteIndex();
            } else {
              console.log("\n(END)");
              await this.selectMode();
            }
          } else {
            throw new Error("Invalid index. Please enter a valid index.");
          }
        } else {
          throw new Error("Invalid input. Please enter a number.");
        }
      } catch (e) {
        console.error(e.message);
        await this.deleteIndex();
      }
    } catch (e) {
      console.error(e.message);
      await this.selectMode();
    }
  }

  async listSelected() {
    try {
      if (this.selected.length) {
        console.log(
          `\nSelected: ${this.selected
            .sort((a, b) => a - b)
            .map(
              (cur) => `(${("" + cur).padStart(2, "0")}) ${this.options[cur]}`,
            )
            .join(", ")}`,
        );
      } else {
        throw new Error(
          "\nNo category selected! Please select a category first.",
        );
      }
    } catch (e) {
      console.error(e.message);
      await this.selectIndex();
    }
    !arguments.length && (await this.selectMode());
  }
}
