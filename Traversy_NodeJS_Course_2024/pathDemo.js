import path from 'path';
import { fileURLToPath } from 'url';

const filePath = fileURLToPath(import.meta.url);
console.log('FilePath');
console.log(filePath);

const dirName = path.dirname(filePath)
console.log('DirName');
console.log(dirName);

//basename()
console.log('Basename');
console.log(path.basename(filePath));

//dirname()
console.log('Dirname');
console.log(path.dirname(filePath));

//extname()
console.log('Extname');
console.log(path.extname(filePath));

//parse
console.log('Parse');
console.log(path.parse(filePath));

//join()
const filePath2 = path.join(dirName, 'dir1', 'dir2', 'test.txt')
console.log('FilePath Join');
console.log(filePath2);