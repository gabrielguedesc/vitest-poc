import { sum, random } from '../../../src/utils/math';

describe('Sum tests', () => {
  test.each([
    { a: 1, b: 1, expected: 2 },
    { a: 2, b: 2, expected: 4 },
    { a: 2, b: 1, expected: 3 }
  ])('should return $expected, when sum $a + $b', ({ a, b, expected}) => {
    // Arrange
    expect(sum(a, b)).toBe(expected);
  })
});

describe('Random tests', () => {
  it('should return a random number between 0 an 10, when max parameter is 10', () => {
    // Act
    const number = random(10);
    
    // Arrange
    expect(number).greaterThanOrEqual(0);
    expect(number).lessThanOrEqual(10);
  });
});