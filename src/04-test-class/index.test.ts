import lodash from 'lodash';
import { getBankAccount, BankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';

describe('BankAccount', () => {
  const testAmount = 500;
  const initialValue = 1_000;
  let bankAccount: BankAccount;

  beforeEach(() => {
    bankAccount = getBankAccount(initialValue);
  });

  test('should create account with initial balance', () => {
    expect(bankAccount).toBeTruthy();
    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount.getBalance()).toBe(initialValue);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const insufficientAmount = bankAccount.getBalance() + 1;

    expect(() => bankAccount.withdraw(insufficientAmount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const insufficientAmount = bankAccount.getBalance() + 1;
    const mockBankAccount = jest.mocked<BankAccount>({} as BankAccount);

    expect(() => bankAccount.transfer(insufficientAmount, mockBankAccount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => bankAccount.transfer(testAmount, bankAccount)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const result = initialValue + testAmount;
    expect(bankAccount.deposit(testAmount).getBalance()).toBe(result);
  });

  test('should withdraw money', () => {
    const result = initialValue - testAmount;
    expect(bankAccount.withdraw(testAmount).getBalance()).toBe(result);
  });

  test('should transfer money', () => {
    const newBankAccount = new BankAccount(2000);
    const result = initialValue - testAmount;
    const spyDeposit = jest.spyOn(BankAccount.prototype, 'deposit');

    bankAccount.transfer(testAmount, newBankAccount);
    const remainingBalance = bankAccount.getBalance();

    expect(remainingBalance).toBe(result);
    expect(spyDeposit).toHaveBeenCalledWith(testAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const expectedRandomValue = 2_000;
    const spy = jest.spyOn(lodash, 'random');
    spy.mockReturnValue(expectedRandomValue);

    expect(bankAccount.fetchBalance()).resolves.toBe(expectedRandomValue);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const expectedRandomValue = 2_000;
    const spy = jest.spyOn(lodash, 'random');
    spy.mockReturnValue(expectedRandomValue);
    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toBe(expectedRandomValue);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);

    expect(bankAccount.synchronizeBalance.bind(bankAccount)).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
