import * as vscode from 'vscode';
import * as path from 'path';
import { TextEncoder } from 'util';

export function activate(context: vscode.ExtensionContext) {

	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	const cats = {
		'coding pusheen': 'tenor.gif', 
		'loving pusheen': 'love.gif'
	};
	context.subscriptions.push(
		vscode.commands.registerCommand('coding.start', () => {
			const columnToShowIn = vscode.window.activeTextEditor ?
				vscode.window.activeTextEditor.viewColumn :
				undefined;

			if (currentPanel) {
				currentPanel.reveal(columnToShowIn);
			} else {
				// Create and show the panel
				currentPanel = vscode.window.createWebviewPanel(
					'codingWithPusheen',
					'Coding with Pusheen',
					vscode.ViewColumn.Two,
				  {}
				);
				
				let iterator = 0;
				const updateWebview = () => {
					const cat = iterator++ % 2 ? 'love.gif' : 'tenor.gif';
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

// HTML Content
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
		<img src="${catGifSrc}" alt="the image can't find its way home/(ㄒoㄒ)/~~">
		<h2>Believe in yourself and Highly motivated...</h2>
		<h3>Meet pusheen the cat and Enjoy a beautiful day!</h3>
	</body>
	</html>`;
}

// TODO Feature: schedule --12.20
export function deactivate() {}