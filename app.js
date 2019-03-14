const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// Windows
let dashboard;
let todoWindow;

app.on('ready', function () {
	dashboard = new BrowserWindow();

	dashboard.loadURL(url.format({
		pathname: path.join(__dirname, '/views/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	dashboard.on('close', function () {
		app.quit();
	});

	const menu = Menu.buildFromTemplate(menuTemplate);

	Menu.setApplicationMenu(menu);
});

ipcMain.on('todo:new', function (e, todo) {
	dashboard.webContents.send('todo:new', todo);
	todoWindow.close();
});

function openNewTodo () {
	todoWindow = new BrowserWindow({
		width: 320,
		height: 320,
		title: 'Add New Todo'
	});

	todoWindow.loadURL(url.format({
		pathname: path.join(__dirname, '/views/newTodo.html'),
		protocol: 'file:',
		slashes: true
	}));

	todoWindow.on('close', function () {
		todoWindow = null;
	});
}

const menuTemplate = [
	{
		label: '',
		submenu: [
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click () {
					app.quit();
				}
			}
		]
	},
	{
		label: 'Actions',
		submenu: [
			{
				label: 'New Todo',
				accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
				click () {
					if (!todoWindow) {
						openNewTodo();
					}
				}
			}
		]
	}
]