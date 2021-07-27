import { mkdirSync } from "fs-extra"
import { outputFileDirPath } from "./config";


export const createDirs=() => {
    let dirs=[outputFileDirPath];
    dirs.forEach(e => {
        mkdirSync(outputFileDirPath, {recursive: true});
    })
}