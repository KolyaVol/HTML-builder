const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt");
const readStream = fs.createReadStream(filePath);
readStream.on("data", (chunk) => {
  try {
    console.log(chunk.toString());
  } catch (error) {
    throw error;
  }
});
