import { load } from "cheerio";
import {readFileSync, readdirSync, lstatSync, writeFile} from 'fs-extra';
import path from "path";
import devLogger from "./logger/devLogger";
import { exportToEBook } from "./utils/convertHtml";
import {  baseHtmlFilePath, cssFilesArray, inputFileDirPath, outputFileDirPath, tmpOutputHtmlFilePath } from "./utils/config";
import { createDirs } from "./utils/createDirs";


async function main() {
    devLogger.info("Starting operation");
    devLogger.info("Creating Output Dir if it's not present");
    createDirs();

    let files = readdirSync(inputFileDirPath);
    // ! DEBUG
    files = files.slice(0, 5);
    devLogger.debug("Slicing the files array to 5")

    let numberOfFiles = files.length;
    devLogger.info(`Files array size: ${numberOfFiles}`);

    let baseHtmlContent = readFileSync(baseHtmlFilePath);
    let $ = load(baseHtmlContent);

    for (let i = 0; i < numberOfFiles; i++) {
        let file = files[i];
        
        devLogger.info(`Processing file: ${file}`);
        let fileContent = readFileSync(path.join(inputFileDirPath, file), { encoding: 'utf-8' });
        let currHtml = load(fileContent);

        currHtml.root().find('body').each((i, item) => {
            item.tagName = 'section';
            item.attribs = {
                ...item.attribs,
                "class": "prime-chapter-instance",
                "style": "page-break-after:always"
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
    writeFile(tmpOutputHtmlFilePath, fileContent);
    devLogger.info(`Exporting the HTML To Ebook`)
    exportToEBook();
    devLogger.info(`Operation Successful. Exiting.`)
}



// TODO: Take the title and other metadata
main();

