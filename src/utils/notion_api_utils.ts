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


export const getSpaceId = async (token_v2: string, blockId: string) => {
	const res = await fetch("https://www.notion.so/api/v3/getPublicPageData", {
		headers: {
			"content-type": "application/json",
			cookie: `token_v2=${token_v2};`,
		},
		body: JSON.stringify({
			blockId,
		}),
		method: "POST",
	});
	const { spaceId } = await res.json();
	devLogger.info(`spaceId: ${spaceId}`)
	return spaceId;
};


export const getFileToken = async (token_v2: string, spaceId: string) => {
	const res = await fetch("https://www.notion.so/api/v3/getAIUsageEligibility", {
		"headers": {
			"content-type": "application/json",
			cookie: `token_v2=${token_v2};`,
		},
		"body": JSON.stringify({
			spaceId
		}),
		"method": "POST",
	});
	const fileToken=res.headers.get('set-cookie')?.split(', ').filter(e => e.includes('file_token='))[0].split('; ')[0].split('=')[1]
	return fileToken as string;
}

export const enqueueExportTask = async (token_v2: string, blockId: string, spaceId: string) => {
	const res = await fetch("https://www.notion.so/api/v3/enqueueTask", {
		headers: {
			"content-type": "application/json",
			cookie: `token_v2=${token_v2};`,
		},
		body: JSON.stringify({
			task: {
				eventName: "exportBlock",
				request: {
					block: {
						id: blockId,
						spaceId,
					},
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
	exportUrl: string,
	fileToken: string
) => {
	devLogger.info("Starting file download");
	let res = await fetch(exportUrl, {
		headers: {
			cookie: `file_token=${fileToken}`
		}
	});
	const fileStream = createWriteStream(downloadZipFilePath);
	await new Promise((resolve, reject) => {
		res.body.pipe(fileStream);
		res.body.on("error", reject);
		fileStream.on("finish", resolve);
	});
	devLogger.info("File download successful");
};
