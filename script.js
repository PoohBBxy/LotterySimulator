// --- DATA & CONFIG ---
const GRID_SIZE = 5;
let NUM_PRIZES = 16;
// 1. 外围奖品位置
const PERIMETER_POSITIONS = [
    0,1,2,3,4,   // 第1行（全5个）
    5,9,         // 第2行（列0、列4）
    10,14,       // 第3行（列0、列4）
    15,19,       // 第4行（列0、列4）
    20,21,22,23,24 // 第5行（全5个）
]; // 共16个外围位置

// 2. 按行滚动的动画顺序 (data-index)
const ROW_BY_ROW_POSITIONS = [0, 1, 2, 3, 4, 5, 16, 17, 18, 6, 7, 8, 9, 19, 20, 21, 10, 11, 12, 13, 14, 15];

const defaultPrizes = [
    { name: '雷神-冠军之魄', desc: '稀有赛事皮肤', prob: 0.20, color: '#ef4444', category: '稀有类', decomposeValue: 8 },
    { name: '黑骑士-冠军之势', desc: '稀有赛事皮肤', prob: 0.20, color: '#a78bfa', category: '稀有类', decomposeValue: 8 },
    { name: '黑龙-冠军之武', desc: '稀有赛事皮肤', prob: 0.30, color: '#d946ef', category: '稀有类', decomposeValue: 6 },
    { name: 'M4A1-雷神-CFS 2019', desc: '稀有赛事皮肤', prob: 0.30, color: '#c084fc', category: '稀有类', decomposeValue: 6 },
    { name: '擎天-冠军之击', desc: '稀有赛事皮肤', prob: 0.35, color: '#f59e0b', category: '稀有类', decomposeValue: 5 },
    { name: '毁灭-CFS2018', desc: '稀有赛事皮肤', prob: 0.45, color: '#34d399', category: '稀有类', decomposeValue: 4 },
    { name: '火麒麟-CFS2018', desc: '稀有赛事皮肤', prob: 0.45, color: '#22c55e', category: '稀有类', decomposeValue: 4 },
    { name: '修罗-冠军之魂', desc: '稀有赛事皮肤', prob: 0.90, color: '#38bdf8', category: '稀有类', decomposeValue: 2 },
    { name: '贝雷塔687-破浪10年', desc: '', prob: 1.80, color: '#22d3ee', category: '稀有类', decomposeValue: 1 },
    { name: '匕首-破浪10年', desc: '', prob: 1.80, color: '#60a5fa', category: '稀有类', decomposeValue: 1 },
    { name: '幸运宝箱x1', desc: '', prob: 8.85, color: '#fbbf24', category: '宝箱类' },
    { name: '积分x25', desc: '', prob: 0.40, color: '#ec4899', category: '积分类' },
    { name: '积分x10', desc: '', prob: 1.00, color: '#f472b6', category: '积分类' },
    { name: '积分x8', desc: '', prob: 10.00, color: '#94a3b8', category: '积分类' },
    { name: '积分x6', desc: '', prob: 35.00, color: '#a9b3d6', category: '积分类' },
    { name: '积分x5', desc: '', prob: 38.00, color: '#b3b3b3', category: '积分类' },
];
const defaultRedemptionPrizes = [
    { name: '雷神-冠军之魄', cost: 518, limit: { total: -1, user: 1 } },
    { name: '黑骑士-冠军之势', cost: 518, limit: { total: -1, user: 1 } },
    { name: '黑龙-冠军之武', cost: 388, limit: { total: -1, user: 1 } },
    { name: 'M4A1-雷神-CFS 2019', cost: 388, limit: { total: -1, user: 1 } },
    { name: '擎天-冠军之击', cost: 328, limit: { total: -1, user: 1 } },
    { name: '毁灭-CFS2018', cost: 228, limit: { total: -1, user: 1 } },
    { name: '火麒麟-CFS2018', cost: 228, limit: { total: -1, user: 1 } },
    { name: '修罗-冠军之魂', cost: 118, limit: { total: -1, user: 1 } },
    { name: '贝雷塔687-破浪10年', cost: 58, limit: { total: -1, user: -1 } },
    { name: '匕首-破浪10年', cost: 58, limit: { total: -1, user: -1 } },
    { name: '交易专用钥匙x5', cost: 15, limit: { total: -1, user: -1 } },
    { name: '属性变更券x5', cost: 15, limit: { total: -1, user: -1 } },
    { name: '交易专用钥匙x1', cost: 3, limit: { total: -1, user: -1 } },
    { name: '属性变更券x1', cost: 3, limit: { total: -1, user: -1 } },
];
const defaultChestPrizes = [
    { name: '王者之石x1', prob: 50, category: '道具类' },
    { name: '万能碎片x3', prob: 50, category: '碎片类' }
];
const defaultFragmentPrizes = [
    { name: '王者夺宝红宝石x1', cost: 10, limit: { total: -1, user: -1 } }, { name: '王者轮回蓝宝石x1', cost: 10, limit: { total: -1, user: -1 } },
    { name: '王者许愿黄宝石x1', cost: 10, limit: { total: -1, user: -1 } }, { name: '主会场抽奖钥匙x1', cost: 10, limit: { total: -1, user: -1 }, resultType: 'keys', resultValue: 1 },
];

const rollCfg = { minRounds: 1, maxRounds: 2, minSpeed: 30, maxSpeed: 100 };
let prizes = [], history = [], rareHistory = [], redemptionPrizes = [], chestPrizes = [], fragmentPrizes = [];
let redemptionCounts = {}, userRedemptionCounts = {};
let currentPoints = 0, totalDraws = 0, currentKeys = 0, totalSpending = 0, currentChests = 0, currentFragments = 0;
let settings = { decomposeTo: '钥匙', animationDisabled: true, chestMode: 'claim' };
let winnersListInterval;

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const board = $('#board'), modalContainer = $('#modal-container');
let rolling = false, currentIndex = -1;
const prizeElements = [];

// --- UTILS & HELPERS ---
function pickByProbability(prizePool) {
    const arr = prizePool.map(p => Math.max(0, p.prob || 0));
    const total = arr.reduce((sum, p) => sum + p, 0);
    if (total === 0) return Math.floor(Math.random() * prizePool.length);
    const r = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < arr.length; i++) { acc += arr[i]; if (r < acc) return i; }
    return prizePool.length - 1;
}

// --- MODAL & TOAST ---
function showModal(id, title, content, footer) {
    closeModal(id);
    const modal = document.createElement('div');
    modal.className = 'modal-overlay'; modal.id = id;
    modal.innerHTML = `<div class="modal" onclick="event.stopPropagation()"><div class="modal-header"><h3 class="modal-title">${title}</h3><button class="modal-close" onclick="closeModal('${id}')">&times;</button></div><div class="modal-body">${content}</div>${footer ? `<div class="modal-footer">${footer}</div>` : ''}</div>`;
    modal.onclick = () => closeModal(id);
    modalContainer.appendChild(modal);
}
function closeModal(id) { $(`#${id}`)?.remove(); }
function showResult(title, content) {
    showModal('resultToast', title, content, `<button class="btn" onclick="closeModal('resultToast')">确认</button>`);
}
function showConfirm(title, message) {
    return new Promise((resolve, reject) => {
        const body = `<div class="confirm-body">${message}</div>`;
        const footer = `<button class="btn secondary" id="confirm-cancel">取消</button><button class="btn" id="confirm-ok">确认</button>`;
        showModal('confirmModal', title, body, footer);
        $('#confirm-ok').onclick = () => { closeModal('confirmModal'); resolve(); };
        const rejectAndClose = () => { closeModal('confirmModal'); reject(); };
        $('#confirm-cancel').onclick = rejectAndClose;
        $(`#confirmModal .modal-close`).onclick = rejectAndClose;
        $(`#confirmModal`).onclick = rejectAndClose;
    });
}

