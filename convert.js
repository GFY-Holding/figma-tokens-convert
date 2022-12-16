const fs = require('fs');
const traverse = require('./traverse.js');

// Get the first three arguments
const filePath1 = process.argv[2];
const filePath2 = process.argv[3];
const prefix = process.argv[4] !== undefined ? process.argv[4] : "token";

// Error if any of 2 fields are empty or non-existent or undefined
if (!filePath1 || !filePath2) {
    console.log('Please provide 2 file paths');
    process.exit(1);
}

// Before reading the file, check if it exists
if (!fs.existsSync(filePath1)) {
    console.log('File does not exist');
    process.exit(1);
}

// Read the JSON file
let jsonData = fs.readFileSync(filePath1);
let tokens_data = JSON.parse(jsonData);

const converter = new traverse.converter(tokens_data, prefix, filePath2);

traverse.start_file(filePath2)
console.log(`🏃 Creating ${filePath2} 💨\n`);

// Loop over tokens_data keys
for (let key in tokens_data) {
    console.log(`🔎 Parsing ${key} ...`);
    
    converter.parse_tokens(key, `✅ Done`);
    
    console.log('')
}

traverse.end_file(filePath2);
console.log(`🏁 Finished ${filePath2} ...`);