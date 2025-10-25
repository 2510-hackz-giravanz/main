#!/usr/bin/env node
// Node v22 以降対応 (ESM)
// 事前に: npm i jsdom
import { JSDOM } from "jsdom";
import fs from "fs/promises";

const BASE = "https://www.giravanz.jp/topteam/staff_player";
const START = 1;
const END = 99;
const DELAY_MS = 400; // サーバーに優しく
const OUTFILE = "players.json";

// -----------------------------------
// 共通ユーティリティ
// -----------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const to2 = (n) => String(n).padStart(2, "0");

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GiravanzScraper/1.0)" },
    });
    if (!res.ok) return null; // 404等はスキップ
    return await res.text();
  } catch {
    return null;
  }
}

const text = (el) => (el ? el.textContent.trim() : null);

// -----------------------------------
// ラベル抽出（dt/dd と td(次行値) 両対応）
// -----------------------------------
function byLabel(document, labels) {
  const nodes = [...document.querySelectorAll("dt, td")];

  for (const L of labels) {
    const cand = nodes.find((n) => n.textContent?.trim().includes(L));
    if (!cand) continue;

    // ① <dt>ラベル</dt><dd>値</dd>
    if (cand.tagName === "DT") {
      const dd = cand.nextElementSibling;
      if (dd && dd.tagName === "DD") {
        const value = dd.textContent.trim();
        if (value) return value;
      }
    }

    // ② <tr><td>ラベル</td></tr> → 次の行 <tr><td>値</td></tr>
    if (cand.tagName === "TD") {
      const tr = cand.closest("tr");
      const nextTr = tr?.nextElementSibling;
      const nextTd = nextTr?.querySelector("td");
      if (nextTd) {
        const value = nextTd.textContent.trim();
        if (value) return value;
      }
    }
  }
  return null;
}

// -----------------------------------
// 基本情報抽出
// -----------------------------------
const toInt = (s, re = /\d+/) => {
  if (!s) return null;
  const m = String(s).match(re);
  return m ? parseInt(m[1] ?? m[0], 10) : null;
};