// --- STATE MANAGEMENT ---
function updatePoints(points) {
    currentPoints = points;
    $('#points-display').textContent = currentPoints.toLocaleString();
    if($('#redemption-points-val')) $('#redemption-points-val').textContent = currentPoints.toLocaleString();
    saveData('points', currentPoints);
}
function updateDraws(count) { totalDraws = count; $('#draw-count-display').textContent = totalDraws.toLocaleString(); saveData('draws', totalDraws); }
function updateKeys(count) {
    currentKeys = count;
    if ($('#key-display-val')) $('#key-display-val').textContent = currentKeys.toLocaleString();
    saveData('keys', currentKeys);
    updateDrawButtons();
}
function updateTotalSpending(amount) { totalSpending = amount; $('#spending-display').textContent = `¥ ${totalSpending.toLocaleString()}`; saveData('spending', totalSpending); }
function updateChests(count) {
    currentChests = count;
    $('#chests-display').textContent = currentChests.toLocaleString();
    if($('#chest-module-val')) $('#chest-module-val').textContent = currentChests.toLocaleString();
    saveData('chests', currentChests);
    updateDrawButtons();
}
function updateFragments(count) {
    currentFragments = count;
    $('#fragments-display').textContent = currentFragments.toLocaleString();
    if($('#fragment-redeem-val')) $('#fragment-redeem-val').textContent = currentFragments.toLocaleString();
    saveData('fragments', currentFragments);
}
function updateRedemptionCounts(itemName, totalCount, userCount) {
    redemptionCounts[itemName] = totalCount;
    userRedemptionCounts[itemName] = userCount;
    saveData('redemptionCounts', redemptionCounts);
    saveData('userRedemptionCounts', userRedemptionCounts);
}

// --- RENDERING ---
function generateBoard() {
    // Reset state
    prizeElements.length = 0;
    board.innerHTML = '';

    NUM_PRIZES = Math.min(prizes.length, 22);

    let boardHtml = '';
    const perimeterPrizes = prizes.slice(0, 16);
    const innerPrizes = prizes.slice(16, NUM_PRIZES);

    // 1. Generate perimeter prizes
    perimeterPrizes.forEach((p, i) => {
        const gridPos = PERIMETER_POSITIONS[i];
        const row = Math.floor(gridPos / 5) + 1;
        const col = (gridPos % 5) + 1;
        boardHtml += `<div class="cell prize" data-index="${i}" style="grid-row: ${row}; grid-column: ${col};">
            <span class="label">
                <b class="name"></b><span class="desc"></span>
            </span>
        </div>`;
    });

    // 2. Generate inner prize containers and their content
    const topInnerPrizes = innerPrizes.slice(0, 3);
    const bottomInnerPrizes = innerPrizes.slice(3);

    if (topInnerPrizes.length > 0) {
        let topInnerHtml = '';
        topInnerPrizes.forEach((p, i) => {
            const originalIndex = 16 + i;
            topInnerHtml += `<div class="cell prize" data-index="${originalIndex}">
                <span class="label">
                    <b class="name"></b><span class="desc"></span>
                </span>
            </div>`;
        });
        boardHtml += `<div class="inner-row-container" style="grid-row: 2; grid-column: 2 / 5;">${topInnerHtml}</div>`;
    }

    if (bottomInnerPrizes.length > 0) {
        let bottomInnerHtml = '';
        bottomInnerPrizes.forEach((p, i) => {
            const originalIndex = 16 + 3 + i;
            bottomInnerHtml += `<div class="cell prize" data-index="${originalIndex}">
                <span class="label">
                    <b class="name"></b><span class="desc"></span>
                </span>
            </div>`;
        });
        boardHtml += `<div class="inner-row-container" style="grid-row: 4; grid-column: 2 / 5;">${bottomInnerHtml}</div>`;
    }

    // 3. Add the central draw buttons
    boardHtml += `
        <div class="start-container" style="grid-area: 3 / 2 / 4 / 5;">
            <div class="start-buttons-container">
                <button class="btn-draw" id="btnDraw1">抽一次</button>
                <button class="btn-draw" id="btnDraw10">抽十次</button>
            </div>
            <div class="key-display">剩余钥匙: <span id="key-display-val">0</span></div>
        </div>`;

    // 4. Set the board HTML and re-populate prizeElements array
    board.innerHTML = boardHtml;
    for (let i = 0; i < NUM_PRIZES; i++) {
        prizeElements[i] = board.querySelector(`.cell.prize[data-index='${i}']`);
    }

    // 5. Add event listeners and update UI
    $('#btnDraw1').addEventListener('click', () => startDraw(false));
    $('#btnDraw10').addEventListener('click', () => startDraw(true));
    updateKeys(currentKeys);
}

function renderPrizes() {
    prizes.slice(0, NUM_PRIZES).forEach((p, i) => {
        const el = prizeElements[i];
        if (el) {
            el.querySelector('.name').textContent = p.name;
            el.querySelector('.desc').textContent = p.desc || '';
            el.style.setProperty('--c', p.color || '#22d3ee');
            el.dataset.color = p.color || '';
            el.title = `[${p.category}] ${p.name} (${p.prob}%)`;
        }
    });
}

