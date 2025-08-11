export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'cool',
    // テーマカラーの拡張設定
    colors: {
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      info: 'blue', 
      warning: 'yellow',
      error: 'red',
      neutral: 'gray'
    },
    // 共通のUIトークン
    radius: 'md'
  }
})