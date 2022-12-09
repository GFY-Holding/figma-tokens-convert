const fs = require('fs');

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

// Parse the JSON string into a JavaScript object
let data = JSON.parse(jsonData);

const comment = `/**
 * Do not edit directly
 * Generated on ${new Date().toString()}
 */
 \n:root {`;

// Write the comment at the top of the file
fs.writeFileSync(filePath2, comment, { flag: 'w' });
console.log(`⭐ Successfully created ${filePath2} and wrote comment.\n`);

// Tranform colors
try {
    (() => {
        let colorTokens = data["color"];
        let colorTranformed = '';
        for (let key in colorTokens) {
        
            let tokens = Object.keys(colorTokens[key]);
            
            // loop over tokens
            for (let token_key of tokens) {
                let value = colorTokens[key][token_key].value;
                let second_depth_key = null;
        
                // Check if value is undefined
                if (value === undefined) {
                    second_depth_keys = Object.keys(colorTokens[key][token_key]);
                    
                    // loop over seocnd_depth_keys
                    for (let second_depth_key of second_depth_keys) {
                        value = colorTokens[key][token_key][second_depth_key].value;
                        colorTranformed += `\n\t--${prefix}-color-${key}-${token_key}-${second_depth_key}: ${value};`;
                    }
                }else {
                    colorTranformed += `\n\t--${prefix}-color-${key}-${token_key}: ${value};`;
                }
            }
        }
        
        // Write the colors to the file
        fs.writeFileSync(filePath2, colorTranformed, { flag: 'a' });
        console.log(`🎨 Successfully wrote colors to ${filePath2}.`);
    })();
} catch (error) {
    console.log(`⚠️ Error: ${error}`);
}

// Transform gradients
try {
    (() => {
    let gradientTokens = data["gradient"];
    let gradientTranformed = '';
    for (let key in gradientTokens) {

        let tokens = Object.keys(gradientTokens[key]);
        
        // loop over tokens
        for (let token_key of tokens) {
            let value = gradientTokens[key][token_key].value;

            if (value.gradientType === "linear")
            {
                gradientTranformed += `\n\t--${prefix}-gradient-${key}-${token_key}: linear-gradient(${value.rotation}deg, ${value.stops[0].color}, ${value.stops[1].color});`;
            }else if (value.gradientType === "radial")
            {
                gradientTranformed += `\n\t--${prefix}-gradient-${key}-${token_key}: radial-gradient(${value.stops[0].color}, ${value.stops[1].color});`;
            }else {
                console.log(`⚠️ No gradient type found: ${value.gradientType}`)
            }
        }
    }

    // Write gradients to the file
    fs.writeFileSync(filePath2, gradientTranformed, { flag: 'a' });
    console.log(`🌈 Successfully wrote gradients to ${filePath2}.`);
    })();
} catch (error) {
    console.log(`⚠️ Error: ${error}`);
}

// Transform font
try {
    (() => {

        let fontTokens = data["font"];
        let fontTranformed = '';
        for (let type in fontTokens) {
            
            let tokens = Object.keys(fontTokens[type]);
            
            // loop over tokens
            for (let token_key of tokens) {

                let value = fontTokens[type][token_key].value;

                // Write css variables
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-font-size: ${value.fontSize};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-text-decoration: ${value.textDecoration};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-font-family: ${value.fontFamily};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-font-weight: ${value.fontWeight};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-font-style: ${value.fontStyle};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-font-stretch: ${value.fontStretch};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-letter-spacing: ${value.letterSpacing};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-line-height: ${value.lineHeight};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-paragraph-indent: ${value.paragraphIndent};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-paragraph-spacing: ${value.paragraphSpacing};`;
                fontTranformed += `\n\t--${prefix}-font-${type}-${token_key}-text-case: ${value.textCase};`;
            }
        }

        // Write fonts to the file
        fs.writeFileSync(filePath2, fontTranformed, { flag: 'a' });
        console.log(`📝 Successfully wrote fonts to ${filePath2}.`);

    })();
} catch (error) {
    console.log(`⚠️ Error: ${error}`);
}

// Transform effect
try {
    (() => {

        let effectTokens = data["effect"];
        let effectTranformed = '';
        for (let type in effectTokens) {
            
            let tokens = Object.keys(effectTokens[type]);

            // loop over tokens
            for (let token_key of tokens) {

                let value = effectTokens[type][token_key].value;

                if (value.shadowType === "dropShadow")
                {
                    effectTranformed += `\n\t--${prefix}-effect-${type}-${token_key}-drop-shadow: ${value.offsetX} ${value.offsetY} ${value.radius} ${value.color};`;
                }else if (value.shadowType === "innerShadow")
                {
                    effectTranformed += `\n\t--${prefix}-effect-${type}-${token_key}-inner-shadow: ${value.offsetX} ${value.offsetY} ${value.radius} ${value.color};`;
                }else {
                    console.log(`⚠️ No shadow type found: ${value.shadowType}`)
                }
            }
        }

        // Write effects to the file
        fs.writeFileSync(filePath2, effectTranformed, { flag: 'a' });
        console.log(`✨ Successfully wrote effects to ${filePath2}.`);

    })();
} catch (error) {
    console.log(`⚠️ Error: ${error}`);
}

// End file with closing bracket
fs.writeFileSync(filePath2, '\n}', { flag: 'a' });
console.log(`\n🏁 Successfully closed ${filePath2}.`);