function renderStashAndWinnersModule() {
    const container = $('#stash-winners-wrap');
    container.innerHTML = `
        <div class="stash-panel">
            <div class="panel-title">-- 暂存箱 --</div>
            <div class="stash-panel-content">
                <img src="https://game.gtimg.cn/images/actdaoju/cp/a20250711champion/zcx.png" alt="Stash Box">
                <p class="desc">抽奖获得的可分解道具进入暂存箱，其余道具也不会发往游戏内</p>
                <button class="btn" id="btnViewStash">点击查看暂存箱</button>
            </div>
        </div>
        <div class="winners-panel">
            <div class="panel-title">-- 获奖名单 --</div>
            <div class="winners-list-container">
                <ul class="winners-list" id="winners-list"></ul>
            </div>
        </div>
    `;
    $('#btnViewStash').addEventListener('click', () => showDetailedStashModal(1));
    renderAndScrollWinnersList();
}
function renderAndScrollWinnersList() {
    if (winnersListInterval) clearInterval(winnersListInterval);
    const list = $('#winners-list');
    if (!list) return;

    let winners = rareHistory.map(item => `恭喜玩家 ${String(Math.floor(100000 + Math.random() * 900000))}** 获得了 <strong>${item.prizeData.name}</strong>`);
    if (winners.length < 15) {
        const rarePrizes = prizes.filter(p => p.category === '稀有类');
        for(let i = winners.length; i < 15; i++) {
            if(rarePrizes.length === 0) break;
            const randomPrize = rarePrizes[Math.floor(Math.random() * rarePrizes.length)];
            winners.push(`恭喜玩家 ${String(Math.floor(100000 + Math.random() * 900000))}** 获得了 <strong>${randomPrize.name}</strong>`);
        }
    }

    list.innerHTML = winners.map(w => `<li>${w}</li>`).join('');

    if (winners.length > 8) {
        list.innerHTML += list.innerHTML;
        let top = 0;
        winnersListInterval = setInterval(() => {
            top -= 1;
            list.style.transform = `translateY(${top}px)`;
            if (top <= -list.scrollHeight / 2) {
                top = 0;
            }
        }, 50);
    }
}
function getLimitStatus(p) {
    const totalRedeemed = redemptionCounts[p.name] || 0;
    const userRedeemed = userRedemptionCounts[p.name] || 0;
    const isTotalLimited = p.limit.total > -1;
    const isUserLimited = p.limit.user > -1;
    const isTotalSoldOut = isTotalLimited && totalRedeemed >= p.limit.total;
    const isUserSoldOut = isUserLimited && userRedeemed >= p.limit.user;
    const isSoldOut = isTotalSoldOut || isUserSoldOut;
    const remainingTotal = isTotalLimited ? p.limit.total - totalRedeemed : Infinity;
    const remainingUser = isUserLimited ? p.limit.user - userRedeemed : Infinity;

    let limitDesc = '';
    if (isTotalLimited && isUserLimited) {
        if (remainingTotal < remainingUser) {
            limitDesc = `总限 ${p.limit.total}`;
        } else {
            limitDesc = `单Q单大区限 ${p.limit.user}`;
        }
    } else if (isTotalLimited) {
        limitDesc = `总限量 ${p.limit.total}`;
    } else if (isUserLimited) {
        limitDesc = `单Q单大区限 ${p.limit.user}`;
    }
    return { isSoldOut, limitDesc, isLimited: isTotalLimited || isUserLimited };
}
function renderRedemptionBoard() {
    const container = $('#redemption-section');
    let html = `<div class="module-container"><div class="module-title">主会场兑换区 (剩余积分: <span id="redemption-points-val">${currentPoints.toLocaleString()}</span>)</div><div class="module-grid">`;
    redemptionPrizes.forEach((p, i) => {
        const { isSoldOut, limitDesc, isLimited } = getLimitStatus(p);
        html += `<div class="cell redeem-item">
            ${isLimited ? '<div class="limit-badge">限</div>' : ''}
            <span class="label">
                <b class="name">${p.name}</b>
                ${limitDesc ? `<span class="limit-desc">${limitDesc}</span>` : ''}
            </span>
            <button class="btn redeem-points" onclick="redeemWithPoints(${i})" ${isSoldOut ? 'disabled' : ''}>
                ${isSoldOut ? '已兑换' : `${p.cost} 积分兑换`}
            </button>
        </div>`;
    });
    html += `</div></div>`;
    container.innerHTML = html;
}
function renderLuckyChestModule() {
    const container = $('#lucky-chest-section');
    if (!container) return;

    if (settings.chestMode === 'claim') {
        let prizesHtml = chestPrizes.map((p, i) => `
            <div class="cell redeem-item">
                <span class="label"><b class="name">${p.name}</b></span>
                <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                    <button class="btn btn-claim" onclick="claimFromChest(${i}, 1)">兑换 1 次</button>
                    <button class="btn btn-claim" onclick="claimFromChest(${i}, 5)">兑换 5 次</button>
                </div>
            </div>`).join('');
        container.innerHTML = `<div class="module-container">
            <div class="module-title">幸运宝箱 (剩余: <span id="chest-module-val">${currentChests.toLocaleString()}</span>)</div>
            <p style="text-align:center; font-size:13px; color:var(--muted); margin:-10px 0 14px;">选择一个奖品直接兑换。</p>
            <div class="module-grid">${prizesHtml}</div>
        </div>`;
        $$('#lucky-chest-section .redeem-item').forEach(item => {
            const btn1 = item.querySelector('button:nth-of-type(1)');
            const btn5 = item.querySelector('button:nth-of-type(2)');
            if (btn1) btn1.disabled = currentChests < 1;
            if (btn5) btn5.disabled = currentChests < 5;
        });
    } else {
        let prizesHtml = chestPrizes.map(p => `<div class="cell"><span class="label"><b class="name">${p.name}</b></span></div>`).join('');
        container.innerHTML = `<div class="module-container">
            <div class="module-title">幸运宝箱 (剩余: <span id="chest-module-val">${currentChests.toLocaleString()}</span>)</div>
            <div class="module-grid">${prizesHtml}</div>
            <div style="display:flex; justify-content:center; gap: 10px; margin-top: 14px;">
                <button class="btn-draw" id="btnOpenChest1">开启1次</button>
                <button class="btn-draw" id="btnOpenChest5">开启5次</button>
            </div>
        </div>`;
        $('#btnOpenChest1').addEventListener('click', () => openLuckyChest(false));
        $('#btnOpenChest5').addEventListener('click', () => openLuckyChest(true));
    }
    if ($('#chest-module-val')) $('#chest-module-val').textContent = currentChests.toLocaleString();
    updateDrawButtons();
}

function renderFragmentRedemptionModule() {
    const container = $('#fragment-redemption-section');
    let html = `<div class="module-container"><div class="module-title">万能碎片兑换 (剩余碎片: <span id="fragment-redeem-val">${currentFragments.toLocaleString()}</span>)</div><div class="module-grid">`;
    fragmentPrizes.forEach((p, i) => {
        const { isSoldOut, limitDesc, isLimited } = getLimitStatus(p);
        html += `<div class="cell redeem-item">
            ${isLimited ? '<div class="limit-badge">限</div>' : ''}
            <span class="label">
                <b class="name">${p.name}</b>
                ${limitDesc ? `<span class="limit-desc">${limitDesc}</span>` : ''}
            </span>
            <button class="btn redeem-fragments" onclick="redeemWithFragments(${i})" ${isSoldOut ? 'disabled' : ''}>
                ${isSoldOut ? '已兑换' : `${p.cost} 碎片兑换`}
            </button>
        </div>`;
    });
    html += `</div></div>`;
    container.innerHTML = html;
}
function checkAndRenderModules() {
    const hasChest = prizes.some(p => p.category === '宝箱类');
    const hasFragments = prizes.some(p => p.category === '碎片类') || chestPrizes.some(p => p.category === '碎片类');
    $('#lucky-chest-section').classList.toggle('hidden', !hasChest);
    $('#btnEditChest_container').classList.toggle('hidden', !hasChest);
    if (hasChest) renderLuckyChestModule();
    $('#fragment-redemption-section').classList.toggle('hidden', !hasFragments);
    $('#btnEditFragment_container').classList.toggle('hidden', !hasFragments);
    if (hasFragments) renderFragmentRedemptionModule();
    updateChests(currentChests); updateFragments(currentFragments); updatePoints(currentPoints);
}

