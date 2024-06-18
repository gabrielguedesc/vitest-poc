import { describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';
import { writetosql } from '../../../src/handlers/quote_created'
import { getByIdAsync } from '../../../src/repositories/quoteRepository';

describe('Quote created handler', async () => {
  it('should save a new quote, when event is valid', async () => {
    // Arrange
    const event = {
      id: 'ed66b1fd-b9ec-4177-81a5-84e966f81f7f',
      personId: faker.string.uuid(),
      productId: faker.string.uuid(),
      version: 2
    };

    // Act
    await writetosql(event, {});

    // Asserts
    const quote = await getByIdAsync(event.id);

    expect(quote.id.toLocaleLowerCase()).to.be.equal(event.id);
    expect(quote.product_id.toLocaleLowerCase()).to.be.equal(event.productId);
  });
});