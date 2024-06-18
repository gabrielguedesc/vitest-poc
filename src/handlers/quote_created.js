import { toQuote } from "../converters/quote";
import { upsertAsync } from '../repositories/quoteRepository';

module.exports.writetosql = async (event, context) => {
  try {
    console.log('Inicio gravação SQL');

    const quote = await toQuote(event); 

    console.log('Fim da conversão');

    const affectedRows = await upsertAsync(quote);

    if (affectedRows === 0)
      throw new Error(`Cotação id: ${quote.id} não criada`);

    console.log(`Gravado cotação id: ${quote.id}`);
  } catch (error) {
    console.error('Falha no processo de integração do evento');

    throw error;
  }
};
