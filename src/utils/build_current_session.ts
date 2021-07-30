import devLogger from "../logger/dev_logger";
import { getHtmlExport } from "../notion_export/html_export";
import { buildSessionDirs } from "./filesystem_utils";



let __currentSessionAlreadyCalled__ = false;
export const buildCurrentSession = async (token_v2: string, pageId: string) => {
    if (__currentSessionAlreadyCalled__) {
        devLogger.info("Current session is already called. Using the previous Notion export");
        return;
    }
    devLogger.info("Starting operation");

    if (pageId.length == 32) {
        // add dashes
        pageId = `${pageId.substr(0, 8)}-${pageId.substr(8, 4)}-${pageId.substr(12, 4)}-${pageId.substr(16, 4)}-${pageId.substr(20)}`;
    } else if (pageId.length !== 36) {
        throw Error(`pageId size ${pageId.length} isn't valid`);
    }

    buildSessionDirs();
    await getHtmlExport(token_v2, pageId);
    __currentSessionAlreadyCalled__=true;
}