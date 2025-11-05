import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const list = generateLinkedList([1]);
    const expectedResult = {
      value: 1,
      next: {
        value: null,
        next: null,
      },
    };

    expect(list).toStrictEqual(expectedResult);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    expect(generateLinkedList([1, 2])).toMatchSnapshot();
  });
});
