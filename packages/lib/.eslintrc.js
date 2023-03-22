module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    "parser": "@typescript-eslint/parser",
    "extends": [
      "airbnb",
      "airbnb-typescript",
        "prettier"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json",
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "prettier"
    ],
    "rules": {
        "import/prefer-default-export": "off",
        "react/prop-types": "off",
        "react/jsx-props-no-spreading": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
    }
}
