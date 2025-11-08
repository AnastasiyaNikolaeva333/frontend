import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "*.config.js"]),

  {
    extends: ["eslint:recommended", "plugin:react/recommended"],
  },

  {
    plugins: ["react"],
    extends: ["eslint:all", "plugin:react/all"],
  },

  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },

  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],

  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },

  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    extends: ["react-hooks/recommended"],
    rules: {
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "(useMyCustomHook|useMyOtherCustomHook)",
        },
      ],
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: {
        createClass: "createReactClass",
        pragma: "React",
        fragment: "Fragment",
        version: "detect",
        defaultVersion: "",
        flowVersion: "0.53",
      },
      propWrapperFunctions: [
        "forbidExtraProps",
        { property: "freeze", object: "Object" },
        { property: "myFavoriteWrapper" },
        { property: "forbidExtraProps", exact: true },
      ],
      componentWrapperFunctions: [
        "observer",
        { property: "styled" },
        { property: "observer", object: "Mobx" },
        { property: "observer", object: "<pragma>" },
      ],
      formComponents: [
        "CustomForm",
        { name: "SimpleForm", formAttribute: "endpoint" },
        { name: "Form", formAttribute: ["registerEndpoint", "loginEndpoint"] },
      ],
      linkComponents: [
        "Hyperlink",
        { name: "MyLink", linkAttribute: "to" },
        { name: "Link", linkAttribute: ["to", "href"] },
      ],
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "no-case-declarations": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
]);
