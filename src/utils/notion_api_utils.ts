import { createWriteStream } from "fs";
import devLogger from "../logger/dev_logger";
import fetch from "node-fetch";

export const getTaskStatus = async (token_v2: string, taskId: string) => {
	const res = await fetch("https://www.notion.so/api/v3/getTasks", {
		headers: {
			"content-type": "application/json",
			cookie: `token_v2=${token_v2};`,
		},
		body: JSON.stringify({
			taskIds: [taskId],
		}),
		method: "POST",
	});
	const json = await res.json();

	return json;
};

export const enqueueExportTask = async (token_v2: string, pageId: string) => {
	const res = await fetch("https://www.notion.so/api/v3/enqueueTask", {
		headers: {
			"content-type": "application/json",
			cookie: `token_v2=${token_v2};`,
		},
		body: JSON.stringify({
			task: {
				eventName: "exportBlock",
				request: {
					blockId: pageId,
					recursive: true,
					exportOptions: {
						exportType: "html",
						includeContents: "everything",
						locale: "en",
						timeZone: "Asia/Calcutta",
					},
				},
			},
		}),
		method: "POST",
	});
	const json = await res.json();
	return json;
};

export const downloadFileFromUrl = async (
	downloadZipFilePath: string,
	exportUrl: string
) => {
	devLogger.info("Starting file download");
	let res = await fetch(exportUrl);
	const fileStream = createWriteStream(downloadZipFilePath);
	await new Promise((resolve, reject) => {
		res.body.pipe(fileStream);
		res.body.on("error", reject);
		fileStream.on("finish", resolve);
	});
	devLogger.info("File download successful");
};
