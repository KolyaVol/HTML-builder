const fs = require("fs").promises;
const path = require("path");

const stylesPath = path.join(__dirname, "styles");
const distPath = path.join(__dirname, "project-dist", "bundle.css");

const fileExtensions = [".css"];

async function bundleStyles() {
  try {
    let styles = "";

    const files = await fs.readdir(stylesPath);

    for (const file of files) {
      const filePath = path.join(stylesPath, file);
      const fileExt = path.extname(filePath);

      if (fileExtensions.includes(fileExt)) {
        const fileContent = await fs.readFile(filePath, "utf-8");
        styles += fileContent;
      }
    }

    await fs.writeFile(distPath, styles);
    console.log("Styles bundled successfully!");
  } catch (error) {
    console.error("Error while bundling styles:", error);
  }
}

bundleStyles();
