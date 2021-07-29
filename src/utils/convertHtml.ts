import { execFileSync } from "child_process";
import path from "path"
import devLogger from "../logger/devLogger";
import { finalEBookOutputPath, htmlToEBookConfig, tmpOutputHtmlFilePath } from "./config";


let isMac = process.platform === 'darwin'

const pathToWkhtmltopdfBinaryDir = path.join(process.cwd(), 'bin', 'wkhtmltopdf')

let wkhtmltopdf = path.join(pathToWkhtmltopdfBinaryDir, 'wkhtmltopdf')



export function exportToEBook() {
    try {
        devLogger.info(`Saving Ebook at [${finalEBookOutputPath}]`);
        `wkhtmltopdf --enable-local-file-access  10  `
        execFileSync(wkhtmltopdf, ['--enable-local-file-access',
            '--margin-bottom',
            '10',
            '--margin-top',
            '15',
            '--header-spacing',
            '5', '--header-html',
            htmlToEBookConfig.headerHtmlPath,
            'cover',
            htmlToEBookConfig.coverHtmlPath,
            'toc',
            '--xsl-style-sheet',
            htmlToEBookConfig.xslStyleSheetPath,
            tmpOutputHtmlFilePath,
            finalEBookOutputPath
        ])
        devLogger.info(`Ebook Saved Successfully`);
    } catch (err) {
        devLogger.error(err);
    }
}

