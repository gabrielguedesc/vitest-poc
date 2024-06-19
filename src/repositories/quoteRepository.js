import mssql from "mssql";

import dbConfig from "../configs/db.config";

export const upsertAsync = async (quote) => {
	try {
		const pool = await mssql.connect(dbConfig);
		const request = pool.request();

		await request
			.input("id", mssql.UniqueIdentifier, quote.id)
			.input("product_id", mssql.UniqueIdentifier, quote.productId)
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
	} catch (error) {
		console.error(error);

		throw new Error(error);
	}
};

export const getByIdAsync = async (id) => {
	try {
		const pool = await mssql.connect(dbConfig);
		const request = pool.request();
		const result = await request
			.input("id", mssql.UniqueIdentifier, id)
			.query("SELECT * FROM quotes WHERE id = @id");

		return result.recordset[0];
	} catch (error) {
		console.error(error);
		throw new Error(error);
	}
};
