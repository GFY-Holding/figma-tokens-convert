import fs from 'fs';

export const getJson = (path: string): object => {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    throw new Error(`Error reading JSON file: ${error.message}`);
  }
};

export const startCssFile = (path: string) => {
  const comment = `/**
* Do not edit directly;
* This file is generated dynamically by the design-tokens-to-css-variables package.
* Generated on ${new Date().toString()}
*/
\n:root {`;

  // Write the comment at the top of the file
  fs.writeFileSync(path, comment, { flag: 'w' });
};

export const endCssFile = (path: string) => fs.writeFileSync(path, '\n}', { flag: 'a' });
