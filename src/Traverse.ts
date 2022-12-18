import fs from 'fs';
import { getJson, startCssFile, endCssFile } from './utils';

export class Converter {
  private jsonPath: string;
  private outputPath: string;
  private tokenData: object;
  private prefix: string;

  constructor(jsonPath: string, outputPath: string, prefix: string) {
    this.jsonPath = jsonPath;
    this.outputPath = outputPath;
    this.prefix = prefix;

    this.tokenData = getJson(this.jsonPath);

    // Start the output css file
    startCssFile(this.outputPath);
  }

  public parse_all(callback: Function, verbose: boolean = false): Error | void {
    // Loop over tokens_data keys
    try {
      for (let key in this.tokenData) {
        if (verbose) console.log(`🔎 Parsing ${key} ...`);
        this.parse_tokens(key, callback);
      }
    } catch (error: any) {
      return error;
    }

    this.close(() => {
      console.log(`🏁 Finished ${this.outputPath} ...`);
    });
  }

  public parse_tokens(token_name: string, callback: Function, verbose: boolean = false) {
    if (verbose) console.log(`🍕 Parsing ${token_name}...`);
    let output: Error | void = this.process_tree(token_name as keyof typeof Object);

    // If process_tree returns an error, return it
    if (output instanceof Error) {
      callback(output);
    }

    callback();
  }

  // Processes one kind of design tokens
  private process_tree(token_name: keyof typeof Object): void | Error {
    try {
      // Get all children by token name
      let key = token_name as keyof typeof this.tokenData;
      if (!(key in this.tokenData)) throw new Error(`Token ${key} does not exist in ${this.jsonPath}.`);

      let children: object = this.tokenData[key];

      // convert child tokens to css variables
      let names_array: Array<string> = [token_name];

      let css_vars = this.traverse(children, names_array);
      this.append_css_vars_to_file(this.prefix, css_vars, this.outputPath);
    } catch (error: any) {
      return error;
    }
  }

  private append_css_vars_to_file(prefix: string, variable_list: Array<string>, output_file_path: string) {
    variable_list.forEach((item: string) => {
      fs.writeFileSync(output_file_path, `\n\t--${prefix}-${item};`, { flag: 'a' });
    });
  }

  private traverse(obj: object, names_array: Array<string>): Array<string> {
    // List of css variables to be returned
    let localList: Array<string> = [];

    // Loop over the children
    for (var key in obj) {
      // If the key is not a property of the object - continue
      if (obj.hasOwnProperty(key)) {
        let key_type = key as keyof typeof obj;

        // Check if the value is in an object
        let value = obj[key_type]['value'];
        let type = obj[key_type]['type'];

        // If there is no value - continue traversing
        if (value === undefined && typeof obj[key as keyof typeof obj] == 'object') {
          localList = localList.concat(this.traverse(obj[key_type], names_array.concat(key)));
        }

        // Convert the value to css variable and append.
        else if (value !== undefined) {
          // If the value type is color
          if (type === 'color') {
            let css_var = this.names_to_css(names_array.concat(key), obj[key_type]['value']);
            localList.push(css_var);
          }

          // If the value type is custom-gradient
          else if (type === 'custom-gradient') {
            let gradientType: string = value['gradientType'];
            let new_names_array = names_array.concat(key);
            let css_var: string = '';

            let color_1: string = value['stops'][0]['color'];
            let color_2: string = value['stops'][1]['color'];

            if (gradientType === 'linear') {
              let rotation: string = value['rotation'];

              css_var = this.names_to_css(
                new_names_array,
                `${gradientType}-gradient(${rotation}deg, ${color_1}, ${color_2})`,
              );
            } else if (gradientType === 'radial') {
              css_var = this.names_to_css(new_names_array, `${gradientType}-gradient(${color_1}, ${color_2})`);
            } else {
              console.log(`⚠️ No gradient type found: ${gradientType}`);
            }

            // Push the css variable to the list
            // if it is not empty
            if (css_var !== '') localList.push(css_var);
          } else if (type === 'custom-fontStyle') {
            Object.keys(value).forEach((fontStyle: string) => {
              let style: string = value[fontStyle];

              // If string only contains numbers - add px to the end
              if (/^\d+$/.test(style)) style = style + 'px';

              let css_var = this.names_to_css(names_array.concat(key, fontStyle), style);
              localList.push(css_var);
            });
          } else if (type === 'custom-shadow') {
            let type = value['shadowType'];
            let offsetX = value['offsetX'];
            let offsetY = value['offsetY'];
            let radius = value['radius'];
            let color = value['color'];

            let css_var = this.names_to_css(names_array.concat(key, type), `${offsetX} ${offsetY} ${radius} ${color}`);

            localList.push(css_var);
          } else if (type === 'custom-grid') {
            let gutterSizeValue = value['gutterSize'];
            let alignmentValue = value['alignment'];
            let countValue = value['count'];
            let offsetValue = value['offset'];

            let gutterSize = this.names_to_css(names_array.concat(key, 'size'), `${gutterSizeValue}px`);
            let alignment = this.names_to_css(names_array.concat(key, 'alignment'), `${alignmentValue}`);
            let count = this.names_to_css(names_array.concat(key, 'count'), `${countValue}`);
            let offset = this.names_to_css(names_array.concat(key, 'offset'), `${offsetValue}px`);

            localList.push(gutterSize);
            localList.push(alignment);
            localList.push(count);
            localList.push(offset);
          } else {
            let css_var = this.names_to_css(names_array.concat(key), value);
            localList.push(css_var);
          }
        }
      }
    }
    return localList;
  }

  private names_to_css(names_array: Array<string>, value: string): string {
    let css_var = names_array.join('-');

    // Replace spaces with dashes
    css_var = css_var.replace(/\s+/g, '-');

    css_var = `${css_var}: ${value}`;
    return css_var;
  }

  public close(callback: Function = () => {}) {
    endCssFile(this.outputPath);
    callback();
  }
}
