#!/usr/bin/env node
// Local test harness for extractStatus
// Usage: node script/test-extract-status.mjs
import { JSDOM } from "jsdom";
import { extractStatus } from "./scrape-giravanz.mjs";

const sample = `<!doctype html>
<html>
<body>
  <table>
    <tr>
      <td>年度</td><td>クラブ</td><td>リーグ</td><td>出場</td><td>得点</td><td>カップ出場</td><td>カップ得点</td>
    </tr>
    <!-- Fragmented year: spans and punctuation -->
    <tr>
      <td><span data-device="pc">20</span><span data-device="pc">’</span>19</td>
      <td>Giravanz</td>
      <td>J2</td>
      <td>10</td>
      <td>2</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <!-- Hyphenated full year -->
    <tr>
      <td>2018-19</td>
      <td>Other FC</td>
      <td>J3</td>
      <td>5</td>
      <td>1</td>
      <td>-</td>
      <td>-</td>
    </tr>
  </table>
</body>
</html>`;

const dom = new JSDOM(sample);
const doc = dom.window.document;
const status = extractStatus(doc);
console.log(JSON.stringify(status, null, 2));

// Exit with code 0
process.exit(0);
