import { load } from "cheerio";
import fs from 'fs-extra';
import path from "path";
import devLogger from "./logger/devLogger";


const inputFileDirPath = path.join(".", "data");
const outputFileDirPath = path.join(".", "output"); // if dir not present it will be created
const assetsDirPath = path.join(".", "assets"); 

async function main() {
    devLogger.info("Starting operation");

    let files = fs.readdirSync(inputFileDirPath);
    // ! DEBUG
    files = files.slice(0, 5);
    devLogger.debug("Slicing the files array to 5")

    let numberOfFiles = files.length;
    devLogger.info(`Files array size: ${numberOfFiles}`);

    let baseHtmlContent=fs.readFileSync(path.join(assetsDirPath,'base.html'));
    let $ = load(baseHtmlContent);

    for (let i = 0; i < numberOfFiles; i++) {
        let file = files[i];
        devLogger.info(`Processing file: ${file}`);
        let fileContent = fs.readFileSync(path.join(inputFileDirPath, file), { encoding: 'utf-8' });
        let currHtml = load(fileContent);

        currHtml.root().find('body').each((i, item) => {
            item.tagName = 'section';
            item.attribs={
                ...item.attribs,
                "class": "prime-chapter-instance",
                "style": "page-break-after:always"
            }
        })


        $('body').append(currHtml('.prime-chapter-instance'));
    }

    let finalContent=$.root().html() as string;

    fs.mkdirSync(outputFileDirPath, {recursive: true});
    fs.writeFileSync(path.join(outputFileDirPath, "index-merged.html"), finalContent);

    // copy assets folder
    fs.copySync(path.join(assetsDirPath, "css"), path.join(outputFileDirPath, "css"));
}

main();