// --- CORE LOGIC ---
function startDraw(isTenDraw = false) {
    const cost = isTenDraw ? 10 : 1;
    if (rolling || currentKeys < cost) return;
    updateKeys(currentKeys - cost); disableStart(true);
    if (isTenDraw) {
        updateDraws(totalDraws + 10);
        const results = [];
        for (let i = 0; i < 10; i++) {
            const p = prizes[pickByProbability(prizes)];
            processWin(p, 1);
            results.push(p);
        }
        let resultsHtml = '<div class="result-grid">';
        results.forEach(p => {
            resultsHtml += `<div class="result-item" style="--c:${p.color};"><div class="name">${p.name}</div><div class="desc">${p.desc || ''}</div></div>`;
        });
        resultsHtml += '</div>';
        showResult('中奖信息', resultsHtml);
        disableStart(false);
    } else {
        updateDraws(totalDraws + 1); const target = pickByProbability(prizes);
        if (settings.animationDisabled) {
            const p = prizes[target]; processWin(p, 1);
            showResult('中奖信息', createPrizeHTML(p)); stepHighlight(target); setTimeout(() => prizeElements[target]?.classList.remove('highlight'), 1000);
            disableStart(false);
        } else { rollTo(target); }
    }
}

async function rollTo(target) {
    // 1. 定义动画路径
    const animationPath = ROW_BY_ROW_POSITIONS.filter(i => i < NUM_PRIZES);
    const pathLength = animationPath.length;
    const targetPosInPath = animationPath.indexOf(target);

    // 安全检查，如果路径为空或找不到目标，则直接结束动画
    if (pathLength === 0 || targetPosInPath === -1) {
        console.error(`Animation path error for target ${target}.`);
        const p = prizes[target];
        processWin(p, 1);
        showResult('中奖信息', createPrizeHTML(p));
        if (prizeElements[target]) {
            stepHighlight(target);
            setTimeout(() => prizeElements[target].classList.remove('highlight'), 1000);
        }
        disableStart(false);
        return;
    }

    // 2. 计算总步数
    const totalRounds = rollCfg.minRounds + Math.floor(Math.random() * (rollCfg.maxRounds - rollCfg.minRounds + 1));
    const startPosInPath = currentIndex >= 0 ? animationPath.indexOf(currentIndex) : -1;

    let totalSteps = totalRounds * pathLength;
    const dist = (targetPosInPath - startPosInPath + pathLength) % pathLength;
    totalSteps += dist;

    // 如果步数为0（恰好停在原地），则改为滚动一整圈
    if (totalSteps === 0) {
        totalSteps = pathLength;
    }

    // 3. 执行动画循环
    let currentPosInPath = startPosInPath; // 首次抽奖时为 -1
    for (let s = 1; s <= totalSteps; s++) {
        const t = s / totalSteps;
        // 使用 ease-out 函数，让动画在结尾处变慢
        const speedFactor = Math.sin((t * Math.PI) / 2);
        const speed = rollCfg.maxSpeed - (rollCfg.maxSpeed - rollCfg.minSpeed) * speedFactor;
        await new Promise(res => setTimeout(res, speed));

        currentPosInPath = (currentPosInPath + 1) % pathLength;
        stepHighlight(animationPath[currentPosInPath]);
    }

    // 4. 结束动画并显示结果
    const p = prizes[target];
    processWin(p, 1);
    showResult('中奖信息', createPrizeHTML(p));
    disableStart(false);
}

function processWin(prize, count) {
    const winData = { name: `${prize.name} x${count}`, date: Date.now() }; history.push(winData); saveData('history', history);
    if (prize.category === '稀有类') {
        const rareWinData = { ...winData, prizeData: prize, status: 'unclaimed' }; rareHistory.push(rareWinData); saveData('rareHistory', rareHistory);
        renderAndScrollWinnersList();
    } else if (prize.category === '积分类') {
        const match = prize.name.match(/x(\d+)/i); if (match && match[1]) { updatePoints(currentPoints + (parseInt(match[1], 10) * count)); }
    } else if (prize.category === '宝箱类') {
        const match = prize.name.match(/x(\d+)/i); if (match && match[1]) { updateChests(currentChests + (parseInt(match[1], 10) * count)); }
    } else if (prize.category === '碎片类') {
        const match = prize.name.match(/x(\d+)/i); if (match && match[1]) { updateFragments(currentFragments + (parseInt(match[1], 10) * count)); }
    }
}
async function openLuckyChest(isFiveDraw = false) {
    const cost = isFiveDraw ? 5 : 1;
    if (currentChests < cost) return;
    updateChests(currentChests - cost);
    const results = new Map();
    for (let i = 0; i < cost; i++) {
        const prize = chestPrizes[pickByProbability(chestPrizes)]; processWin(prize, 1);
        const key = `${prize.name}`;
        if (results.has(key)) results.get(key).count++; else results.set(key, { ...prize, count: 1 });
    }
    let resultsHtml = '<div class="result-grid">';
    results.forEach(p => { resultsHtml += `<div class="result-item" style="--c:#d946ef;"><div class="name">${p.name}</div>${p.count > 1 ? `<span class="count">x${p.count}</span>` : ''}</div>`; });
    resultsHtml += '</div>';
    showResult(`开启${cost}个宝箱结果`, resultsHtml);
}
async function claimFromChest(index, quantity = 1) {
    if (currentChests < quantity) return;
    const prize = chestPrizes[index];
    if (!prize) return;

    try {
        await showConfirm('兑换确认', `确定要用 ${quantity} 个幸运宝箱兑换 <strong>${quantity}个「${prize.name}」</strong> 吗？`);
        updateChests(currentChests - quantity);
        processWin(prize, quantity);
        showResult('兑换成功', `您已成功兑换${quantity}个${prize.name} ！`);
        renderLuckyChestModule();
    } catch {}
}
async function redeemWithPoints(index) {
    const item = redemptionPrizes[index];
    const { isSoldOut } = getLimitStatus(item);
    if (isSoldOut) { showResult('已售罄', '此物品已兑换完毕。'); return; }
    if (currentPoints < item.cost) { showResult('积分不足', '您的积分不足以兑换此物品。'); return; }

    try {
        await showConfirm('兑换确认', `确定要花费 <strong>${item.cost}</strong> 积分兑换 <strong>「${item.name}」</strong> 吗？`);
        updatePoints(currentPoints - item.cost);
        if (item.resultType === 'keys') { updateKeys(currentKeys + (item.resultValue || 1)); }

        const totalRedeemed = redemptionCounts[item.name] || 0;
        const userRedeemed = userRedemptionCounts[item.name] || 0;
        updateRedemptionCounts(item.name, totalRedeemed + 1, userRedeemed + 1);

        history.push({ name: `[积分兑换] ${item.name}`, date: Date.now() }); saveData('history', history);
        showResult('兑换成功', `恭喜您获得了礼包： ${item.name}。请注意：模拟器兑换的奖励不会发往游戏仓库！`);
        renderRedemptionBoard();
    } catch {}
}
async function redeemWithFragments(index) {
    const item = fragmentPrizes[index];
    const { isSoldOut } = getLimitStatus(item);
    if (isSoldOut) { showResult('已售罄', '此物品已兑换完毕。'); return; }
    if (currentFragments < item.cost) { showResult('碎片不足', '您的万能碎片不足以兑换此物品。'); return; }

    try {
        await showConfirm('兑换确认', `确定要花费 <strong>${item.cost}</strong> 个万能碎片兑换 <strong>「${item.name}」</strong> 吗？`);
        updateFragments(currentFragments - item.cost);
        if (item.resultType === 'keys') { updateKeys(currentKeys + (item.resultValue || 1)); }

        const totalRedeemed = redemptionCounts[item.name] || 0;
        const userRedeemed = userRedemptionCounts[item.name] || 0;
        updateRedemptionCounts(item.name, totalRedeemed + 1, userRedeemed + 1);

        history.push({ name: `[碎片兑换] ${item.name}`, date: Date.now() }); saveData('history', history);
        showResult('兑换成功', `您已成功兑换 ${item.name}！`);
        renderFragmentRedemptionModule();
    } catch {}
}

