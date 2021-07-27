


export const isFileSystemPath = (str: string) => {
    return str.match(/(https?:\/\/)|(www\.)/gi) == null;
}