function extractBirthday(document) {
  const body = document.body.textContent || "";
  const m =
    body.match(/((?:19|20)\d{2})[年\/\.\-]\s*(\d{1,2})[月\/\.\-]\s*(\d{1,2})日?/) ||
    body.match(/((?:19|20)\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (!m) return null;
  const [_, y, mo, d] = m;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function extractName(document) {
  return (
    text(document.querySelector("h1, .playerName, .detail__name, .ttl")) ||
    document.querySelector('meta[property="og:title"]')?.getAttribute("content")?.replace(/\s*\|.*$/, "").trim() ||
    document.querySelector("title")?.textContent?.replace(/\s*\|.*$/, "").trim() ||
    null
  );
}

function extractHeightWeight(document) {
  const hRaw =
    byLabel(document, ["身長", "Height"]) ||
    [...document.querySelectorAll("li,td,dd")].map((n) => n.textContent).find((t) => /cm/.test(t || ""));
  const wRaw =
    byLabel(document, ["体重", "Weight"]) ||
    [...document.querySelectorAll("li,td,dd")].map((n) => n.textContent).find((t) => /kg/.test(t || ""));
  const height = toInt(hRaw, /(\d+)\s*cm/);
  const weight = toInt(wRaw, /(\d+)\s*kg/);
  return { height, weight };
}

function extractFrom(document) {
  return byLabel(document, ["出身地", "出身", "From"]);
}

const splitList = (s) =>
  String(s)
    .split(/[、,／/・]|[\s]*\|\s*/g)
    .map((x) => x.trim())
    .filter(Boolean);

function extractQAs(document) {
  const nickname = byLabel(document, ["ニックネーム", "ニックネームは？"]);
  const what_is_soccer = byLabel(document, ["あなたにとってサッカーとは？"]);
  const jersey_number_commitment = byLabel(document, ["今シーズンの背番号へのこだわり"]);
  const pregame_ritual = byLabel(document, ["試合前に必ずすること"]);
  const look = byLabel(document, ["「自分のプレー」ここを見てほしい", "自分のプレー"]);
  const best_game = byLabel(document, ["人生のベストゲーム（時代は問わず）", "ベストゲーム"]);
  const reason = byLabel(document, ["（人生のベストゲーム）その理由は？", "その理由"]);
  const hero = byLabel(document, ["あなたにとってのヒーローは？", "ヒーロー"]);
  const personality_one_word = byLabel(document, ["自分の性格を一言で"]);
  const charm_point = byLabel(document, ["チャームポイントは？"]);
  const best_in_team_non_soccer = byLabel(document, ["これだけはチームNo.", "これだけはチームNo"]);
  const motto = byLabel(document, ["座右の銘", "モットー"]);
  const message_to_fans = byLabel(document, ["ファンへのメッセージ", "ファン・サポーターへ一言"]);

  return {
    nickname: nickname || null,
    what_is_soccer: what_is_soccer || null,
    jersey_number_commitment: jersey_number_commitment || null,
    pregame_ritual: pregame_ritual || null,
    look_at_my_play: look ? splitList(look) : null,
    best_game: best_game
      ? { title: best_game, reason: reason || null }
      : reason
      ? { title: null, reason }
      : null,
    hero: hero || null,
    personality_one_word: personality_one_word || null,
    charm_point: charm_point || null,
    best_in_team_non_soccer: best_in_team_non_soccer || null,
    motto: motto || null,
    message_to_fans: message_to_fans || null,
  };
}

// -----------------------------------
// 成績テーブル → status 配列に格納（table の td を7つずつ）
// -----------------------------------
function toIntOrNull(s) {
  if (!s) return null;
  const t = String(s).trim();
  if (t === "" || t === "-" || t === "ー" || t === "―") return null;
  const m = t.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

function extractStatus(document) {
  // 「年度」「出場」「得点」を含む table を探す
  const table = [...document.querySelectorAll("table")].find((tbl) => {
    const txt = tbl.textContent || "";
    return txt.includes("年度") && txt.includes("出場") && txt.includes("得点");
  });
  if (!table) return [];

  // table 内のすべての td を取得し、ヘッダ文字列っぽい td を簡易的に除外してから
  // 先頭から 7 個ずつグループ化して status を作る。
  const rawTds = [...table.querySelectorAll("td")].map((td) => td.textContent.trim());

  // ヘッダ行に含まれる可能性のあるラベルを除外するフィルタ。
  // 完全に安全ではないが多くのサイトで動作する簡易版。
  const headerPattern = /年度|出場|得点|クラブ|リーグ|カップ|season|appearances|goals/i;
  const tds = rawTds.filter((t) => t !== "" && !headerPattern.test(t));

  const status = [];
  for (let i = 0; i + 6 < tds.length; i += 7) {
    const [
      yearRaw,
      clubRaw,
      leagueRaw,
      leagueAppsRaw,
      leagueGoalsRaw,
      cupAppsRaw,
      cupGoalsRaw,
    ] = tds.slice(i, i + 7);

    // 年の正規化：td 内に断片的に入っている数字 (例: "20" "’" "19") を扱う。
    // ルール:
    // 1) 4 桁の数字があればそれを採用 (最初に見つかったもの)
    // 2) 2 つの 2 桁数字 (例: "19" "20" や "20" "19") があれば、それぞれを補完して full year にし、より小さい方を開始年とする
    //    補完ルール: 2 桁 >= 70 -> 19xx, それ以外 -> 20xx
    // 3) 連続した数字列から 4 桁以上が取れる場合は先頭4桁を使用
    // 4) それ以外はスキップ
    const raw = String(yearRaw);
    const groups = raw.match(/\d+/g) || [];

    let yearNormalized = null;

    // 1) 4 桁があれば採用
    const g4 = groups.find((g) => g.length === 4);
    if (g4) {
      yearNormalized = g4;
    } else if (groups.length >= 2 && groups.slice(0, 2).every((g) => g.length <= 2)) {
      // 2) 2 桁 x2 のケース
      const toFull = (g) => {
        const n = parseInt(g, 10);
        if (n >= 70) return 1900 + n;
        return 2000 + n;
      };
      const cand = groups.slice(0, 2).map((g) => toFull(g));
      yearNormalized = String(Math.min(...cand));
    } else {
      // 3) 連続した数字列から 4 桁が取れるか
      const allDigits = raw.replace(/[^\d]/g, "");
      if (allDigits.length >= 4) {
        yearNormalized = allDigits.slice(0, 4);
      }
    }

    if (!yearNormalized || !/^(19|20)\d{2}$/.test(yearNormalized)) {
      continue; // yyyy に正規化できない場合はスキップ
    }

    status.push({
      year: yearNormalized,
      club: clubRaw || null,
      league: leagueRaw || null,
      league_apps: toIntOrNull(leagueAppsRaw),
      league_goals: toIntOrNull(leagueGoalsRaw),
      cup_apps: toIntOrNull(cupAppsRaw),
      cup_goals: toIntOrNull(cupGoalsRaw),
    });
  }

  return status;
}

// テスト用にエクスポート
export { extractStatus };

// -----------------------------------
// 各ページをスクレイピング
// -----------------------------------
async function scrapeOne(n) {
  const id = to2(n);
  const url = `${BASE}/${id}.php`;
  const html = await fetchHtml(url);
  if (!html) return null;

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const name = extractName(document);
  const birth = extractBirthday(document);
  const { height, weight } = extractHeightWeight(document);
  const from = extractFrom(document);
  const qa = extractQAs(document);
  const status = extractStatus(document);

  return {
    id,
    name,
    birth,
    height,
    weight,
    from,
    ...qa,
    status,
    _source: url,
  };
}

// -----------------------------------
// メイン処理
// -----------------------------------
(async () => {
  const results = [];
  for (let i = START; i <= END; i++) {
    const r = await scrapeOne(i);
    if (r) {
      console.log(`✅ ok ${to2(i)} -> ${r.name || "NoName"}`);
      results.push(r);
    } else {
      console.log(`⏭️ skip ${to2(i)} (not found)`);
    }
    await sleep(DELAY_MS);
  }

  await fs.writeFile(OUTFILE, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\n💾 Saved: ${OUTFILE} (${results.length} records)`);
})();
