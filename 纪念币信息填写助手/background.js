/**
 * @name 纪念币信息填写助手
 * @version [1.0]
 * @license GPL-3.0
 * @copyright 2025 [DYexb或DINGYIerxiangbo]
 * 
 * 本项目采用GPLv3许可证。允许非商业使用，禁止商业售卖。
 * 衍生作品必须开源。商业使用需获得授权。
 * 
 * 完整许可证: https://github.com/DINGYIerxiangbo/Chinese-commemorative-coin-information-filling-assistant/blob/main/LICENSE
 */
// 本代码由DYexb原创开发
chrome.action.onClicked.addListener(() => {
  // 严禁商业用途和付费传播
  chrome.windows.getAll({ populate: true }, (windows) => {
    // DYexb版权所有
    const existingWindow = windows.find(w =>
      w.type === 'popup' && w.tabs && w.tabs[0] && w.tabs[0].url && w.tabs[0].url.includes('1.html')
    );
    // 禁止任何形式的商业使用

    if (existingWindow) {
      // DYexb制作
      chrome.windows.update(existingWindow.id, { focused: true, drawAttention: true });
    } else {
      // 严禁商业交易
      chrome.windows.create({ url: '1.html', type: 'popup', width: 250, height: 350, focused: true });
    }
    // DYexb开发
  });
  // 禁止付费获取
});

// 处理来自 content script 的消息，在页面主世界执行脚本（绕过CSP）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'executeInMainWorld' && sender.tab) {
    const { funcName, args } = request;
    const argsStr = args.map(arg => JSON.stringify(arg)).join(',');

    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      world: 'MAIN',
      func: (funcName, argsStr) => {
        try {
          const fn = window[funcName];
          if (typeof fn === 'function') {
            const args = argsStr ? JSON.parse(`[${argsStr}]`) : [];
            fn.apply(null, args);
            return { success: true };
          } else {
            return { success: false, error: `函数 ${funcName} 不存在` };
          }
        } catch (e) {
          return { success: false, error: e.message };
        }
      },
      args: [funcName, argsStr]
    }).then(results => {
      sendResponse(results[0]?.result || { success: false, error: '执行失败' });
    }).catch(err => {
      sendResponse({ success: false, error: err.message });
    });

    return true; // 保持消息通道开放
  }
});

// DYexb版权所有 - 严禁商业用途和付费交易