const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(err);
        } else {
          if (stats.isFile()) {
            const fileName = path.parse(file).name;
            const fileExt = path.parse(file).ext.slice(1);
            const fileSize = Math.round((stats.size / 1024) * 100) / 100;
            console.log(`${fileName}-${fileExt}-${fileSize}kb`);
          }
        }
      });
    });
  }
});
