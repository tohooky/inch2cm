// 換算結果を表示するためのフローティング要素
let tooltip = null;

// テキストが選択されたときのイベントを監視
document.addEventListener('mouseup', (event) => {
    // 古いツールチップがあれば削除
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
    
    // 選択されたテキストを取得
    const selection = window.getSelection().toString().trim();
    
    // 選択テキストがあり、かつ空でない場合
    if (selection.length > 0) {
        
        console.log("選択テキストがあり、かつ空でない場合")
        // バックグラウンドにメッセージを送信し、換算をリクエスト
        chrome.runtime.sendMessage({
            action: "convertInchToCm",
            text: selection
        }, (response) => {
            // バックグラウンドからの応答（換算結果）を処理
            if (response && response.result) {
                // 換算結果をページ上にツールチップとして表示
                showTooltip(response.result, event.clientX, event.clientY);
            }
        });
    }
});

// ツールチップを作成して表示する関数
function showTooltip(text, x, y) {
    // ツールチップ要素の作成
    tooltip = document.createElement('div');
    tooltip.id = 'chrome-inch-cm-converter-tooltip';
    tooltip.textContent = text;

    // スタイル設定（フローティングで目立つように）
    tooltip.style.cssText = `
        position: fixed;
        top: ${y + 10}px;
        left: ${x}px;
        z-index: 99999;
        padding: 5px 10px;
        background-color: #20232a;
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        font-size: 14px;
        white-space: nowrap;
        pointer-events: none; /* ページ操作の邪魔にならないように */
    `;

    document.body.appendChild(tooltip);
}

// ページ上のクリックイベントでツールチップを非表示にする
document.addEventListener('mousedown', () => {
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
});