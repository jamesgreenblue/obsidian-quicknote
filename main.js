// v0.1.0 https://github.com/jamesgreenblue/obsidian-quicknote is licensed under the MIT License

const LOG_PREFIX = "obsidian-quicknote",
  LOG_LOADING = "hello",
  LOG_CLEANUP = "bye bye",
  log = (message) => console.log(`${LOG_PREFIX}: ${message}`);

const obsidian = require("obsidian"),
  { app, Menu } = require("electron").remote;

const dockMenu = Menu.buildFromTemplate([
{
    label: 'New quick note',
    click () { this.app.commands.executeCommandById('quicknote:jgb-create-quick-note'); }
}
])

class QuickNotePlugin extends obsidian.Plugin {
  async onload() {
    log(LOG_LOADING);

    if (process.platform === 'darwin') {
        app.dock.setMenu(dockMenu)
    }

    this.addCommand({
      id: "jgb-create-quick-note",
      name: "New quick note",
      icon: "popup-open",
      callback: async () => {
        let fileName = this.generateNewFileFolderName();
        let leafWindow = this.app.workspace.getLeaf("window");
        const newFile = await this.app.vault.create(fileName, "", {});
        await leafWindow.openFile(newFile);
      }
    });
  }

  generateNewFileFolderName() {
    let activeFile = this.app.workspace.getActiveFile();
    let activePath = !!activeFile ? activeFile.path : "";
    const newFileParent = this.app.fileManager.getNewFileParent(activePath);
    let noteFilePath = newFileParent.path;
    const noteName = obsidian.moment().format("YYYY-MM-DD [(]HH-mm-ss[) Quick note]");
    return `${noteFilePath}/${noteName}.md`;
  }

  onunload() {
    log(LOG_CLEANUP);
  }

}
module.exports = QuickNotePlugin;