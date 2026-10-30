import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          // These are intentional public APIs (hooks and class-variance-authority helpers),
          // not React components; keeping them named avoids breaking existing imports.
          allowExportNames: [
            "badgeVariants",
            "buttonVariants",
            "useFormField",
            "navigationMenuTriggerStyle",
            "useSidebar",
            "toggleVariants",
            "useAuth",
            "useTheme",
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
);
