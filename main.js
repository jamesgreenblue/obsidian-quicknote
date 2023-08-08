"use strict";

const LOG_PREFIX = "obsidian-quicknote",
  LOG_LOADING = "starting",
  LOG_CLEANUP = "bye bye",
  log = (message) => console.log(`${LOG_PREFIX}: ${message}`);

const obsidian = require("obsidian"),
  { app, Menu } = require("electron").remote;

const dockMenu = Menu.buildFromTemplate([
{
    label: 'New quick note',
    click () { console.log('Hello World') }
}
])

class QuickNotePlugin extends obsidian.Plugin {
  async onload() {
    log(LOG_LOADING);

    if (process.platform === 'darwin') {
        app.dock.setMenu(dockMenu)
    }
  }
  onunload() {
    log(LOG_CLEANUP);
  }
}
module.exports = QuickNotePlugin;