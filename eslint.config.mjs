// eslint.config.mjs
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      prettier: "eslint-plugin-prettier"
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: true,
          trailingComma: "all",
          printWidth: 100
        }
      ],
      "no-unused-vars": "warn",
      "no-console": "off"
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"]
  }
];
