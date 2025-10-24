// 仮の選手データ
const players = [
  {
    id: 1,
    name: '山田太郎',
    position: 'FW',
    age: 25,
    nationality: '日本',
    isFamous: true,
    isMale: true,
    isEntertainer: false,
  },
  {
    id: 2,
    name: 'ジョン・スミス',
    position: 'DF',
    age: 28,
    nationality: 'イギリス',
    isFamous: false,
    isMale: true,
    isEntertainer: false,
  },
];

// 全選手データ取得
export async function getPlayers() {
  return Promise.resolve(players);
}

// 質問・回答に応じた絞り込み
export async function findPlayersByAnswers(answers) {
  let result = players;
  // 例: answers[1]が"はい"なら日本人のみ
  if (answers && answers[1] === 'はい') {
    result = result.filter(p => p.nationality === '日本');
  }else if (answers && answers[1] === 'いいえ') {
    result = result.filter(p => p.nationality !== '日本');
  }
  // ...他の条件は必要に応じて追加
  return Promise.resolve(result);
}
