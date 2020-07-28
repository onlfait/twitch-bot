module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  globals: {
    io: true,
  },
  plugins: ["html", "prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended", "prettier"],
};
