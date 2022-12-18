import fs from 'fs';
import { Converter } from './Traverse';

// Get the first three arguments
const filePath1 = process.argv[2];
const filePath2 = process.argv[3];
const prefix = process.argv[4] !== undefined ? process.argv[4] : 'token';

// Error if any of 2 fields are empty or non-existent or undefined
if (!filePath1 || !filePath2) {
  console.error('Please provide 2 file paths');
  process.exit(1);
}

// Before reading the file, check if it exists
if (!fs.existsSync(filePath1)) {
  console.error('File does not exist');
  process.exit(1);
}

// Read the JSON file
const converter = new Converter(filePath1, filePath2, prefix);

console.log(`🏃 Creating ${filePath2} 💨\n`);
converter.parse_all((err: Error) => {
  if (err) {
    console.log(`⚠️  ${err}`);
    process.exit(1);
  } else console.log(`✅ Done\n`);
}, true);
