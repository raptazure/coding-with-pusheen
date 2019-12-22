import * as vscode from 'vscode';
import * as path from 'path';
import { TextEncoder } from 'util';

export function activate(context: vscode.ExtensionContext) {
	
	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	
	context.subscriptions.push(
		vscode.commands.registerCommand('coding.start', () => {
			const columnToShowIn = vscode.window.activeTextEditor ?
				vscode.window.activeTextEditor.viewColumn :
				undefined;

			if (currentPanel) {
				currentPanel.reveal(columnToShowIn);
			} else {
				currentPanel = vscode.window.createWebviewPanel(
					'codingWithPusheen',
					'Coding with Pusheen',
					vscode.ViewColumn.Two,
				  {}
				);
				
				let iterator = 0;
				const updateWebview = () => {
					const cat = iterator++ % 2 ? 'love.gif' : 'type.gif';
					const onDiskPath = vscode.Uri.file(
						path.join(context.extensionPath, 'images', cat)
					);

					if(currentPanel !== undefined) {
					  const catGifSrc = currentPanel.webview.asWebviewUri(onDiskPath);
					  currentPanel.webview.html = getWebviewContent(catGifSrc);
					}
				};
				
				updateWebview();
				const interval = setInterval(updateWebview, 5000);

			    currentPanel.onDidDispose(
					() => {
						clearInterval(interval);
						currentPanel = undefined;
					},
					null,
					context.subscriptions
				);
			}
		})
	);
}

function getWebviewContent(catGifSrc: vscode.Uri) {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		<title>Coding with Pusheen</title>
	</head>
	<body>
	  <div width="800px">
		<img style="opacity: 0.75; float: right;" src="${catGifSrc}" alt="the image can't find its way home /(ㄒoㄒ)/" width="255" height="160">
		<div style="font-family: Cascadia Code; font-size: medium; opacity: 0.75">Believe in yourself and Highly motivated.</div>
		<br>
		<div style="font-family: Comic Sans MS; font-size: medium; opacity: 0.75">Meet pusheen and Enjoy a beautiful day!</div>
	  </div>
	</body>
	</html>`;
}

// TODO Feature: Schedule
// TODO Feature: A floating div with transparent background

export function deactivate() {}