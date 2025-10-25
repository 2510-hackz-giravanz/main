// API Base URL (環境変数で管理)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 質問生成API - 10問4択の質問を取得
export async function fetchQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/questions/generate`);
    if (!response.ok) {
      throw new Error(`質問の取得に失敗しました: ${response.status}`);
    }
    const data = await response.json();
    return data.questions; // QuestionSet.questions を返す
  } catch (error) {
    console.error('fetchQuestions error:', error);
    throw error;
  }
}

// 診断API - 回答を送信して6系統スコアを取得
export async function submitDiagnosis(questionAnswers) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/diagnosis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question_answers: questionAnswers
      })
    });
    
    if (!response.ok) {
      throw new Error(`診断の実行に失敗しました: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // DiagnosisResponse { scores, comment }
  } catch (error) {
    console.error('submitDiagnosis error:', error);
    throw error;
  }
}

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
