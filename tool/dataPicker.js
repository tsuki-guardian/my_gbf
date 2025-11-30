//https://www.minifier.org/ 壓縮程式碼後存成書籤

javascript: (function() {

const data = {
  gachaName: "",
  Summons: [],
  Characters: [],
  normalWeapons: [],
};

// 先抓卡池標題元素，避免直接鏈式呼叫爆錯
const gachaTitleEl = document.querySelector(".prt-about-title");
if (gachaTitleEl) {
  const rawTitle = gachaTitleEl.textContent.trim();
  // 移除「提供割合について」，再做一次 trim 把前後空白修掉
  const gachaName = rawTitle.replace("提供割合について", "").trim();
  data.gachaName = gachaName;
} else {
  // 找不到的保險作法，可以依個人需求決定要不要加
  data.gachaName = "";
}

// weapon / attribute 對照表
const weaponMap = {
  'weapon/icon_1': '剣', //Sabre
  'weapon/icon_2': '短', //Dagger
  'weapon/icon_3': '槍', //Spear
  'weapon/icon_4': '斧', //Axe
  'weapon/icon_5': '杖', //Staff
  'weapon/icon_6': '銃', //Gun
  'weapon/icon_7': '格', //Melee
  'weapon/icon_8': '弓', //Bow
  'weapon/icon_9': '楽', //Harp
  'weapon/icon_10': '刀', //Katana
};

const attrMap = {
  'type/icon_type_1': '火', //Fire
  'type/icon_type_2': '水', //Water
  'type/icon_type_3': '土', //Earth
  'type/icon_type_4': '風', //Wind
  'type/icon_type_5': '光', //Light
  'type/icon_type_6': '闇', //Dark
};

// 稀有度對照
const rareMap = [
  { key: 'SSレア', value: 'SSR' },
  { key: 'Sレア', value: 'SR' },
  { key: 'レア', value: 'R' },
];

// 共用：從 name 文本中拆 Weapon / Character
const parseName = (rawName) => {
  const text = rawName.replace(/\s+/g, ' ').trim();
  const match = text.match(/^(.+?)\s*\(\s*(.+?)\s*\)$/);

  if (match) {
    return {
      weaponName: match[1],
      charName: match[2],
      fullName: text,
    };
  }

  return {
    weaponName: text,
    charName: '',
    fullName: text,
  };
};

// 共用：從一個 .lis-gacha-lineup 取出 weaponType / attribute
const parseIcons = (lineEl) => {
  const icons = lineEl.querySelectorAll('.ico-mark');
  let weaponType = '';
  let attribute = '';

  icons.forEach((icon) => {
    const src = icon.getAttribute('src') || '';

    // weapon type
    Object.keys(weaponMap).forEach((key) => {
      if (src.includes(key)) {
        weaponType = weaponMap[key];
      }
    });

    // attribute
    Object.keys(attrMap).forEach((key) => {
      if (src.includes(key)) {
        attribute = attrMap[key];
      }
    });
  });

  return { weaponType, attribute };
};

// 共用：從 title 文字取出 rare
const parseRare = (titleText) => {
  for (const { key, value } of rareMap) {
    if (titleText.includes(key)) {
      return value;
    }
  }
  return ''; // 萬一沒對到就空字串
};

document.querySelectorAll('.prt-lineup-item').forEach((lineupItem) => {
  const titleEl = lineupItem.querySelector('.prt-title-ratio .txt-title-ratio');
  const titleText = titleEl ? titleEl.textContent.trim() : '';

  const rare = parseRare(titleText);
  const lines = lineupItem.querySelectorAll('.lis-gacha-lineup');

  // ===== 召喚石區塊 =====
  if (titleText.includes('召喚石')) {
    lines.forEach((line) => {
      const nameEl = line.querySelector('.txt-item-name');
      const rateEl = line.querySelector('.txt-drop-rate');
      if (!nameEl) return;

      const rawName = nameEl.textContent;
      const rate = rateEl ? rateEl.textContent.trim() : '';

      const parsedName = parseName(rawName);
      const { attribute } = parseIcons(line); // 召喚石沒有 weaponType

      data.Summons.push({
        name: parsedName.fullName,
        rate,
        type: 'Summons',
        rare,                      // SSR / SR / R
        summonName: parsedName.weaponName,
        weaponType: '',            // 召喚石沒有武器類型
        attribute,                 // Fire / Water / ...
      });
    });

    return; // 這個 .prt-lineup-item 已處理完
  }

  // ===== 角色解放武器區塊 =====
  if (titleText.includes('キャラ解放武器')) {
    lines.forEach((line) => {
      const nameEl = line.querySelector('.txt-item-name');
      const rateEl = line.querySelector('.txt-drop-rate');
      if (!nameEl) return;

      const rawName = nameEl.textContent;
      const rate = rateEl ? rateEl.textContent.trim() : '';

      const parsedName = parseName(rawName);
      const { weaponType, attribute } = parseIcons(line);

      data.Characters.push({
        name: parsedName.fullName,
        rate,
        type: 'Characters',
        rare,                      // SSR / SR / R
        weaponName: parsedName.weaponName,
        charName: parsedName.charName,
        weaponType,
        attribute,
      });
    });

    return;
  }

  // ===== 通常武器區塊 =====
  if (titleText.includes('通常武器')) {
    lines.forEach((line) => {
      const nameEl = line.querySelector('.txt-item-name');
      const rateEl = line.querySelector('.txt-drop-rate');
      if (!nameEl) return;

      const rawName = nameEl.textContent;
      const rate = rateEl ? rateEl.textContent.trim() : '';

      // 備註：通常武器不會有後綴角色，所以不用拆 charName
      const parsedName = parseName(rawName);
      const { weaponType, attribute } = parseIcons(line);

      data.normalWeapons.push({
        name: parsedName.fullName,
        rate,
        type: 'NormalWeapon', // 若想統一格式方便識別
        rare,                 // SSR / SR / R
        weaponName: parsedName.weaponName,
        weaponType,
        attribute,
      });
    });

    return;
  }
});

const JDATA = JSON.stringify(data);
console.log(JDATA);
if (navigator.clipboard && navigator.clipboard.writeText) {
  navigator.clipboard.writeText(JDATA).then(
    () => console.log('Copied to clipboard'),
    (err) => console.warn('Copy failed', err)
  );
}

})();