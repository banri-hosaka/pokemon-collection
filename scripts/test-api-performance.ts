// APIパフォーマンステストスクリプト

async function testApiPerformance() {
  const testCases = [
    { id: 25, name: "ピカチュウ", description: "第1世代（DBに存在）" },
    { id: 150, name: "ミュウツー", description: "第1世代（DBに存在）" },
    { id: 152, name: "チコリータ", description: "第2世代（DBに未登録）" },
  ];

  console.log("🚀 APIパフォーマンステスト開始\n");

  for (const testCase of testCases) {
    console.log(`📍 テスト: ${testCase.description}`);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(`http://localhost:3000/api/pokemon/${testCase.id}`);
      const data = await response.json();
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`   ID: ${data.id}`);
      console.log(`   名前: ${data.japaneseName} (${data.name})`);
      console.log(`   レスポンス時間: ${responseTime}ms`);
      console.log(`   ステータス: ${response.status}`);
      console.log("");
    } catch (error) {
      console.error(`   エラー: ${error}`);
    }
  }
  
  console.log("✅ テスト完了");
}

testApiPerformance();