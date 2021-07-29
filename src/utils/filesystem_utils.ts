import { mkdirSync, readdirSync, rmSync } from "fs-extra"
import devLogger from "../logger/dev_logger";
import { inputFileDirPath, outputFileDirPath, sessionFilesDir, tmpDirPath } from "./config";
import extract from 'extract-zip';
import path from "path";


export const buildSessionDirs=() => {
    devLogger.info("Removing all files in session Files Dir!!!");
    rmSync(sessionFilesDir, {
        recursive: true,
        force: true
    });
    
    devLogger.info("Creating directories in session Files Dir!!!");
    let dirs=[outputFileDirPath, inputFileDirPath, tmpDirPath];
    dirs.forEach(e => {
        mkdirSync(e, {recursive: true});
    })
}


export const isFileSystemPath = (str: string) => {
    return str.match(/(https?:\/\/)|(www\.)/gi) == null;
}

export const extractDataFile = async (sourceZipFilePath: string, destinationDirPath: string) => {
    devLogger.info("Starting file extraction");
    await extract(sourceZipFilePath, { dir: destinationDirPath })
    devLogger.info("File extracted successfully");
}



export const clearDirectoryAndKeepDotFiles = (directoryPath: string) => {
    devLogger.info(`Removing all non dot files and folders from ${directoryPath}`)
    let files = readdirSync(path.join(directoryPath));
    for (let file of files) {
        if (file.match('^[^.].*$') !== null) {
            // removing all those files which aren't starting from '.'
            rmSync(path.join(directoryPath, file), {
                force: true,
                recursive: true,
            })
        }
    }
    devLogger.info(`Files removal success`)
}
