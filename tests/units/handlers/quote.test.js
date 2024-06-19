import { describe, expect, vi, it } from "vitest";
import { faker } from "@faker-js/faker";
import { writetosql } from "../../../src/handlers/quote_created";
import { toQuote } from "../../../src/converters/quote";
import { upsertAsync } from "../../../src/repositories/quoteRepository";

describe("Quote handler", async () => {
	it("should throw Error, when quote converter fail", async () => {
		// Arrange
		const event = {
			id: faker.string.uuid(),
			personId: faker.string.uuid(),
			productId: faker.string.uuid(),
			version: 2,
		};

		vi.mock("../../../src/converters/quote", () => {
			return {
				toQuote: vi.fn(),
			};
		});

		vi.mocked(toQuote).mockRejectedValue(new Error());

		// Act, Asserts
		await expect(
			async () => await writetosql(event, {}),
		).rejects.toThrowError();

		expect(toQuote).toBeCalledTimes(1);
		expect(toQuote).toHaveBeenCalledWith(event);
	});

	it("should throw Error, when the number of affected rows is zero", async () => {
		// Arrange
		const event = {
			id: faker.string.uuid(),
			personId: faker.string.uuid(),
			productId: faker.string.uuid(),
			version: 2,
		};

		const quote = {
			id: event.id,
			productId: event.productId,
			participants: {
				name: faker.person.fullName(),
				hash: faker.string.uuid(),
				role: 1,
			},
		};

		// Quote converter mock
		vi.mock("../../../src/converters/quote", () => {
			return {
				toQuote: vi.fn(),
			};
		});

		vi.mocked(toQuote).mockReturnValue(quote);

		// Quote repository mock
		vi.mock("../../../src/repositories/quoteRepository", () => {
			return {
				upsertAsync: vi.fn(),
			};
		});

		vi.mocked(upsertAsync).mockReturnValue(0);

		// Act, Asserts
		await expect(async () => await writetosql(event, {})).rejects.toThrowError(
			`Cotação id: ${event.id} não criada`,
		);

		expect(toQuote).toBeCalledTimes(1);
		expect(toQuote).toHaveBeenCalledWith(event);

		expect(upsertAsync).toBeCalledTimes(1);
		expect(upsertAsync).toHaveBeenCalledWith(quote);
	});

	it("should save a quote, when the number of affected rows is one", async () => {
		// Arrange
		const event = {
			id: faker.string.uuid(),
			personId: faker.string.uuid(),
			productId: faker.string.uuid(),
			version: 2,
		};

		const quote = {
			id: event.id,
			productId: event.productId,
			participants: {
				name: faker.person.fullName(),
				hash: faker.string.uuid(),
				role: 1,
			},
		};

		// Quote converter mock
		vi.mock("../../../src/converters/quote", () => {
			return {
				toQuote: vi.fn(),
			};
		});

		vi.mocked(toQuote).mockReturnValue(quote);

		// Quote repository mock
		vi.mock("../../../src/repositories/quoteRepository", () => {
			return {
				upsertAsync: vi.fn(),
			};
		});

		vi.mocked(upsertAsync).mockReturnValue(1);

		// Act
		await writetosql(event, {});

		// Asserts
		expect(toQuote).toBeCalledTimes(1);
		expect(toQuote).toHaveBeenCalledWith(event);

		expect(upsertAsync).toBeCalledTimes(1);
		expect(upsertAsync).toHaveBeenCalledWith(quote);
	});
});
