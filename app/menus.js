'use strict';

// Electron Modules
const darwinMenu = require('./menus/darwin');
const linuxMenu = require('./menus/linux');


module.exports = function(browserWindow, desktopPath) {
  if (process.platform === 'darwin') {
    console.log('Loading OSX menu..');
    return darwinMenu(browserWindow, desktopPath);
  }

<<<<<<< HEAD
function saveFile(title, browserWindow, file) {
  dialog.showSaveDialog(browserWindow, {
      title: title,
      filters: [
        { name: 'Bpmn', extensions: ['bpmn'] },
      ]
    }, function(filename) {
      if (filename) {
        file.set(filename);

        browserWindow.webContents.send('file.save');
      }
  });
}

function menus(browserWindow, DESKTOP_PATH) {

  var menu = new Menu();

  var file = new File();

  var template = [
    {
      label: 'Camunda Modeler',
      submenu: [
        {
          label: 'About Camunda Modeler',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          selector: 'terminate:'
        },
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File..',
          accelerator: 'Command+O',
          click: function() {
            dialog.showOpenDialog(browserWindow, {
                title: 'Open bpmn file',
                defaultPath: DESKTOP_PATH,
                properties: ['openFile'],
                filters: [
                  { name: 'Bpmn', extensions: ['.bpmn'] },
                ]
              }, function(filenames) {
                if (filenames) {
                  file.open(browserWindow, filenames);
                }
              });
          }
        },{
          label: 'Save File',
          accelerator: 'Command+S',
          click: function() {
            var filename;

            if ((filename = file.get())) {
              return browserWindow.webContents.send('file.save');
            }
            saveFile('Save file', browserWindow, file);
          }
        },{
          label: 'Save File As..',
          accelerator: 'Command+Shift+S',
          click: function() {
            saveFile('Save file as..', browserWindow, file);
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          label: 'Fullscreen',
          accelerator: 'Command+Enter',
          click: function() {
            if (browserWindow.isFullScreen()) {
              return browserWindow.setFullScreen(false);
            }

            browserWindow.setFullScreen(true);
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Command+Alt+J',
          click: function() {
            browserWindow.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: []
    }
  ];

  menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
}

module.exports = menus;
=======
  if (process.platform === 'linux') {
    console.log('Loading Linux menu..');
    return linuxMenu(browserWindow, desktopPath);
  }
};
>>>>>>> feat(bpmn.io): add bpmn.io's chrome app boilerplate