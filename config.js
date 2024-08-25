import fs from "node:fs";
import url from "node:url";
import path from "node:path";

export default class {
  constructor() {
    this.__dirname = path.dirname(url.fileURLToPath(import.meta.url));
    this.paths = {
      profilesPath: this.setProfiles(),
    };
    this.launchOptions = {
      headless: false,
      executablePath: "/Applications/Chromium.app/Contents/MacOS/Chromium",
      userDataDir: this.setUserDataDir(),
    };
  }

  setUserDataDir(userDataDir) {
    if (arguments.length) {
      return userDataDir;
    } else {
      return fs.mkdtempSync(path.join(this.paths.profilesPath, "profile_"));
    }
  }

  setProfiles() {
    const profiles = path.resolve(this.__dirname, "profiles");
    fs.mkdirSync(profiles, { recursive: true });
    return profiles;
  }
}
