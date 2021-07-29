import buildEbookFromNotionDoc from "../build_ebook/build_ebook_from_notion_doc";
import devLogger from "../logger/dev_logger";

const token_v2=process.env.NTEB_token_v2;
const pageId= process.env.NTEB_pageId;

if(!token_v2 || !pageId){
    devLogger.error("Invalid token_v2 or pageId")
}else{
    buildEbookFromNotionDoc(token_v2, pageId);
}


