import devLogger from "../logger/dev_logger";
import { getHtmlExport } from "../notion_export/html_export";
import { checkIfBinaryIsInPathExists } from "./check_if_binary_exists_in_path";
import { buildSessionDirs } from "./filesystem_utils";

let __currentSessionAlreadyCalled__ = false;
export const buildCurrentSession = async (token_v2: string, pageId: string) => {
	if (__currentSessionAlreadyCalled__) {
		devLogger.info(
			"Current session is already called. Using the previous Notion export"
		);
		return;
	}

	if (!checkIfBinaryIsInPathExists("wkhtmltopdf")) {
		throw Error(
			`wkhtmltopdf isn't installed or not in PATH. Kindly visit https://github.com/subhamX/notion-to-ebook#installing-wkhtmltopdf to fix this issue`
		);
	} else {
		devLogger.info("wkhtmltopdf is installed and in PATH. 🥳🥳");
	}

	devLogger.info("Starting current session...");

	if (pageId.length == 32) {
		// add dashes
		pageId = `${pageId.substr(0, 8)}-${pageId.substr(8, 4)}-${pageId.substr(
			12,
			4
		)}-${pageId.substr(16, 4)}-${pageId.substr(20)}`;
	} else if (pageId.length !== 36) {
		`pageId size ${pageId.length} isn't valid. Please note that the following doc https://www.notion.so/Getting-Started-53da8784dac74d4185f5d11bafddac97 id is 53da8784dac74d4185f5d11bafddac97. (i.e. excluding Getting-Started-)`;
	}

	buildSessionDirs();
	await getHtmlExport(token_v2, pageId);
	__currentSessionAlreadyCalled__ = true;
};
