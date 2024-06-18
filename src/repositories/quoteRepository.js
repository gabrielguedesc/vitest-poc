import mssql from 'mssql';

import dbConfig from '../configs/db.config';

export const upsertAsync = async (quote) => {
  try{
    console.log(quote)
    const pool = await mssql.connect(dbConfig);
    const request = pool.request();
    
    await request
      .input('id', mssql.UniqueIdentifier, quote.id)
      .input('product_id', mssql.UniqueIdentifier, quote.productId)
      .query(`
        INSERT INTO quotes([id], [product_id])
        SELECT @id, @product_id
        WHERE NOT EXISTS
        (
          SELECT 1 FROM quotes WITH(UPDLOCK, SERIALIZABLE)
          WHERE [id] = @id
        );

        IF @@ROWCOUNT = 0
        BEGIN
          UPDATE quotes
          SET 
            [product_id] = @product_id
          WHERE [id] = @id;
        END
      `);

    return quote;

  } catch(error) {
    console.error(error);

    throw new Error(error);
  }
}

export const getByIdAsync = async (id) => {
  try{
    const pool = await mssql.connect(dbConfig);
    const request = pool.request();
    const result = await request
      .input('id', mssql.UniqueIdentifier, id)
      .query('SELECT * FROM quotes WHERE id = @id');

    return result.recordset[0];  
  } catch(error) {
    console.error(error);
    throw new Error(error);
  }
}

// export default class QuoteRepository {
//   constructor(config){
//     this.config = config;
//   }

//   async getAllAsync() {
//     try{
//       const pool = await mssql.connect(this.config);
//       const request = pool.request();
//       const result = await request.query('SELECT * FROM quotes');
  
//       return result.recordset;
//     } catch(error) {
//       console.error(error);
//       throw new Error(error);
//     }
//   }

//   async getByIdAsync(quoteId) {
//     try{
//       const pool = await mssql.connect(this.config);
//       const request = pool.request();
//       const result = await request
//         .input('quote_id', this.connection.sql.UniqueIdentifier, quoteId)
//         .query('SELECT * FROM quotes WHERE quote_id = @quote_id');
  
//       return result.recordset[0];  
//     } catch(error) {
//       console.error(error);
//       throw new Error(error);
//     }
//   }

//   async upsertAsync(quote) {
//     try{
//       const pool = await mssql.connect(this.config);
//       const request = pool.request();
      
//       await request
//         .input('quote_id', this.connection.sql.UniqueIdentifier, quote.quoteId)
//         .input('type', this.connection.sql.Int, quote.type)
//         .query(`
//           INSERT INTO quotes([quote_id], [type])
//           SELECT @quote_id, @type
//           WHERE NOT EXISTS
//           (
//             SELECT 1 FROM quotes WITH(UPDLOCK, SERIALIZABLE)
//             WHERE [quote_id] = @quote_id
//           );

//           IF @@ROWCOUNT = 0
//           BEGIN
//             UPDATE quotes
//             SET 
//               [type] = @type
//             WHERE [quote_id] = @quote_id;
//           END
//         `);

//       return quote;
//     } catch(error) {
//       console.error(error);
//       throw new Error(error);
//     }
//   }

//   async deleteAsync(quoteId) {
//     try{
//       const pool = await mssql.connect(this.config);
//       const request = pool.request();
//       await request
//         .input('quote_id', this.connection.sql.UniqueIdentifier, quoteId)
//         .query('DELETE FROM quotes WHERE [quote_id] = @quote_id');
//     } catch(error) {
//       console.error(error);
//       throw new Error(error);
//     }
//   }
// }
