import devLogger from "../logger/dev_logger";
import {
	inputFileDirPath,
	tmpDownloadZipFileFromNotionPath,
} from "../utils/config";
import {
	clearDirectoryAndKeepDotFiles,
	extractDataFile,
} from "../utils/filesystem_utils";
import {
	downloadFileFromUrl,
	enqueueExportTask,
	getFileToken,
	getSpaceId,
	getTaskStatus,
} from "../utils/notion_api_utils";

// It only performs Database or Document Export
// TODO: Add support for Workspace Export
export const getHtmlExport = async (authToken: string, pageId: string) => {
	devLogger.info("Starting Html Export Subroutine");

	let taskId: string = "";
	const spaceId = await getSpaceId(authToken, pageId)
	const fileToken=await getFileToken(authToken, spaceId)
	let res = await enqueueExportTask(authToken, pageId, spaceId);
	taskId = res.taskId;
	if (!taskId) {
		throw Error("Something went wrong! Couldn't get the taskId");
	}
	devLogger.info(`Task Id: ${taskId}`);

	let downloadUrl: string = await new Promise(async (resolve, reject) => {
		let tmp = setInterval(async () => {
			let res = await getTaskStatus(authToken, taskId);
			let state = res.results[0].state;
			devLogger.info(`Current Task status: ${state}`);
			if (state === "success") {
				let exportURL = res.results[0].status.exportURL;
				// download it;
				clearInterval(tmp);
				resolve(exportURL);
			} else if (state === "failure") {
				clearInterval(tmp);
				reject(`Couldn't get the downloadURL: ${JSON.stringify(res)}`);
			}
		}, 2000);
	});

	devLogger.info("Got the S3 download URL");

	await downloadFileFromUrl(tmpDownloadZipFileFromNotionPath, downloadUrl, fileToken);

	// remove all files in [inputFileDirPath] folder
	clearDirectoryAndKeepDotFiles(inputFileDirPath);

	await extractDataFile(tmpDownloadZipFileFromNotionPath, inputFileDirPath);
};
