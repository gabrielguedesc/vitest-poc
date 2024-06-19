import { configDefaults, defineConfig } from "vitest/config";
import { config } from "dotenv";

export default defineConfig({
	test: {
		globals: true,
		restoreMocks: true,
		coverage: {
			enabled: true,
			exclude: [
				...configDefaults.exclude,
				"src/configs/**",
				"src/gateways/**",
				"src/repositories/**",
				"vitest.workspace.js",
			],
			env: {
				...config({ path: "./.env.test" }).parsed,
			},
		},
		exclude: [
			...configDefaults.exclude,
			"src/configs/**",
			"src/gateways/**",
			"src/repositories/**",
			"vitest.workspace.js",
		],
		env: {
			...config({ path: "./.env.test" }).parsed,
		},
	},
});
