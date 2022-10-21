module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['airbnb', 'airbnb-typescript/base'],
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    ignorePatterns: ['.eslintrc.cjs'],
    rules: {
        "@typescript-eslint/indent": 0,
        "no-param-reassign": 0,
        "@typescript-eslint/no-use-before-define": 0,
        "linebreak-style": 0,
        "consistent-return": 0,
        "max-len": 0,
        "object-curly-newline": 0,
        "no-console": 0,
        "no-continue": 0,
    }
};
