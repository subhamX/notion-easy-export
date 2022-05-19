import { readdirSync, writeFileSync } from "fs";
import { mkdirSync } from "fs-extra";
import path from "path";
import devLogger from "../logger/dev_logger";
import { buildCurrentSession } from "../utils/build_current_session";
import {
	cssFilesArray,
	finalStandaloneDocsBaseDirOutputPath,
	inputFileDirPath,
	tmpOutputHtmlFilePath,
} from "../utils/config";
import { exportToEBook } from "../utils/convert_html_to_ebook";
import { processHtml } from "../utils/process_html";

/**
 * Builds a new doc for every html page in the directory
 * Best suited if there are a lot of html docs in the export
 */
export async function buildStandaloneDocs(token_v2: string, pageId: string) {
	await buildCurrentSession(token_v2, pageId);
	traverseBuildAndExportStandalone("/");
}

const traverseBuildAndExportStandalone = (currRelDirPath: string) => {
	const currDirPath = path.join(inputFileDirPath, currRelDirPath);

	let files = readdirSync(currDirPath, {
		withFileTypes: true,
	});
	for (let file of files) {
		let fileName = file.name;
		let filePath = path.join(currDirPath, fileName);

		// if it's html file process it
		// else if it's a png etc file. Do nothing.
		// else if it's a directory: recursively process all files in the directory. :)
		if (file.isDirectory()) {
			// recursively process
			traverseBuildAndExportStandalone(path.join(currRelDirPath, file.name));
		} else if (file.isFile()) {
			let tmp = fileName.split(".");
			let fileWithoutExt = tmp.slice(0, -1).join(".");
			let extention = tmp[tmp.length - 1];
			if (extention == "html") {
				// process it
				let currHtml = processHtml(filePath, currRelDirPath);

				cssFilesArray.forEach((e) => {
					// Path is absolute so no '..' etc needed
					currHtml("head").append(`<link rel="stylesheet" href="${e}" />`);
				});

				let fileContent = currHtml.root().html() as string;

				devLogger.info(`Saving the output file as HTML at tmp location`);
				writeFileSync(tmpOutputHtmlFilePath, fileContent);
				devLogger.info(`Exporting the HTML To Ebook`);
				let currFileOutputDir = path.join(
					finalStandaloneDocsBaseDirOutputPath,
					currRelDirPath,
					`${fileWithoutExt}.pdf`
				);
				// ensure that the dir exist
				mkdirSync(path.dirname(currFileOutputDir), {
					recursive: true,
				});
				exportToEBook(currFileOutputDir, {
					includeCover: false,
				});
			}
		}
	}
};
