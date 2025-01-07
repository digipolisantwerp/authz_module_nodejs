import globals from "globals";
import mochaPlugin from 'eslint-plugin-mocha';
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  mochaPlugin.configs.flat.recommended,
  {
      files: ["**/*.js"],
      languageOptions: {
          sourceType: "commonjs"
      }
  },
  {
      languageOptions: {
          globals: globals.node
      },
      rules: {
          "mocha/no-mocha-arrows": "off",
          "mocha/consistent-spacing-between-blocks": "off",
      }
  },
  pluginJs.configs.recommended,
];
