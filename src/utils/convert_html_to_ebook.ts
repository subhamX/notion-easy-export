import { execFileSync } from "child_process";
import path from "path";
import devLogger from "../logger/dev_logger";
import {
	htmlToEBookConfig,
	packageRootDir,
	tmpOutputHtmlFilePath,
} from "./config";

const pathToWkhtmltopdfBinaryDir = path.join(
	packageRootDir,
	"bin",
	"wkhtmltopdf"
);

let wkhtmltopdf = path.join(pathToWkhtmltopdfBinaryDir, "wkhtmltopdf");

export interface exportToEbookArgs {
	marginBottom?: number;
	marginTop?: number;
	headerSpacing?: number;
	includeCover?: boolean;
	includeTableOfContent?: boolean;
	includeHeader?: boolean;
}

export function exportToEBook(docPath: string, args: exportToEbookArgs) {
	devLogger.info(`Saving Ebook at [${docPath}]`);
	let argsArr: string[] = ["--enable-local-file-access"];

	if (!args.marginBottom) {
		args.marginBottom = 10;
	}
	argsArr.push(...["--margin-bottom", args.marginBottom.toString()]);
	if (!args.marginTop) {
		args.marginTop = 15;
	}
	argsArr.push(...["--margin-top", args.marginTop.toString()]);
	if (!args.headerSpacing) {
		args.headerSpacing = 5;
	}
	argsArr.push(...["--header-spacing", args.headerSpacing.toString()]);

	if (args.includeHeader === undefined) {
		args.includeHeader = true;
	}
	if (args.includeCover === undefined) {
		args.includeCover = true;
	}
	if (args.includeTableOfContent === undefined) {
		args.includeTableOfContent = true;
	}

	if (args.includeHeader) {
		argsArr.push(...["--header-html", htmlToEBookConfig.headerHtmlPath]);
	}
	if (args.includeCover) {
		argsArr.push(...["cover", htmlToEBookConfig.coverHtmlPath]);
	}
	if (args.includeTableOfContent) {
		argsArr.push(
			...["toc", "--xsl-style-sheet", htmlToEBookConfig.xslStyleSheetPath]
		);
	}

	execFileSync(wkhtmltopdf, [...argsArr, tmpOutputHtmlFilePath, docPath]);
	devLogger.info(`Ebook Saved Successfully`);
}
