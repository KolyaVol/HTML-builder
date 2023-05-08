const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = path.join(__dirname, "text.txt");
const writeStream = fs.createWriteStream(filePath);

rl.question("Введите текст: ", (text) => {
  try {
    writeStream.write(text);
    console.log("Текст сохранен в файл text.txt");
    askQuestion();
  } catch (error) {
    throw error;
  }
});

function askQuestion() {
  rl.question("Дополните текст: ", (text) => {
    if (text === "exit") {
      rl.close();
    } else {
      writeStream.write(text);
      askQuestion();
    }
  });
}

rl.on("close", () => {
  console.log("\nВвод завершен!");
  writeStream.end();
});

rl.on("SIGINT", () => {
  rl.close();
});
