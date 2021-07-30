import { buildMergedDoc } from '../index';
import devLogger from "../logger/dev_logger";

const token_v2 = process.env.NTEB_token_v2;
const pageId = process.env.NTEB_pageId;


/*
1. All PDFs separately
2. Single PDF (with table of contents etc)
*/

if (!token_v2 || !pageId) {
    devLogger.error("Invalid token_v2 or pageId")
} else {
    // Single PDF
    buildMergedDoc(token_v2, pageId);
}

