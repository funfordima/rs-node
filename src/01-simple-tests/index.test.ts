import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const testList = [-5, 0, 5];
    const parameter = 2;
    const resultList = [-3, 2, 7];

    testList.forEach((n, i) => {
      const result = simpleCalculator({
        a: n,
        b: parameter,
        action: Action.Add,
      });

      expect(result).toBe(resultList[i]);
    });
  });

  test('should subtract two numbers', () => {
    const testList = [-5, 0, 5];
    const parameter = 2;
    const resultList = [-7, -2, 3];

    testList.forEach((n, i) => {
      const result = simpleCalculator({
        a: n,
        b: parameter,
        action: Action.Subtract,
      });

      expect(result).toBe(resultList[i]);
    });
  });

  test('should multiply two numbers', () => {
    const testList = [-5, 0, 5];
    const parameter = 2;
    const resultList = [-10, 0, 10];

    testList.forEach((n, i) => {
      const result = simpleCalculator({
        a: n,
        b: parameter,
        action: Action.Multiply,
      });

      expect(result).toBe(resultList[i]);
    });
  });

  test('should divide two numbers', () => {
    const testList = [-6, 0, 6];
    const parameter = 2;
    const resultList = [-3, 0, 3];

    testList.forEach((n, i) => {
      const result = simpleCalculator({
        a: n,
        b: parameter,
        action: Action.Divide,
      });

      expect(result).toBe(resultList[i]);
    });
  });

  test('should exponentiate two numbers', () => {
    const testList = [-5, 0, 5];
    const parameter = 2;
    const resultList = [25, 0, 25];

    testList.forEach((n, i) => {
      const result = simpleCalculator({
        a: n,
        b: parameter,
        action: Action.Exponentiate,
      });

      expect(result).toBe(resultList[i]);
    });
  });

  test('should return null for invalid action', () => {
    const testList = [-5];
    const parameter = 2;

    testList.forEach((n) => {
      const result = simpleCalculator({
        a: n,
        b: parameter,
        action: 'InvalidAction',
      });

      expect(result).toBe(null);
    });
  });

  test('should return null for invalid arguments', () => {
    const testList = [-5];
    const parameter = 'number';

    testList.forEach((n) => {
      const result = simpleCalculator({
        a: n,
        b: parameter,
        action: Action.Add,
      });

      expect(result).toBe(null);
    });
  });
});
