import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const timer = 1_000;
    const spyCallback = jest.fn();
    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(spyCallback, timer);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(spyCallback, timer);
  });

  test('should call callback only after timeout', () => {
    const timer = 1_000;
    const spyCallback = jest.fn();
    jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(spyCallback, timer);
    jest.runAllTimers();

    expect(setTimeout).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const timer = 1_000;
    const spyCallback = jest.fn();
    jest.spyOn(global, 'setInterval');

    doStuffByInterval(spyCallback, timer);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(spyCallback, timer);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const timer = 1_000;
    const spyCallback = jest.fn();
    jest.spyOn(global, 'setInterval');

    doStuffByInterval(spyCallback, timer);
    expect(spyCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(timer);
    expect(spyCallback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(timer);
    expect(spyCallback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  const filePath = 'file.txt';

  test('should call join with pathToFile', async () => {
    const mockedJoin = jest.spyOn(path, 'join');
    expect.assertions(1);
    await readFileAsynchronously(filePath);

    expect(mockedJoin).toHaveBeenCalledWith(__dirname, filePath);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    expect.assertions(1);
    const result = await readFileAsynchronously(filePath);

    expect(result).toBe(null);
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(path, 'join').mockReturnValue(filePath);
    jest.spyOn(fsPromises, 'readFile').mockResolvedValue(filePath);

    expect.assertions(1);
    const result = await readFileAsynchronously(filePath);

    expect(result).toBe(filePath);
  });
});
