import { configDefaults, defineConfig } from 'vitest/config';
import { config } from "dotenv";

export default defineConfig({
  test:{
    globals: true,
    coverage: {
      enabled: true,
      exclude: [
        ...configDefaults.exclude,
        'src/configs/**',
        'src/handlers/**',
        'src/gateways/**',
        'src/repositories/**'
      ],
      env: {
        ...config({ path: "./.env.test" }).parsed,
      },
    },
    exclude: [
      ...configDefaults.exclude,
      'src/configs/**',
      'src/handlers/**',
      'src/gateways/**',
      'src/repositories/**'
    ],
    env: {
      ...config({ path: "./.env.test" }).parsed,
    },
  },
});