// --- HISTORY & RARE ITEMS ---
function showHistory(page = 1) {
    const pageSize = 10;
    const totalItems = history.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const pageToShow = Math.max(1, Math.min(page, totalPages));
    const startIndex = (pageToShow - 1) * pageSize;
    const pageItems = [...history].reverse().slice(startIndex, startIndex + pageSize);

    let historyHtml = '<ul class="history-list">';
    if (pageItems.length === 0) {
        historyHtml += '<li style="text-align:center; border:none;">暂无记录</li>';
    } else {
        pageItems.forEach(item => {
            historyHtml += `<li class="history-item"><div class="history-info"><span class="hist-name">${item.name}</span><br><span class="hist-time">${new Date(item.date).toLocaleString()}</span></div></li>`;
        });
    }
    historyHtml += '</ul>';

    let footerHtml = `<div class="pagination-controls">
        <button class="btn secondary" ${pageToShow <= 1 ? 'disabled' : ''} onclick="showHistory(${pageToShow - 1})">上一页</button>
        <span>第 ${pageToShow} / ${totalPages} 页</span>
        <button class="btn secondary" ${pageToShow >= totalPages ? 'disabled' : ''} onclick="showHistory(${pageToShow + 1})">下一页</button>
    </div>`;
    showModal('historyModal', '全部记录', historyHtml, footerHtml);
}

function showDetailedStashModal(page = 1) {
    const pageSize = Math.max(5, prizes.filter(p => p.category === '稀有类').length);
    const totalItems = rareHistory.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const pageToShow = Math.max(1, Math.min(page, totalPages));
    const startIndex = (pageToShow - 1) * pageSize;
    const pageItems = [...rareHistory].reverse().slice(startIndex, startIndex + pageSize).map((item, i) => ({ ...item, originalIndex: rareHistory.length - 1 - (startIndex + i) }));

    let stashTableHtml = `<table class="stash-table"><thead><tr><th>名称</th><th>领取</th><th>分解</th></tr></thead><tbody>`;
    if (pageItems.length > 0) {
        pageItems.forEach(item => {
            let claimCell = '', decomposeCell = '';
            if (item.status === 'claimed') {
                claimCell = '<span class="hist-status claimed">已领取</span>';
                decomposeCell = '<span>-</span>';
            } else if (item.status === 'decomposed') {
                claimCell = '<span>-</span>';
                decomposeCell = `<span class="hist-status decomposed">已分解</span>`;
            } else {
                claimCell = `<button class="btn btn-hist" onclick="claimRareItemFromStash(${item.originalIndex}, ${pageToShow})">领取</button>`;
                decomposeCell = `<button class="btn btn-hist secondary" onclick="decomposeRareItemFromStash(${item.originalIndex}, ${pageToShow})">分解</button>`;
            }
            stashTableHtml += `<tr><td>${item.name}</td><td>${claimCell}</td><td>${decomposeCell}</td></tr>`;
        });
    } else {
        stashTableHtml += `<tr class="empty-row"><td colspan="3">您尚未未获取任何礼包</td></tr>`;
    }
    stashTableHtml += `</tbody></table>`;
    let stashPagination = `<div class="pagination-controls"><button class="btn secondary" ${pageToShow <= 1 ? 'disabled' : ''} onclick="showDetailedStashModal(${pageToShow - 1})">上一页</button><span>${pageToShow} / ${totalPages}</span><button class="btn secondary" ${pageToShow >= totalPages ? 'disabled' : ''} onclick="showDetailedStashModal(${pageToShow + 1})">下一页</button></div>`;

    const rarePrizesForDecompose = prizes.filter(p => p.category === '稀有类' && p.decomposeValue > 0);
    rarePrizesForDecompose.sort((a,b) => (b.decomposeValue || 0) - (a.decomposeValue || 0));

    let decomposeTableHtml = `<table class="decompose-table"><thead><tr><th>道具名称</th><th>分解为${settings.decomposeTo}</th></tr></thead><tbody>`;
    rarePrizesForDecompose.forEach(p => { decomposeTableHtml += `<tr><td>${p.name}</td><td>${p.decomposeValue}</td></tr>`; });
    decomposeTableHtml += `</tbody></table>`;
    const modalContent = `<div class="stash-modal-grid"><div>${stashTableHtml}${stashPagination}</div><div>${decomposeTableHtml}</div></div>`;
    showModal('detailedStashModal', '暂存箱 / 分解表', modalContent, `<div style="font-size: 13px; color: var(--muted); text-align: center; width: 100%;">温馨提示: 模拟器奖品不会发到您的游戏仓库。</div>`);
}

async function claimRareItemFromStash(index, currentPage) {
    try {
        await showConfirm('领取确认', `确定要领取 <strong>「${rareHistory[index].name}」</strong> 吗？`);
        rareHistory[index].status = 'claimed'; saveData('rareHistory', rareHistory);
        showDetailedStashModal(currentPage);
    } catch {}
}
async function decomposeRareItemFromStash(index, currentPage) {
    const item = rareHistory[index]; const value = item.prizeData.decomposeValue || 0; const resource = settings.decomposeTo;
    try {
        await showConfirm('分解确认', `确定要分解 <strong>「${item.name}」</strong> 吗？<br>您将获得 <strong>${value.toLocaleString()}</strong> ${resource}。`);
        if (resource === '钥匙') updateKeys(currentKeys + value); else updatePoints(currentPoints + value);
        item.status = 'decomposed'; item.pointsAdded = value; item.resourceType = resource; saveData('rareHistory', rareHistory);
        showDetailedStashModal(currentPage);
    } catch {}
}

