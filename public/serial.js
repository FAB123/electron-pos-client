const { SerialPort } = require("serialport");
const { ipcMain } = require("electron");

const port = new SerialPort({
  path: "COM2",
  baudRate: 2400,
});

port.on("open", () => {
  const baudRateCommand = Buffer.from([0x02, 0x42, 0x32]); // STX B 2 (2400 baud)
  port.write(baudRateCommand, (err) => {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
  });
});

ipcMain.handle("get-serial-ports", () => {
  return new Promise((resolve, reject) => {
    SerialPort.list()
      .then((ports, err) => {
        if (err) {
          resolve({ status: false, message: err.message });
        }
        if (ports.length === 0) {
          resolve({ status: false, message: "No ports discovered" });
        }
        resolve({ status: true, data: ports });
      })
      .catch((e) => {
        resolve({ status: false, message: e.message });
      });
  });
});

function writeToDisplay(type, amount) {
  console.log("c display");
  
  try {
    let commandList = {
      clear: [0x1b, 0x73, 0x30],
      price: [0x1b, 0x73, 0x31],
      total: [0x1b, 0x73, 0x32],
    };

    let formatedAmount = decimalToHexFormat(amount.toFixed(2));

    let commands = [
      commandList[type],
      [0x1b, 0x51, 0x41, ...formatedAmount, 0x0d],
    ];

    commands.forEach((command) => {
      port.write(Buffer.from(command), (err) => {
        if (err) {
          return console.log("Error on write: ", err.message);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}

function decimalToHexFormat(decimalNumber) {
  const decimalStr = decimalNumber.toString();
  const hexArray = [];
  for (let char of decimalStr) {
    const asciiCode = char.charCodeAt(0); // Get ASCII code of character
    hexArray.push(Number("0x" + asciiCode.toString(16).toUpperCase())); // Convert to hex
  }
  return hexArray;
}

module.exports = { writeToDisplay };
