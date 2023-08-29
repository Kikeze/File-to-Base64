// Importaciones
import * as vscode from 'vscode';

// Punto de entrada de la extension
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "kikeze-file-to-base64" is now active!');

	let loadFile = vscode.commands.registerCommand('kikeze-file-to-base64.loadFile', async (selected: vscode.Uri | undefined) => {
		try {
			//console.log(file);

			let oFileUri: vscode.Uri;
			let bShowOpen: boolean = false;

			if(!selected) {
				bShowOpen = true;
			}
			else {
				if(selected.scheme != "file") {
					bShowOpen = true;
				}
				else {
					oFileUri = selected;
				}
			}

			if(bShowOpen) {
				const oDialogOptions = {
					canSelectFiles: true,
					canSelectFolders: false,
					canSelectMany: false,
					openLabel: "Open",
					title: "FILE to BASE64"
				};
				let oResult = await vscode.window.showOpenDialog(oDialogOptions);

				//console.log(oResult);

				if (!oResult || oResult.length < 1) {
					return;
				}

				oFileUri = oResult[0];
			}

			await readAndEncodeFile(oFileUri!);

			vscode.window.showInformationMessage("File loaded, OK!");
		}
		catch(err: any) {
			vscode.window.showErrorMessage(err);
			console.error("Error: ", err);
		}
	});

	context.subscriptions.push(loadFile);
}

// Punto de salida de la extension
export function deactivate() {
	// Do nothing
}

async function readAndEncodeFile(sourceFile: vscode.Uri) {
	//console.log(sourceFile);

	const oFS = vscode.workspace.fs;
	if(!oFS) {
		throw "Unable to instance FS!";
	}

	const oFile: any = await oFS.readFile(sourceFile);
	await vscode.env.clipboard.writeText(oFile.base64Slice());

	return true;
}

