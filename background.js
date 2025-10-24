// background.js

// メッセージ（コンテンツスクリプトからのリクエスト）を待ち受ける
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // 'convertInchToCm' アクションのリクエストか確認
    if (request.action === "convertInchToCm") {
        
        const selectedText = request.text.trim();
        
        // 選択されたテキストから数値部分を抽出
        const feetInchMatch = selectedText.match(/(\d+)\s*['’]\s*(\d+)\s*["”]?/); // フィート表記
        const match = selectedText.match(/(\d*\.?\d+)/); // フィート表記以外
        
        let result = null;
        
        if (feetInchMatch) {
            console.log(`feetInchMatch is ${feetInchMatch}`)

            const feet = parseFloat(feetInchMatch[1]); // 6
            const inches = parseFloat(feetInchMatch[2]); // 3
    
            // フィートとインチを合計インチに変換: (6 * 12) + 3 = 75 インチ
            const totalInches = (feet * 12) + inches;
            const cm = totalInches * 2.54;
    
            // 換算結果を整形
            result = `${feet}' ${inches}" is ${cm.toFixed(2)} cm`;

        } else if (match) {
            console.log(`match is ${match}`)
            const value = parseFloat(match[1]);
            
            // --- 換算ロジックの分岐 ---
            
            if (selectedText.includes('in') || selectedText.includes('inch') || selectedText.includes('インチ') || selectedText.includes('Height') || selectedText.includes('身長') || selectedText.includes('リーチ')) {
                // インチ (in) -> センチメートル (cm) に換算 (既存ロジック)
                const cm = value * 2.54; 
                result = `${value} in. is ${cm.toFixed(2)} cm`;
            } else if (selectedText.includes('lb') || selectedText.includes('pound') || selectedText.includes('ポンド') || selectedText.includes('Weight') || selectedText.includes('体重')) {
                // ポンド (lb) -> キログラム (kg) に換算
                const kg = value * 0.453592; 
                result = `${value} lb. is ${kg.toFixed(2)} kg`;
            }
            // どちらの単位表記も含まれていない場合
        } 
        // 有効な数値が見つからなくても、空文字列を返すことでツールチップは表示されません

        // 結果をコンテンツスクリプトに返す
        sendResponse({ result: result });
        
        // 非同期処理を示すため true を返す (必須)
        return true; 
    }
});