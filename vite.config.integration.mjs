import { configDefaults, defineConfig } from 'vitest/config';
import { config } from "dotenv";

export default defineConfig({
  test:{
    globals: true,
    coverage: {
      enabled: true,
      include: [
        ...configDefaults.include,
        'src/handlers/**'],
      env: {
        ...config({ path: "./.env.test" }).parsed,
      },
    },
    include: [
      ...configDefaults.include,
      'src/handlers/**'],
    env: {
      ...config({ path: "./.env.test" }).parsed,
    },
  },
});