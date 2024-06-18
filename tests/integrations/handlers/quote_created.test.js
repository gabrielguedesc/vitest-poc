import { describe, expect } from 'vitest';
import { writetosql } from '../../../src/handlers/quote_created'
import { getByIdAsync } from '../../../src/repositories/quoteRepository';

describe('Quote created handler', async () => {
  it('should save a new quote, when event is valid', async () => {
    // Arrange
    const event = {
      id: 'ed66b1fd-b9ec-4177-81a5-84e966f81f7f',
      personId: '03aac0ac-b542-49e6-857c-bb6d0a481882',
      product: '59d96053-4bf8-44e1-80ac-ebfc8be99493',
      version: 2
    };

    // Act
    await writetosql(event, {});

    // Asserts
    expect(true).to.be.true;
    const quote = await getByIdAsync(event.id);

    expect(quote.id.toLocaleLowerCase()).to.be.equal(event.id);
    expect(quote.product_id.toLocaleLowerCase()).to.be.equal(event.product);
  })
});