import path from "path";

export const packageRootDir = path.join(__dirname, "..", "..");

export const processRootDir = process.cwd();
export const sessionFilesDir = path.join(processRootDir, "session_files");

export const inputFileDirPath = path.join(sessionFilesDir, "input"); // change to input
export const outputFileDirPath = path.join(sessionFilesDir, "output"); // if dir not present it will be created
export const tmpDirPath = path.join(sessionFilesDir, "tmp"); // if dir not present it will be created

export const tmpDownloadZipFileFromNotionPath = path.join(
	tmpDirPath,
	"data.zip"
);

export const assetsDirPath = path.join(packageRootDir, "assets");

export const baseHtmlFilePath = path.join(assetsDirPath, "base.html");
export const tmpOutputHtmlFilePath = path.join(tmpDirPath, "tmp.html");
export const finalMergedDocOutputPath = path.join(
	outputFileDirPath,
	"merged",
	"prime_book.pdf"
);
export const finalStandaloneDocsBaseDirOutputPath = path.join(
	outputFileDirPath,
	"standalone"
);

export const cssFilesArray = [
	path.join(assetsDirPath, "css", "global.css"),
	path.join(assetsDirPath, "css", "notion_export_default.css"),
];

export const htmlToEBookConfig = {
	headerHtmlPath: path.join(assetsDirPath, "header", "index.html"),
	xslStyleSheetPath: path.join(assetsDirPath, "toc", "styles.xls"),
	coverHtmlPath: path.join(assetsDirPath, "cover", "index.html"),
	outputEBookFilePath: path.join(outputFileDirPath, "prime_book.pdf"),
};
