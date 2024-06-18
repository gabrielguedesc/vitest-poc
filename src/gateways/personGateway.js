import { random } from "../utils/math";

export const getByIdAsync = (id) => {
	return new Promise((resolve, reject) => {
		const errorRate = random(10);

		setTimeout(() => {
			if (errorRate < 9) {
				resolve({
					id: id,
					name: "Gabriel Guedes",
					hash: "438bc6b4186bc65f617a7635f61103f6863bf964334b6c4a4985bfe4ec1587f7",
					role: 1,
				});
			} else {
				reject("API fail");
			}
		}, 200);
	});
};
