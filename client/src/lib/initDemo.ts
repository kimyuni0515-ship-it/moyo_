// MOYO Demo Data Initializer
// 앱 최초 로드 시 데모 데이터를 자동으로 시드합니다

import { getGroups, seedDemoData } from "./store";

export function initDemoIfEmpty() {
  const groups = getGroups();
  if (groups.length === 0) {
    seedDemoData();
  }
}
