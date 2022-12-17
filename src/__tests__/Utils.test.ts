import { getJson } from '../utils';

test('reads a JSON file and returns an object', async () => {
  const filePath = './src/__tests__/example_files/example-design-tokens.tokens.json';
  const expectedResult = { foo: 'bar' };
  const result = getJson(filePath);

  expect(result).toEqual(expectedResult);
});
