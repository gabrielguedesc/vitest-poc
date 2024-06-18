import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, vi, it } from "vitest";
import { writetosql } from '../../../src/handlers/quote_created';
import { toQuote } from "../../../src/converters/quote";
import { upsertAsync } from "../../../src/repositories/quoteRepository";

describe('Quote handler', async () => {
  it ('should throw Error, when quote converter fail', async () => {
    // Arrange
    const event = {
      id: 'ed66b1fd-b9ec-4177-81a5-84e966f81f7f',
      personId: '03aac0ac-b542-49e6-857c-bb6d0a481882',
      productId: '59d96053-4bf8-44e1-80ac-ebfc8be99493',
      version: 2
    };

    vi.mock("../../../src/converters/quote", () => {
      return {
        toQuote: vi.fn()
      }
    });

    vi.mocked(toQuote).mockRejectedValue(new Error());

    // Act, Asserts
    await expect(async () => await writetosql(event, {}))
      .rejects
      .toThrowError();
    
    expect(toQuote).toBeCalledTimes(1);
    expect(toQuote).toHaveBeenCalledWith(event);
  });

  it('should throw Error, when the number of affected rows is zero', async () => {
    // Arrange
    const event = {
      id: 'ed66b1fd-b9ec-4177-81a5-84e966f81f7f',
      personId: '03aac0ac-b542-49e6-857c-bb6d0a481882',
      productId: '59d96053-4bf8-44e1-80ac-ebfc8be99493',
      version: 2
    };

    const quote = {
      id: event.id,
      productId: event.productId,
      participants: {
        name: 'Gabriel Guedes',
        hash: '438bc6b4186bc65f617a7635f61103f6863bf964334b6c4a4985bfe4ec1587f7',
        role: 1
      }
    };

    // Quote converter mock
    vi.mock("../../../src/converters/quote", () => {
      return {
        toQuote: vi.fn()
      }
    });

    vi.mocked(toQuote).mockReturnValue(quote);

    // Quote repository mock
    vi.mock("../../../src/repositories/quoteRepository", () => {
      return {
        upsertAsync: vi.fn()
      }
    });

    vi.mocked(upsertAsync).mockReturnValue(0);

    // Act, Asserts
    await expect(async () => await writetosql(event, {}))
      .rejects
      .toThrowError(`Cotação id: ${event.id} não criada`);

    expect(toQuote).toBeCalledTimes(1);
    expect(toQuote).toHaveBeenCalledWith(event);

    expect(upsertAsync).toBeCalledTimes(1);
    expect(upsertAsync).toHaveBeenCalledWith(quote);
  });

  
});