/**
 * 念系統とポジションのマッピング、選手マッチング機能
 */

// 念系統から対応するポジションを取得するマッピング
const POSITION_MAPPING = {
  強化系: 'GK',
  放出系: 'FW',
  変化系: 'MF',
  操作系: 'DF',
  具現化系: 'MF',
  特質系: 'STAFF',
}

/**
 * 念系統から対応するポジションを取得
 * @param {string} primary - 主系統（強化系、変化系、具現化系、特質系、操作系、放出系）
 * @returns {string} ポジション（GK、DF、MF、FW、STAFF）
 */
export function getPositionFromNenType(primary) {
  return POSITION_MAPPING[primary] || 'MF'
}

/**
 * 指定されたポジションの選手リストを取得
 * @param {Array} players - 全選手データ
 * @param {string} position - ポジション（GK、DF、MF、FW、STAFF）
 * @returns {Array} 該当ポジションの選手リスト
 */
export function getPlayersByPosition(players, position) {
  return players.filter((player) => player.position === position)
}

/**
 * 配列からランダムに1つ選択
 * @param {Array} array - 配列
 * @returns {*} ランダムに選択された要素
 */
export function getRandomItem(array) {
  if (!array || array.length === 0) {
    return null
  }
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

/**
 * 診断結果から選手をマッチング
 * @param {string} primary - 主系統
 * @param {Array} players - 全選手データ
 * @returns {Object|null} マッチングした選手情報
 */
export async function matchPlayer(primary, players) {
  console.log('matchPlayer called with:', { primary, playerCount: players.length })
  
  // 念系統から対応するポジションを取得
  const position = getPositionFromNenType(primary)
  console.log('対応ポジション:', position)

  // 該当ポジションの選手を取得
  const candidates = getPlayersByPosition(players, position)
  console.log('候補選手:', candidates.length, '人')

  // ランダムに1人選択
  const matchedPlayer = getRandomItem(candidates)
  console.log('選択された選手:', matchedPlayer)

  return matchedPlayer
}

/**
 * 選手データを読み込み
 * @returns {Promise<Array>} 選手データ配列
 */
export async function loadPlayers() {
  try {
    const response = await fetch('/data/players.json')
    if (!response.ok) {
      throw new Error('Failed to load players data')
    }
    const players = await response.json()
    return players
  } catch (error) {
    console.error('Error loading players:', error)
    return []
  }
}

/**
 * 診断結果から選手をマッチング（データ読み込みを含む）
 * @param {string} primary - 主系統
 * @returns {Promise<Object|null>} マッチングした選手情報
 */
export async function matchPlayerWithDiagnosis(primary) {
  console.log('matchPlayerWithDiagnosis called with primary:', primary)
  const players = await loadPlayers()
  console.log('読み込んだ選手データ:', players.length, '人')
  return matchPlayer(primary, players)
}
