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
    await this.loadSettings();

    if (process.platform === 'darwin') {
        app.dock.setMenu(dockMenu)
    }

    this.addCommand({
      id: "jgb-create-quick-note",
      name: "New quick note",
      icon: "popup-open",
      callback: async () => {
        let fileName = this.generateNewFilePath();
        let leafWindow = this.app.workspace.getLeaf("window");
        const newFile = await this.app.vault.create(fileName, "", {});
        await leafWindow.openFile(newFile);
      }
    });

    this.addSettingTab(new SettingTab(this.app, this));
  }

  generateNewFilePath() {
    let activeFile = this.app.workspace.getActiveFile();
    let activePath = !!activeFile ? activeFile.path : "";
    const newFileParent = this.app.fileManager.getNewFileParent(activePath);
    let noteFilePath = newFileParent.path;

    const noteFileTitle = obsidian.moment().format(this.settings.quickNoteTitle || DEFAULT_SETTINGS.quickNoteTitle);
    let existingQuickNotes = newFileParent.children.filter((n) => n.name.startsWith(noteFileTitle)).map((n) => n.name);
    let fileName = "";
    for (let i = 0; i <= existingQuickNotes.length; i++) {
      fileName = `${noteFileTitle}${i > 0 ? " " + i : ""}.md`;
      if (!existingQuickNotes.includes(fileName)) {
        break;
      }
    }
    return `${noteFilePath}/${fileName}`;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    log(LOG_CLEANUP);
  }
  
}

var DEFAULT_SETTINGS = {
  quickNoteTitle: "YYYY-MM-DD [Quick note]"
};

var SettingTab = class extends obsidian.PluginSettingTab {
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h1", {
      text: `${this.plugin.manifest.name} ${this.plugin.manifest.version}`
    });
    new obsidian.Setting(this.containerEl).setName("Quick note title").setDesc("See Moment.js documentation for instructions").addText((text) => {
      text.setPlaceholder(DEFAULT_SETTINGS.quickNoteTitle).setValue(this.plugin.settings.quickNoteTitle).onChange((newTitle) => {
        this.plugin.settings.quickNoteTitle = newTitle;
        this.plugin.saveSettings();
      });
    });
  }
};

module.exports = QuickNotePlugin;