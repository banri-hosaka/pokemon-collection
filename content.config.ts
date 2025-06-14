import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      // Nuxt Content v3では、コンテンツの管理にコレクションという仕組みが導入され、より型安全でシームレスな連携が可能になりました
      // type: 'page'：コンテンツファイルとページが1対1の関係であることを示します
      // source: '**/*.md'：contentフォルダ内のすべてのMarkdownファイルを対象にします
      type: "page",
      source: "**/*.md",
    }),
  },
});