// --- EDITORS & SETTINGS ---
function openSettings() {
    const content = `
    <div class="form-group">
        <label for="setting-chest-mode">幸运宝箱模式</label>
        <div class="select-wrapper">
            <select id="setting-chest-mode">
                <option value="lottery" ${settings.chestMode === 'lottery' ? 'selected' : ''}>抽奖模式</option>
                <option value="claim" ${settings.chestMode === 'claim' ? 'selected' : ''}>直接兑换</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="setting-decompose-to">稀有物品统一分解为</label>
        <div class="select-wrapper">
            <select id="setting-decompose-to">
                <option value="钥匙" ${settings.decomposeTo === '钥匙' ? 'selected' : ''}>钥匙</option>
                <option value="积分" ${settings.decomposeTo === '积分' ? 'selected' : ''}>积分</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="checkbox-label">
            <input type="checkbox" id="setting-animation-disabled" ${settings.animationDisabled ? 'checked' : ''} style="width: auto; height: auto;">
            <span>关闭抽奖动画</span>
        </label>
    </div>`;
    showModal('settingsModal', '全局设置', content, `<button class="btn" id="btnSaveSettings">保存设置</button>`);
    $('#btnSaveSettings').addEventListener('click', saveSettings);
}
function saveSettings() {
    settings.chestMode = $('#setting-chest-mode').value;
    settings.decomposeTo = $('#setting-decompose-to').value;
    settings.animationDisabled = $('#setting-animation-disabled').checked;
    saveData('settings', settings);
    closeModal('settingsModal');
    checkAndRenderModules();
    showResult('保存成功', '全局设置已更新。');
}
function openGenericListEditor(config) {
    let formHtml = `<div id="editor-list" class="prize-form-grid" style="grid-template-columns: ${config.columns || '1fr'};">`;
    config.data.forEach((p, i) => { formHtml += config.itemTemplate(p, i); });
    formHtml += '</div>';
    const footer = `${config.footer || ''}<button class="btn secondary" id="btn-add-item">添加一项</button><button class="btn" id="btn-save-list">保存</button>`;
    showModal(config.modalId, config.title, formHtml, footer);
    const modalElement = $(`#${config.modalId} .modal`);
    const updateUI = () => {
        $('#editor-list').innerHTML = config.data.map(config.itemTemplate).join('');
        if (config.onUpdate) config.onUpdate();
    };
    modalElement.addEventListener('click', e => {
        if (e.target.classList.contains('btn-delete-item')) {
            config.data.splice(parseInt(e.target.dataset.index, 10), 1);
            updateUI();
        }
    });
    $('#btn-add-item').addEventListener('click', () => {
        if(config.data.length < (config.maxLength || Infinity)) {
            config.data.push(JSON.parse(JSON.stringify(config.newItemTemplate)));
            updateUI();
        }
    });
    $('#btn-save-list').addEventListener('click', () => { config.onSave(); });
    if(config.onUpdate) config.onUpdate();

    modalElement.addEventListener('input', () => {
        if (config.onUpdate) config.onUpdate();
    });
}
function createRedemptionEditorConfig(type) {
    const isPoints = type === 'points';
    return {
        modalId: `${type}Editor`,
        title: `编辑${isPoints ? '积分' : '碎片'}兑换`,
        data: JSON.parse(JSON.stringify(isPoints ? redemptionPrizes : fragmentPrizes)),
        newItemTemplate: { name: '新物品', cost: 10, limit: { total: -1, user: -1 }, resultType: '', resultValue: 0 },
        itemTemplate: (p, i) => `<div class="prize-form-group">
            <button class="btn-delete-item" data-index="${i}">&times;</button>
            <label>名称</label><input type="text" data-field="name" value="${p.name}">
            <label>所需${isPoints ? '积分' : '碎片'}</label><input type="number" data-field="cost" value="${p.cost}" min="0">
            <label class="checkbox-label"><input type="checkbox" data-limit-type="total" onchange="this.closest('.prize-form-group').querySelector('.limit-total-group').style.display = this.checked ? 'block' : 'none';" ${p.limit.total > -1 ? 'checked' : ''}><span>启用总限量</span></label>
            <div class="limit-total-group" style="display: ${p.limit.total > -1 ? 'block' : 'none'};">
                <label>总限量个数</label><input type="number" data-field="limit-total" value="${p.limit.total > -1 ? p.limit.total : 1}" min="1">
            </div>
            <label class="checkbox-label"><input type="checkbox" data-limit-type="user" onchange="this.closest('.prize-form-group').querySelector('.limit-user-group').style.display = this.checked ? 'block' : 'none';" ${p.limit.user > -1 ? 'checked' : ''}><span>启用单用户限量</span></label>
            <div class="limit-user-group" style="display: ${p.limit.user > -1 ? 'block' : 'none'};">
                <label>单用户限量个数</label><input type="number" data-field="limit-user" value="${p.limit.user > -1 ? p.limit.user : 1}" min="1">
            </div>
            <label>特殊结果类型 (选填)</label>
            <div class="select-wrapper">
                <select data-field="resultType"><option value="" ${!p.resultType ? 'selected' : ''}>无</option><option value="keys" ${p.resultType === 'keys' ? 'selected' : ''}>钥匙</option></select>
            </div>
            <label>特殊结果数值 (选填)</label><input type="number" data-field="resultValue" value="${p.resultValue || 0}">
        </div>`,
        onSave: () => {
            const newPrizes = $$(`#${type}Editor .prize-form-group`).map(group => {
                const isTotalLimited = group.querySelector('[data-limit-type="total"]').checked;
                const isUserLimited = group.querySelector('[data-limit-type="user"]').checked;
                return {
                    name: group.querySelector('[data-field="name"]').value,
                    cost: parseInt(group.querySelector('[data-field="cost"]').value, 10) || 0,
                    limit: {
                        total: isTotalLimited ? (parseInt(group.querySelector('[data-field="limit-total"]').value, 10) || 1) : -1,
                        user: isUserLimited ? (parseInt(group.querySelector('[data-field="limit-user"]').value, 10) || 1) : -1,
                    },
                    resultType: group.querySelector('[data-field="resultType"]').value,
                    resultValue: parseInt(group.querySelector('[data-field="resultValue"]').value, 10) || 0
                };
            });
            if (isPoints) {
                redemptionPrizes = newPrizes; saveData('redemptionPrizes', redemptionPrizes); renderRedemptionBoard();
            } else {
                fragmentPrizes = newPrizes; saveData('fragmentPrizes', fragmentPrizes); renderFragmentRedemptionModule();
            }
            closeModal(`${type}Editor`); showResult('保存成功', `${isPoints ? '积分' : '碎片'}兑换列表已更新。`);
        }
    };
}
function openChestPrizeEditor() {
    const isLotteryMode = settings.chestMode === 'lottery';

    const updateProbs = () => {
        if (!isLotteryMode) return;
        const modal = $('#chestEditor'); if (!modal) return;
        const display = $('#chest-prob-total-display'), saveBtn = $('#btn-save-list');
        const inputs = $$('#chestEditor .prob-group input');
        const totalProb = inputs.reduce((sum, i) => sum + (Number(i.value) || 0), 0);
        display.textContent = `总概率: ${totalProb.toFixed(2)}%`;
        const isValid = Math.abs(totalProb - 100) < 0.001;
        display.className = `prob-total-display ${isValid ? 'valid' : 'invalid'}`;
        saveBtn.disabled = !isValid;
    };

    openGenericListEditor({
        modalId: 'chestEditor',
        title: `编辑宝箱奖池 ${isLotteryMode ? '(抽奖模式)' : '(直接兑换模式)'}`,
        data: JSON.parse(JSON.stringify(chestPrizes)),
        newItemTemplate: { name: '新奖品', prob: isLotteryMode ? 0 : 0, category: '道具类' },
        footer: isLotteryMode ? `<div id="chest-prob-total-display" class="prob-total-display"></div>` : '',
        onUpdate: isLotteryMode ? updateProbs : null,
        itemTemplate: (p, i) => `<div class="prize-form-group">
            <button class="btn-delete-item" data-index="${i}">&times;</button>
            <label>名称</label><input type="text" data-field="name" value="${p.name}">
            <label>分类</label>
            <div class="select-wrapper">
                <select data-field="category">
                    <option value="积分类" ${p.category === '积分类' ? 'selected' : ''}>积分类</option>
                    <option value="道具类" ${p.category === '道具类' ? 'selected' : ''}>道具类</option>
                    <option value="宝箱类" ${p.category === '宝箱类' ? 'selected' : ''}>宝箱类</option>
                    <option value="碎片类" ${p.category === '碎片类' ? 'selected' : ''}>碎片类</option>
                    <option value="稀有类" ${p.category === '稀有类' ? 'selected' : ''}>稀有类</option>
                </select>
            </div>
            ${isLotteryMode ? `<label>概率</label><div class="prob-group"><input type="number" data-field="prob" value="${p.prob}" min="0" step="0.1"><span>%</span></div>` : ''}
        </div>`,
        onSave: () => {
            chestPrizes = $$('#chestEditor .prize-form-group').map(group => ({
                name: group.querySelector('[data-field="name"]').value,
                category: group.querySelector('[data-field="category"]').value,
                prob: isLotteryMode ? (parseFloat(group.querySelector('[data-field="prob"]').value) || 0) : 0,
            }));
            saveData('chestPrizes', chestPrizes);
            checkAndRenderModules();
            closeModal('chestEditor');
            showResult('保存成功', '宝箱奖池已更新。');
        }
    });
}
function openPrizeEditor() {
    const updateProbs = () => {
        const modal = $('#prizeEditor'); if (!modal) return;
        const display = $('#prob-total-display'), saveBtn = $('#btn-save-list'), addBtn = $('#btn-add-item');

        const prizeGroups = $$('#prizeEditor .prize-form-group');
        let totalProb = 0;
        let rareProb = 0;

        prizeGroups.forEach(group => {
            const probInput = group.querySelector('.prob-group input');
            const categorySelect = group.querySelector('select[data-field="category"]');
            if (probInput && categorySelect) {
                const currentProb = Number(probInput.value) || 0;
                totalProb += currentProb;
                if (categorySelect.value === '稀有类') {
                    rareProb += currentProb;
                }
            }
        });

        display.textContent = `总概率: ${totalProb.toFixed(2)}% (稀有类: ${rareProb.toFixed(2)}%)`;
        const isValid = Math.abs(totalProb - 100) < 0.001;
        display.className = `prob-total-display ${isValid ? 'valid' : 'invalid'}`;
        saveBtn.disabled = !isValid;
        if (addBtn) addBtn.disabled = prizeGroups.length >= 22;
    };

    openGenericListEditor({
        modalId: 'prizeEditor', title: '编辑奖品', data: JSON.parse(JSON.stringify(prizes)),
        newItemTemplate: { name: '新奖品', desc: '', prob: 0, color: '#b3b3b3', category: '积分类', decomposeValue: 0 },
        footer: `<div id="prob-total-display" class="prob-total-display"></div>`,
        onUpdate: updateProbs,
        columns: '1fr 1fr',
        maxLength: 22,
        itemTemplate: (p, i) => `<div class="prize-form-group">
            <button class="btn-delete-item" data-index="${i}">&times;</button>
            <div class="group-title">奖品 #${i + 1}</div>
            <label>名称</label><input type="text" data-field="name" value="${p.name}">
            <label>描述</label><input type="text" data-field="desc" value="${p.desc || ''}">
            <label>颜色</label><input type="color" data-field="color" value="${p.color || '#b3b3b3'}" style="padding: 2px 6px; height: 40px; border: 2px solid ${p.color || '#b3b3b3'};" oninput="this.style.borderColor=this.value">
            <label>分类</label>
            <div class="select-wrapper">
                <select data-field="category" onchange="this.closest('.prize-form-group').querySelector('.decompose-group').style.display = this.value === '稀有类' ? 'block' : 'none';">
                    <option value="积分类" ${p.category === '积分类' ? 'selected' : ''}>积分类</option>
                    <option value="道具类" ${p.category === '道具类' ? 'selected' : ''}>道具类</option>
                    <option value="宝箱类" ${p.category === '宝箱类' ? 'selected' : ''}>宝箱类</option>
                    <option value="碎片类" ${p.category === '碎片类' ? 'selected' : ''}>碎片类</option>
                    <option value="稀有类" ${p.category === '稀有类' ? 'selected' : ''}>稀有类</option>
                </select>
            </div>
            <label>概率</label><div class="prob-group"><input type="number" data-field="prob" value="${p.prob}" min="0" step="0.1"><span>%</span></div>
            <div class="decompose-group" style="display:${p.category === '稀有类' ? 'block' : 'none'};"><label>分解可得${settings.decomposeTo}</label><input type="number" data-field="decomposeValue" value="${p.decomposeValue || 0}" min="0"></div>
        </div>`,
        onSave: () => {
            const newPrizes = $$('#prizeEditor .prize-form-group').map(group => ({
                name: group.querySelector('[data-field="name"]').value,
                desc: group.querySelector('[data-field="desc"]').value,
                color: group.querySelector('[data-field="color"]').value,
                category: group.querySelector('[data-field="category"]').value,
                prob: parseFloat(group.querySelector('[data-field="prob"]').value) || 0,
                decomposeValue: parseInt(group.querySelector('[data-field="decomposeValue"]').value, 10) || 0
            }));
            prizes = newPrizes;
            saveData('prizes', prizes);
            generateBoard(); renderPrizes(); checkAndRenderModules();
            closeModal('prizeEditor');
            showResult('保存成功', '奖池已更新。');
        }
    });
}

