const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "components");
const STYLES_DIR = path.join(__dirname, "styles");
const ASSETS_DIR = path.join(__dirname, "assets");
const TEMPLATE_PATH = path.join(__dirname, "template.html");
const DIST_DIR = path.join(__dirname, "project-dist");
const INDEX_FILE = "index.html";

function getMatches(string, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(string))) {
    matches.push(match);
  }
  return matches;
}

async function readFileAsync(filePath) {
  try {
    let data = "";
    const readStream = fs.createReadStream(filePath, "utf-8");
    for await (const chunk of readStream) {
      data += chunk;
    }
    console.log(data);
    return data;
  } catch (err) {
    console.error(`Error while reading file "${filePath}"`, err);
    throw err;
  }
}

async function writeFileAsync(filePath, data) {
  try {
    await fs.createWriteStream(filePath).write(data);
  } catch (err) {
    console.error(`Error while writing file "${filePath}"`, err);
    throw err;
  }
}

async function mkdirAsync(dirPath) {
  try {
    await fsp.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.error(`Error while creating directory "${dirPath}"`, err);
    throw err;
  }
}

const copyDir = async (src, dest) => {
  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
};

async function buildPage() {
  try {
    await mkdirAsync(DIST_DIR);
    const template = await readFileAsync(TEMPLATE_PATH);

    const components = {};
    const componentFiles = await fsp.readdir(COMPONENTS_DIR);
    for (const componentFile of componentFiles) {
      const componentPath = path.join(COMPONENTS_DIR, componentFile);
      const stats = await fsp.stat(componentPath);
      if (stats.isFile() && path.extname(componentPath) === ".html") {
        const componentName = path.basename(componentFile, ".html");
        const componentData = await readFileAsync(componentPath);
        components[componentName] = componentData;
      }
    }

    let indexHtml = template;
    const regex = /{{\s*(\w+)\s*}}/g;
    const matches = getMatches(indexHtml, regex);
    for (const match of matches) {
      const componentName = match[1];
      const componentData = components[componentName] || "";
      indexHtml = indexHtml.replace(match[0], componentData);
    }

    const indexPath = path.join(DIST_DIR, INDEX_FILE);
    await writeFileAsync(indexPath, indexHtml);

    async function bundleStyles() {
      try {
        const fileExtensions = [".css"];
        const distPath = path.join(DIST_DIR, "style.css");
        let styles = "";

        const files = await fsp.readdir(STYLES_DIR);

        for (const file of files) {
          const filePath = path.join(STYLES_DIR, file);
          const fileExt = path.extname(filePath);

          if (fileExtensions.includes(fileExt)) {
            const fileContent = await fsp.readFile(filePath, "utf-8");
            styles += fileContent;
          }
        }

        await fsp.writeFile(distPath, styles);
        console.log("Styles bundled successfully!");
      } catch (error) {
        console.error("Error while bundling styles:", error);
      }
    }
    bundleStyles();
    copyDir(ASSETS_DIR, path.join(DIST_DIR, "assets"));
  } catch (err) {}
}
buildPage();
