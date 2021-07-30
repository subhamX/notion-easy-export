import { load } from "cheerio";
import { readFileSync } from "fs";
import path from "path";
import { isFileSystemPath } from "./filesystem_utils";



export const processHtml = (filePath: string, currRelPath: string) => {
    let fileContent = readFileSync(filePath, { encoding: 'utf-8' });
    let currHtml = load(fileContent);

    currHtml.root().find('body').each((i, item) => {
        item.tagName = 'section';
        item.attribs = {
            ...item.attribs,
            "class": "prime-chapter-instance",
            "style": "page-break-after:always"
        }
    })

    currHtml('section').find('img').each((i, item) => {
        let src = item.attribs.src;
        if (isFileSystemPath(src)) {
            let tmp=path.join('..', 'input', currRelPath, src);
            // devLogger.info(`Updating img 'src' attribute [${src}]`);
            item.attribs.src = tmp;
        }
    })
    return currHtml;
}