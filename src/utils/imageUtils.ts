export const uriToBlob = async (uri: string): Promise<Blob | null> => {
    if (!uri) {
        return null;
    }
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error("Error converting URI to Blob:", error);
        return null;
    }
};

export const uriToFile = async (uri: string, name: string, type: string): Promise<File | null> => {
    const blob = await uriToBlob(uri);
    if (!blob) {
        return null;
    }
    // Use the File constructor to create a proper File object
    // The lastModified date can be set to the current timestamp or 0 if not relevant
    return new File([blob], name, { type: type, lastModified: Date.now() });
};