import { getByIdAsync } from "../gateways/personGateway";

export const toQuote = async (event) => {
	if (event.version === 1) throw new Error("Version not suported");

	const person = await getByIdAsync(event.personId);

	return {
		id: event.id,
		productId: event.productId,
		participants: {
			name: person.name,
			hash: person.hash,
			role: person.role,
		},
	};
};
