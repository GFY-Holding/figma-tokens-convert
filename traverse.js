const fs = require('fs');

// Accepts a list of names and a value and returns a css variable
function names_to_css(names, value) {
    let css = '';
    let name = names.join('-');

    // Parse spaces from the name
    name = name.replace(/\s+/g, '-').toLowerCase();

    // Parse & from the name
    name = name.replace(/&/g, 'and');

    // Parse % from the name
    name = name.replace(/%/g, 'percent');

    css += `${name}: ${value}`;
    return css;
}

// Recursively traverse the object untill value is found
// Returns a list of css variables
function traverse(obj, parent_names) {
    let localList = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {

            // Check if the value is in an object
            let value = obj[key].value;
            let type = obj[key].type;
            
            // If there is no value - continue traversing
            if (value === undefined && typeof obj[key] == "object") {
                localList = localList.concat(traverse(obj[key], parent_names.concat(key)));
            }
            
            // Convert the value to css variable and append.
            else if (value !== undefined) {

                if (type === "color") {
                    let css_var = names_to_css(parent_names.concat(key), obj[key].value);                        
                    localList.push(css_var);
                }
                
                else if (type === "custom-gradient") {

                    if (value.gradientType === "linear") {
                        let css_var = names_to_css(parent_names.concat(key), `linear-gradient(${value.rotation}deg, ${value.stops[0].color}, ${value.stops[1].color})`);                        
                        localList.push(css_var);
                    } 
                    else if (value.gradientType === "radial"){
                        let css_var = names_to_css(parent_names.concat(key), `radial-gradient(${value.stops[0].color}, ${value.stops[1].color})`);                        
                        localList.push(css_var);
                    }else {
                        console.log(`⚠️ No gradient type found: ${value.gradientType}`)
                    }
                }

                else if (type === "custom-fontStyle") {
                    for (let fontStyle in value) {

                        // Put font family in quotes
                        if (fontStyle === "fontFamily") {
                            value[fontStyle] = `"${value[fontStyle]}"`;
                        }

                        // Convert font size to px
                        if (fontStyle === "fontSize") {
                            value[fontStyle] = `${value[fontStyle]}px`;
                        }

                        // Convert line height to px
                        if (fontStyle === "lineHeight") {
                            value[fontStyle] = `${value[fontStyle]}px`;
                        }

                        let css_var = names_to_css(parent_names.concat(key, fontStyle), value[fontStyle]);                        
                        localList.push(css_var);
                    }
                }

                else if (type === "custom-shadow") {
                    let css_var = names_to_css(parent_names.concat(key, value.shadowType), `${value.offsetX} ${value.offsetY} ${value.radius} ${value.color}`);                        
                    localList.push(css_var);
                }

                else if (type === "custom-grid") {
                    let gutterSize = names_to_css(parent_names.concat(key, 'size'), `${value.gutterSize}px`);                        
                    let alignment = names_to_css(parent_names.concat(key, 'alignment'), `${value.alignment}`);                        
                    let count = names_to_css(parent_names.concat(key, 'count'), `${value.count}`);                        
                    let offset = names_to_css(parent_names.concat(key, 'offset'), `${value.offset}px`);                        
                    
                    localList.push(gutterSize);
                    localList.push(alignment);
                    localList.push(count);
                    localList.push(offset);
                }

                else {
                    let css_var = names_to_css(parent_names.concat(key), value);                        
                    localList.push(css_var);
                }
            }
        }
    }
    return localList;
}

// Appends the css variables to the file
function append_css_to_file(prefix, list, file) {
    list.forEach((item) => {
        fs.writeFileSync(file
            , `\n\t--${prefix}-${item};`
            , { flag: 'a' });
    });
}

function start_file(file) {
    const comment = `/**
    * Do not edit directly
    * Generated on ${new Date().toString()}
    */
    \n:root {`;

    // Write the comment at the top of the file
    fs.writeFileSync(file, comment, { flag: 'w' });
}

function end_file(file) {
    // Write the comment at the top of the file
    fs.writeFileSync(file, '\n}', { flag: 'a' });    
}

// Processes one kind of design tokens
function process_tokens(tokens_obj, tokens_type, prefix, file_path) {
    try {
        let effectTokens = tokens_obj[tokens_type];
        let css_vars = traverse(effectTokens, [tokens_type])
        append_css_to_file(prefix, css_vars, file_path);
    } catch (error) {
        console.log(`⚠️ Error: ${error}`);
    }
}

class Converter {
    constructor(tokens_obj, prefix, file_path) {
        this.tokens_obj = tokens_obj;
        this.prefix = prefix;
        this.file_path = file_path;
    }

    parse_tokens(token_name, success_message) {
        process_tokens(this.tokens_obj, token_name, this.prefix, this.file_path);
        console.log(success_message);
    }
}

module.exports = {
    converter: Converter,
    start_file: start_file,
    end_file: end_file
}