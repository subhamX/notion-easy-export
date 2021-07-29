import { load } from "cheerio";
import { readFileSync, readdirSync, writeFileSync, lstatSync, copySync } from 'fs-extra';
import path from "path";
import devLogger from "../logger/dev_logger";
import { exportToEBook } from "../utils/convert_html_to_ebook";
import { baseHtmlFilePath, cssFilesArray, inputFileDirPath, outputFileDirPath, tmpOutputHtmlFilePath } from "../utils/config";
import { getHtmlExport } from "../notion_export/html_export";
import { buildSessionDirs, isFileSystemPath } from "../utils/filesystem_utils";


export default async function buildEbookFromNotionDoc(token_v2: string, pageId: string) {
    try {
        devLogger.info("Starting operation");

        if (pageId.length == 32) {
            // add dashes
            pageId = `${pageId.substr(0, 8)}-${pageId.substr(8, 4)}-${pageId.substr(12, 4)}-${pageId.substr(16, 4)}-${pageId.substr(20)}`;
        } else if (pageId.length !== 36) {
            throw Error(`pageId size ${pageId.length} isn't valid`);
        }

        buildSessionDirs();
        await getHtmlExport(token_v2, pageId);


        let baseHtmlContent = readFileSync(baseHtmlFilePath);
        let $ = load(baseHtmlContent);

        let files = readdirSync(inputFileDirPath);
        // ! DEBUG
        // files = files.slice(0, 2);
        // devLogger.debug("Slicing the files array to 5")

        let numberOfFiles = files.length;
        devLogger.info(`Files array size: ${numberOfFiles}`);

        for (let i = 0; i < numberOfFiles; i++) {
            let file = files[i];
            let filePath = path.join(inputFileDirPath, file);
            if (file === '.gitignore') {
                continue;
            }
            if (lstatSync(filePath).isDirectory()) {
                devLogger.info(`Copying [${filePath}]`)
                let outputFilePath = path.join(outputFileDirPath, file);
                copySync(filePath, outputFilePath, { recursive: true });
                continue;
            }
            devLogger.info(`Processing file: ${file}`);
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
                    devLogger.info(`Updating img 'src' attribute [${src}]`);
                    item.attribs.src = path.join(outputFileDirPath, src)
                }
            })

            $('body').append(currHtml('.prime-chapter-instance'));
        }



        cssFilesArray.forEach(e => {
            // Path is absolute so no '..' etc needed
            $('head').append(`<link rel="stylesheet" href="${e}" />`)
        })

        let fileContent = $.root().html() as string;

        devLogger.info(`Saving the output file as HTML at tmp location [${tmpOutputHtmlFilePath}]`)
        writeFileSync(tmpOutputHtmlFilePath, fileContent);
        devLogger.info(`Exporting the HTML To Ebook`)
        exportToEBook();
        devLogger.info(`Operation Successful. Exiting.`)
    } catch (err) {
        devLogger.error(`main: ${err.toString()}`);
    }
}


