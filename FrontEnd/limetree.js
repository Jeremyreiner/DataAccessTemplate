console.log('LETS GET SOME LIMES BRO 🍋🍋🍋');


const fs = require('fs');
const path = require('path');

// Define the directory to scan for TypeScript files
const rootDir = './src';

// Define the name of the index file
const indexFileName = 'index.ts';

// Define an array of file names to exclude
const excludedFileNames = [
  'environment.ts',
  'zone-flags.ts',
  'cache.service.ts',
];

// Define the function to recursively scan the directory and generate index files
const generateIndexFiles = (dirPath) => {
  // Read the contents of the directory
  const files = fs.readdirSync(dirPath);
  // Define an array to store the TypeScript files and child directories
  const tsFilesAndDirs = [];

  // Loop through each file and directory
  files.forEach((file) => {
    // Get the full path of the file or directory
    const filePath = path.join(dirPath, file);
    // Get the stats of the file or directory
    const stats = fs.statSync(filePath);

    // If it's a TypeScript file or a TypeScript component file, and it's not in the excluded file names array, add it to the array
    if (stats.isFile() && (path.extname(file) === '.ts' || path.extname(file) === '.component.ts') && file !== indexFileName && !excludedFileNames.includes(file)) {
      tsFilesAndDirs.push(`export * from './${path.basename(file, '.ts')}';`);
    }

    // If it's a directory, add it to the array and recursively call the function
    if (stats.isDirectory()) {
      tsFilesAndDirs.push(`export * from './${file}';`);
      generateIndexFiles(filePath);
    }
  });

  // If the array is not empty, write it to an index file
  if (tsFilesAndDirs.length > 0) {
    const indexFilePath = path.join(dirPath, indexFileName);
    fs.writeFileSync(indexFilePath, tsFilesAndDirs.join('\n'), { encoding: 'utf-8' });
  }
};

// Call the function to generate the index files
generateIndexFiles(rootDir);

console.log('LIMES ARE DONE 🍋🍋🍋');
console.log('      ץעה ירפ ארוב םלועה ךלמ וניהלא "ה התא ךורב          🍋🍋🍋');
