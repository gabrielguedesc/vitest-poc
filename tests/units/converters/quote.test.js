import { vi, describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";
import { toQuote } from "../../../src/converters/quote";
import { getByIdAsync } from "../../../src/gateways/personGateway";

describe("Quote converter", async () => {
  it("should throw Error, when event version is 1", async () => {
    // Arrange
    const event = {
      version: 1,
      // ...
    };

    // Act, Arrange
    await expect(async () => await toQuote(event)).rejects.toThrowError(
      "Version not suported",
    );
  });

  it("should return a quote, when event is valid", async () => {
    // Arrange
    const event = {
      id: faker.string.uuid(),
      personId: faker.string.uuid(),
      productId: faker.string.uuid(),
      version: 2,
    };

    const person = {
      id: event.personId,
      name: faker.person.fullName(),
      hash: faker.string.uuid(),
      role: 1,
    };

    vi.mock("../../../src/gateways/personGateway", () => {
      return {
        getByIdAsync: vi.fn(),
      };
    });

    vi.mocked(getByIdAsync).mockReturnValue(person);

    // Act
    const result = await toQuote(event);

    // Asserts
    expect(result.id).to.be.equal(event.id);
    expect(result.productId).to.be.equal(event.productId);
    expect(result.participants).to.be.not.empty;
    expect(result.participants).to.have.length(1);
    expect(result.participants[0].name).to.be.equal(person.name);
    expect(result.participants[0].hash).to.be.equal(person.hash);
    expect(result.participants[0].role).to.be.equal(person.role);

    expect(getByIdAsync).toBeCalledTimes(1);
    expect(getByIdAsync).toHaveBeenCalledWith(event.personId);
  });
});
