import path from "path";

export const rootDir=process.cwd();

export const inputFileDirPath = path.join(rootDir, "data");
export const outputFileDirPath = path.join(rootDir, "output"); // if dir not present it will be created
export const assetsDirPath = path.join(rootDir, "assets");

export const baseHtmlFilePath=path.join(assetsDirPath, 'base.html');
export const tmpOutputHtmlFilePath=path.join(outputFileDirPath, 'tmp.html');
export const finalEBookOutputPath=path.join(process.cwd(), 'output', 'prime_book.pdf');

export const cssFilesArray = [
    path.join(assetsDirPath, 'css', 'global.css'),
    path.join(assetsDirPath, 'css', 'notion_export_default.css'),
];


export const htmlToEBookConfig = {
    headerHtmlPath: path.join(assetsDirPath, "header", "index.html"),
    xslStyleSheetPath: path.join(assetsDirPath, 'toc', 'styles.xls'),
    coverHtmlPath: path.join(assetsDirPath, 'cover', 'index.html'),
    outputEBookFilePath: path.join(outputFileDirPath, 'prime_book.pdf')
};

