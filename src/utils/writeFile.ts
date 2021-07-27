import { writeFileSync } from "fs-extra"


export const writeFile = (filePathWithName:string, fileContent:string) => {
    writeFileSync(filePathWithName, fileContent);
}