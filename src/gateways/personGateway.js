import { random } from "../utils/math";
import { faker } from "@faker-js/faker";

export const getByIdAsync = (id) => {
	return new Promise((resolve, reject) => {
		const errorRate = random(10);

		setTimeout(() => {
			if (errorRate < 9) {
				resolve({
					id: id,
					name: faker.person.fullName(),
					hash: faker.string.uuid(),
					role: 1,
				});
			} else {
				reject("API fail");
			}
		}, 200);
	});
};
