import { load } from "cheerio";
import {readFileSync, readdirSync, writeFileSync, lstatSync, copySync} from 'fs-extra';
import path from "path";
import devLogger from "./logger/devLogger";
import { exportToEBook } from "./utils/convertHtml";
import {  baseHtmlFilePath, cssFilesArray, inputFileDirPath, outputFileDirPath, tmpOutputHtmlFilePath } from "./utils/config";
import { createDirs } from "./utils/createDirs";
import { isFileSystemPath } from "./utils/isFileSystemPath";


async function main() {
    devLogger.info("Starting operation");
    devLogger.info("Creating Output Dir if it's not present");
    createDirs();

    let files = readdirSync(inputFileDirPath);
    // ! DEBUG
    // files = files.slice(0, 2);
    // devLogger.debug("Slicing the files array to 5")

    let numberOfFiles = files.length;
    devLogger.info(`Files array size: ${numberOfFiles}`);

    let baseHtmlContent = readFileSync(baseHtmlFilePath);
    let $ = load(baseHtmlContent);

    for (let i = 0; i < numberOfFiles; i++) {
        let file = files[i];
        let filePath=path.join(inputFileDirPath, file);
        if(lstatSync(filePath).isDirectory()){
            // TODO: We need to move these assets
            devLogger.info(`Copying [${filePath}]`)
            let outputFilePath=path.join(outputFileDirPath, file);
            copySync(filePath, outputFilePath, {recursive: true});
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
            let src=item.attribs.src;
            if(isFileSystemPath(src)){
                devLogger.info(`Updating img 'src' attribute [${src}]`);
                item.attribs.src=path.join(outputFileDirPath, src)
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
}


main();