// --- INIT & MISC ---
function stepHighlight(to) { if (currentIndex >= 0 && prizeElements[currentIndex]) prizeElements[currentIndex].classList.remove('highlight'); currentIndex = to; if (prizeElements[currentIndex]) prizeElements[currentIndex].classList.add('highlight'); }
function createPrizeHTML(p) { return `<div class="result-grid" style="grid-template-columns: 1fr; max-width: 280px; margin: auto;"><div class="result-item" style="--c:${p.color || '#d946ef'};"><div class="name">${p.name}</div><div class="desc">${p.desc || ''}</div></div></div>`; }
function disableStart(flag) { rolling = flag; updateDrawButtons(); }
function updateDrawButtons() {
    if($('#btnDraw1')) $('#btnDraw1').disabled = rolling || currentKeys < 1;
    if($('#btnDraw10')) $('#btnDraw10').disabled = rolling || currentKeys < 10;
    const openChestBtn1 = $('#btnOpenChest1'), openChestBtn5 = $('#btnOpenChest5');
    if (openChestBtn1) openChestBtn1.disabled = currentChests < 1;
    if (openChestBtn5) openChestBtn5.disabled = currentChests < 5;
    if(settings.chestMode === 'claim') {
        $$('#lucky-chest-section .redeem-item').forEach(item => {
            const btn1 = item.querySelector('button:nth-of-type(1)');
            const btn5 = item.querySelector('button:nth-of-type(2)');
            if (btn1) btn1.disabled = currentChests < 1;
            if (btn5) btn5.disabled = currentChests < 5;
        });
    }
}
function loadData() {
    settings = loadItem('settings', { decomposeTo: '钥匙', animationDisabled: false, chestMode: 'claim' });
    prizes = loadItem('prizes', defaultPrizes);
    redemptionPrizes = loadItem('redemptionPrizes', defaultRedemptionPrizes);
    chestPrizes = loadItem('chestPrizes', defaultChestPrizes);
    fragmentPrizes = loadItem('fragmentPrizes', defaultFragmentPrizes);
    redemptionCounts = loadItem('redemptionCounts', {});
    userRedemptionCounts = loadItem('userRedemptionCounts', {});
    history = loadItem('history', []); rareHistory = loadItem('rareHistory', []);
    updatePoints(parseInt(localStorage.getItem('lottery.points'), 10) || 0);
    updateDraws(parseInt(localStorage.getItem('lottery.draws'), 10) || 0);
    updateKeys(parseInt(localStorage.getItem('lottery.keys'), 10) || 0);
    updateTotalSpending(parseInt(localStorage.getItem('lottery.spending'), 10) || 0);
    updateChests(parseInt(localStorage.getItem('lottery.chests'), 10) || 0);
    updateFragments(parseInt(localStorage.getItem('lottery.fragments'), 10) || 0);
}
function loadItem(key, defaultValue) {
    try { const item = localStorage.getItem(`lottery.${key}`); return item ? JSON.parse(item) : JSON.parse(JSON.stringify(defaultValue)); }
    catch { return JSON.parse(JSON.stringify(defaultValue)); }
}
function saveData(key, list) { localStorage.setItem(`lottery.${key}`, JSON.stringify(list)); }
async function resetAll() {
    try {
        await showConfirm('重置确认', '<strong>警告：</strong>此操作将重置所有配置、记录、积分、钥匙和消费！<br>确定要恢复为默认状态吗？');
        settings = { decomposeTo: '钥匙', animationDisabled: false, chestMode: 'lottery' };
        prizes = JSON.parse(JSON.stringify(defaultPrizes)); redemptionPrizes = JSON.parse(JSON.stringify(defaultRedemptionPrizes));
        chestPrizes = JSON.parse(JSON.stringify(defaultChestPrizes)); fragmentPrizes = JSON.parse(JSON.stringify(defaultFragmentPrizes));
        history = []; rareHistory = []; redemptionCounts = {}; userRedemptionCounts = {};
        updatePoints(0); updateDraws(0); updateKeys(0); updateTotalSpending(0); updateChests(0); updateFragments(0);
        ['settings', 'prizes', 'redemptionPrizes', 'chestPrizes', 'fragmentPrizes', 'history', 'rareHistory', 'redemptionCounts', 'userRedemptionCounts', 'points', 'draws', 'keys', 'spending', 'chests', 'fragments'].forEach(k => localStorage.removeItem(`lottery.${k}`));
        generateBoard(); renderPrizes();
        renderRedemptionBoard(); checkAndRenderModules(); renderStashAndWinnersModule();
        showResult('已恢复', '所有数据已恢复为默认状态。');
    } catch {}
}

