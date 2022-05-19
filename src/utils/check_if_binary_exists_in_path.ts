import { statSync } from "fs";
import path from "path";

/**
 * Utility function to check if a specific binary is present in path
 *
 * Credits: https://github.com/springernature/hasbin/blob/master/lib/hasbin.js
 * @param binaryName: Name of the binary which you want to check
 * @returns: true if the binary is present in PATH; false otherwise
 */
export function checkIfBinaryIsInPathExists(binaryName: string): boolean {
	var envPath = process.env.PATH || "";
	var envExt = process.env.PATHEXT || "";

	return envPath
		.replace(/["]+/g, "")
		.split(path.delimiter)
		.map(function (chunk) {
			return envExt.split(path.delimiter).map(function (ext) {
				return path.join(chunk, binaryName + ext);
			});
		})
		.reduce(function (a, b) {
			return a.concat(b);
		})
		.some((filePath, indx, _) => {
			try {
				return statSync(filePath).isFile();
			} catch {
				// incase there is no file exist then error will be thrown
				return false;
			}
		});
}
