import { it, describe, expect } from "vitest";
import { sum, random } from "../../../src/utils/math";

// Theory
describe("Sum tests", () => {
  it.each([
    { a: 1, b: 1, expected: 2 },
    { a: 2, b: 2, expected: 4 },
    { a: 2, b: 1, expected: 3 },
  ])("should return $expected, when sum $a + $b", ({ a, b, expected }) => {
    expect(sum(a, b)).to.be.equal(expected);
  });
});

// Fact
describe("Random tests", () => {
  it("should return a random number between 0 an 10, when max parameter is 10", () => {
    // Act
    const number = random(10);

    // Asserts
    expect(number).to.be.gte(0);
    expect(number).to.be.lte(10);
    // expect(number).greaterThanOrEqual(0);
    // expect(number).lessThanOrEqual(10);
  });
});
