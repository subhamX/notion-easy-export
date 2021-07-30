import { CheerioAPI, load } from "cheerio";
import { readFileSync, readdirSync, writeFileSync, lstatSync, copySync, existsSync } from 'fs-extra';
import path from "path";
import devLogger from "../logger/dev_logger";
import { exportToEBook } from "../utils/convert_html_to_ebook";
import { baseHtmlFilePath, cssFilesArray, inputFileDirPath, outputFileDirPath, rootDir, tmpOutputHtmlFilePath } from "../utils/config";
import { getHtmlExport } from "../notion_export/html_export";
import { buildSessionDirs, isFileSystemPath } from "../utils/filesystem_utils";

/**
 * Builds a single merged doc using all of the documents
 * It will place the single docs first and the nested ones at the bottom!
 */
export async function buildMergedDoc(token_v2: string, pageId: string) {
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
        traverseAndBuild("/", $);

        // return;

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




// path needs to be relative to inputFilePath
const traverseAndBuild = (currRelDirPath: string, $: CheerioAPI) => {
    const currDirPath = path.join(inputFileDirPath, currRelDirPath);

    // we are sure that it needs to be directory to reach here

    let files = readdirSync(currDirPath, {
        withFileTypes: true,
    });
    // ! DEBUG
    // files = files.slice(0, 2);
    // devLogger.debug("Slicing the files array to 5")

    let numberOfFiles = files.length;
    devLogger.info(`Files array size: ${numberOfFiles}`);

    let nonLeafNodesInCurrentDir: string[] = []; // store the dir names only. (We know that .html ext version also exists)

    for (let file of files) {
        let fileName = file.name;
        let filePath = path.join(currDirPath, fileName);


        if (file.isFile()) {
            let tmp = fileName.split('.');
            let fileWithoutExt = tmp.slice(0, -1).join('.');
            let extention = tmp[tmp.length - 1];
            if (extention && extention != 'html') {
                // it's a asset file (image) copy
                // * Updated Note: No need to copy as the [src] attribute will be made relative in processHtml
                // let outputFilePath = path.join(currOutputDirPath, fileName);
                // copySync(filePath, outputFilePath, { recursive: true });
            } else {
                // it's an html doc
                // check if there exist a directory
                // if there is a directory
                // then process this doc later
                // else include this right away
                if (existsSync(path.join(currDirPath, fileWithoutExt))) {
                    // include for later
                    nonLeafNodesInCurrentDir.push(fileWithoutExt);
                } else {
                    // process now
                    let currHtml = processHtml(filePath, currRelDirPath);
                    $('body').append(currHtml('.prime-chapter-instance'));
                    // console.log("Only file Processing:::: ", file.name)
                }
            }
        }
    }

    for (let file of files) {
        // if the file is in nonLeafNodesInCurrDir
        // then recursively call
        // else the folder only contains assets
        // copy it
        let fileName = file.name;
        let filePath = path.join(currDirPath, fileName);

        if (file.isDirectory()) {
            let tmp = nonLeafNodesInCurrentDir.find(e => e === file.name);
            if (!tmp) {
                // it's an asset only folder
                // * Updated Note: No need to copy as the [src] attribute will be made relative in processHtml
                // let outputFilePath = path.join(currOutputDirPath, file.name);
                // copySync(filePath, outputFilePath, { recursive: true });
            } else {
                // TODO: make the document too
                let currHtml = processHtml(`${filePath}.html`, currRelDirPath);
                $('body').append(currHtml('.prime-chapter-instance'));
                // console.log("Recursive Call to directory:::: ", file.name)
                traverseAndBuild(path.join(currRelDirPath, file.name), $);
            }
        }
    }
}

const processHtml = (filePath: string, currRelPath: string) => {
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
            devLogger.info(`Updating img 'src' attribute [${src}]`);
            item.attribs.src = tmp;
        }
    })
    return currHtml;
}