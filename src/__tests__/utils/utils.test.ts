import { getJson, startCssFile, endCssFile } from '../../utils';

import fs from 'fs';

describe('getJson', () => {
  it('Should return an object', () => {
    const filePath = './src/__tests__/example_files/example-design-tokens.tokens.json';
    const expectedResult = { foo: 'bar' };
    const result = getJson(filePath);

    expect(result).toEqual(expectedResult);
  });
});

describe('startCssFile', () => {
  it('Should create a new css file and write a comment on top of it', () => {
    const filePath = './src/__tests__/example_files/example.css';
    const expectedResult = `/**
* Do not edit directly;
* This file is generated dynamically by the design-tokens-to-css-variables package.
* Generated on ${new Date().toString()}
*/

:root {`;

    startCssFile(filePath);

    // Read the file and compare the result
    const result = fs.readFileSync(filePath, 'utf-8');

    expect(result).toEqual(expectedResult);
  });
});

describe('endCssFile', () => {
  it('Should write a closing bracket at the end of the file', () => {
    const filePath = './src/__tests__/example_files/example.css';
    const expectedResult = `/**
* Do not edit directly;
* This file is generated dynamically by the design-tokens-to-css-variables package.
* Generated on ${new Date().toString()}
*/

:root {
}`;

    endCssFile(filePath);

    // Read the file and compare the result
    const result = fs.readFileSync(filePath, 'utf-8');

    // Delete the css file
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });

    expect(result).toEqual(expectedResult);
  }); 
});