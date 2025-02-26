const path = require("path");
const { app, BrowserWindow, screen, ipcMain, dialog } = require("electron");
const { PosPrinter } = require("./dist/index");
// const {PosPrinter} = require("electron-pos-printer");
const { writeToDisplay } = require("./serial");


var printers;
const isDev = require("electron-is-dev");

function createWindow() {
  const size = screen.getPrimaryDisplay().size;
  const win = new BrowserWindow({
    ...size,
    webPreferences: {
      nodeIntegration: true,
      zoomFactor: 0.8,
      contextIsolation: false,
    },
    kiosk: false,
    movable: false,
    resizable: false,
  });

  win.removeMenu();

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  win.webContents.getPrintersAsync().then((list) => (printers = list));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("print-invoice", invoicePrint);

ipcMain.handle("list-printers", () => printers);

ipcMain.on("write-amount", (_, arg) => writeToDisplay(arg[0], arg[1]));

ipcMain.handle("confirm-dialog", () => {
  const options = {
    type: "question",
    buttons: ["No", "Yes"],
    defaultId: 1,
    title: "Confirmation",
    message: "Are you sure you want to continue?",
  };
  return dialog.showMessageBoxSync(options);
});

ipcMain.on("close-app", appQuit);

function appQuit() {
  app.quit();
}

function invoicePrint(event, printData) {
  const options = {
    preview: false,
    // pageSize: "76mm", //70mm
    pageSize: {width:270, height : 1200}, // page size
    margin: "0 0 0 0", //top right bottom left
    copies: 1,
    timeOutPerLine: 400,
    silent: true,
  };

  PosPrinter.print(printData.printableData, options)
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
  if (printData.kitchenPrint) {
    PosPrinter.print(printData.kitchenPrintData, {
      ...options,
      printerName: printData.kitchenPrint,
    })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  }
}
