const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

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

function deleteCopyFolder() {
  const folderPath = path.join(__dirname, "files-copy");

  fs.stat(folderPath, (error, stats) => {
    if (error) {
      return;
    }

    if (stats.isDirectory()) {
      fs.rm(folderPath, { recursive: true }, (error) => {
        if (error) {
          return;
        }
      });
    }
  });
}

const srcDir = path.join(__dirname, "files");
const destDir = path.join(__dirname, "files-copy");
deleteCopyFolder();
copyDir(srcDir, destDir);
