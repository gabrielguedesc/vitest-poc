import { toQuote } from "../../../src/converters/quote";
import { getByIdAsync } from '../../../src/gateways/personGateway';

describe('Quote converter', async () => {
  it('should throw Error, when event version is 1', async () => {
    // Arrange
    const event = { 
      version: 1, 
      // ...
    };

    // Act, Arrange
    await expect(async () => await toQuote(event))
      .rejects
      .toThrowError('Version not suported');
  });

  it('should return quote, when event is valid', async () => {
    // Arrange
    const event = {
      id: 'ed66b1fd-b9ec-4177-81a5-84e966f81f7f',
      personId: '03aac0ac-b542-49e6-857c-bb6d0a481882',
      product: '59d96053-4bf8-44e1-80ac-ebfc8be99493',
      version: 2
    };

    const person = {
      id: 'ed66b1fd-b9ec-4177-81a5-84e966f81f7f',
      name: 'Gabriel Guedes Mock',
      hash: '438bc6b4186bc65f617a7635f61103f6863bf964334b6c4a4985bfe4ec1587f7',
      role: 1
    };

    vi.mock('../../../src/gateways/personGateway', () => {
      return {
        getByIdAsync: vi.fn()  
      }
    });

    vi.mocked(getByIdAsync).mockReturnValue(person);

    // Act
    const result = await toQuote(event);

    // Arrange
    expect(result.id).to.be.equal(event.id);
    expect(result.productId).to.be.equal(event.product);
    expect(result.participants.name).to.be.equal(person.name);
    expect(result.participants.hash).to.be.equal(person.hash);
    expect(result.participants.role).to.be.equal(person.role);

    expect(getByIdAsync).toBeCalledTimes(1);
    expect(getByIdAsync).toHaveBeenCalledWith(event.personId);
  });
});