// --- EVENT LISTENERS ---
$('#btnSettings').addEventListener('click', openSettings);
$('#btnEdit').addEventListener('click', openPrizeEditor);
$('#btnEditRedemption').addEventListener('click', () => openGenericListEditor(createRedemptionEditorConfig('points')));
$('#btnEditChest').addEventListener('click', openChestPrizeEditor);
$('#btnEditFragment').addEventListener('click', () => openGenericListEditor(createRedemptionEditorConfig('fragment')));
$('#btnHistory').addEventListener('click', () => showHistory(1));
$('#btnReset').addEventListener('click', resetAll);
$$('#purchase-controls .purchase-card').forEach(btn => {
    btn.addEventListener('click', async () => {
        const cost = parseInt(btn.dataset.cost, 10);
        const keys = parseInt(btn.dataset.keys, 10);
        try {
            await showConfirm('购买确认', `确定要花费 <strong>${cost} 元</strong> 购买 <strong>${keys} 把</strong> 钥匙吗?`);
            updateKeys(currentKeys + keys);
            updateTotalSpending(totalSpending + cost);
            showResult('购买成功', `您已成功获得 ${keys} 把钥匙！`);
        } catch {}
    });
});
window.addEventListener('keydown', e => { if (e.code === 'Space' && !e.target.closest('button, input, .modal, select')) { e.preventDefault(); $('#btnDraw1')?.click(); } if (e.code === 'Escape' && modalContainer.children.length > 0) modalContainer.innerHTML = ''; });

// --- MODIFICATION START ---
function showAnnouncement() {
    // Check if the user has already acknowledged the announcement
    if (localStorage.getItem('lottery.announcementSeen') === 'true') {
        return;
    }

    const content = `
    <div class="announcement-body">
        <p>欢迎使用抽奖模拟器！</p>
        <ul>
            <li><strong>数据存储:</strong> 所有抽奖记录、积分、钥匙和设置都保存在您的 <span class="text-danger">本地浏览器缓存中，不收集您的任何个人隐私或数据</span> 。清除浏览器数据将重置所有内容。</li>
            <li><strong>仅供娱乐:</strong> 本页面所有功能仅为模拟和娱乐目的，<span class="text-danger">不涉及任何充值、盈利行为，不涉及任何赌博、博彩等违反法律的行为。模拟器不会以任何形式影响您的游戏账号</span>，所有抽奖结果和兑换物品都不会发往游戏仓库。</li>
            <li><strong>自定义配置:</strong> 您可以通过 "全局设置"、"编辑奖品" 等按钮 <span class="text-danger">完全自定义奖池、概率和兑换规则</span>，打造您自己的抽奖活动。</li>
            <li><strong>重置功能:</strong> 如果遇到问题或想重新开始，可以使用 "重置数据" 按钮恢复到默认配置。</li>
        </ul>
        <p>祝您玩得愉快！</p>
    </div>
    `;
    const footer = `<button class="btn" id="ack-announcement">我已了解，不再提示</button>`;

    showModal('announcementModal', '使用说明', content, footer);

    // Add event listener to the acknowledgment button
    $('#ack-announcement').addEventListener('click', () => {
        localStorage.setItem('lottery.announcementSeen', 'true');
        closeModal('announcementModal');
    });
}
// --- MODIFICATION END ---


// --- INITIALIZE APP ---
loadData();
generateBoard();
renderPrizes();
renderStashAndWinnersModule();
renderRedemptionBoard();
checkAndRenderModules();
showAnnouncement(); // Call the announcement function on startup