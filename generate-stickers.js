const fs = require('fs');
const path = require('path');

const stickerDir = path.join(__dirname, 'assets', 'images', 'emoge');
const outputPath = path.join(stickerDir, 'index.ts');

fs.readdir(stickerDir, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    const stickerFiles = files.filter(file => file.endsWith('.png'));

    let exportString = `interface EmogeStickersMap {
  [key: string]: any; // Index signature: allows string keys, values are 'any'
}

export const emogeStickers: EmogeStickersMap = {
`;

    stickerFiles.forEach(file => {
        const name = path.parse(file).name;
        exportString += `  ${name}: require('./${file}'),
`;
    });

    exportString += `};\n`;

    fs.writeFile(outputPath, exportString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing index.ts', err);
        } else {
            console.log('Successfully generated assets/images/emoge/index.ts');
        }
    });
});