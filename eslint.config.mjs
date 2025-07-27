// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // VSCodeのフォーマッタと競合するため無効化
      "vue/html-self-closing": "off",
    },
  }
);
