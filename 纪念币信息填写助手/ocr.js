/**
 * 纯JS验证码识别模块
 * 使用 Tesseract.js 进行 OCR 识别
 */

// Tesseract.js CDN 地址
const TESSERACT_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';

// 全局 Tesseract worker
let tesseractWorker = null;
let tesseractLoaded = false;
let tesseractLoading = false;

/**
 * 动态加载 Tesseract.js
 */
async function loadTesseract() {
    if (tesseractLoaded) return true;
    if (tesseractLoading) {
        // 等待加载完成
        while (tesseractLoading) {
            await new Promise(r => setTimeout(r, 100));
        }
        return tesseractLoaded;
    }
    
    tesseractLoading = true;
    
    try {
        // 动态加载脚本
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = TESSERACT_CDN;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
        
        console.log('OCR：Tesseract.js 加载成功');
        tesseractLoaded = true;
        return true;
    } catch (error) {
        console.error('OCR：Tesseract.js 加载失败', error);
        tesseractLoading = false;
        return false;
    }
}

/**
 * 图像预处理 - 提高验证码识别率
 */
function preprocessImage(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // 灰度化 + 二值化
    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        // 二值化阈值
        const threshold = 140;
        const value = gray > threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = value;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

/**
 * 识别验证码图片
 * @param {HTMLImageElement|string} imageOrBase64 - 图片元素或base64字符串
 * @returns {Promise<{success: boolean, code?: string, error?: string}>}
 */
async function recognizeCaptchaJS(imageOrBase64) {
    try {
        // 1. 首先尝试本地 OCR 服务（如果有的话）
        const localResult = await tryLocalOCR(imageOrBase64);
        if (localResult.success) {
            return localResult;
        }
        
        // 2. 使用 Tesseract.js
        const loaded = await loadTesseract();
        if (!loaded || typeof Tesseract === 'undefined') {
            return { success: false, error: 'Tesseract.js 加载失败' };
        }
        
        // 准备图像
        let imageData;
        if (typeof imageOrBase64 === 'string') {
            imageData = imageOrBase64;
        } else {
            // 图片元素转 base64，并预处理
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imageOrBase64.naturalWidth || imageOrBase64.width;
            canvas.height = imageOrBase64.naturalHeight || imageOrBase64.height;
            ctx.drawImage(imageOrBase64, 0, 0);
            
            // 图像预处理
            preprocessImage(canvas);
            imageData = canvas.toDataURL('image/png');
        }
        
        console.log('OCR：开始识别验证码...');
        
        // 使用 Tesseract 识别
        const result = await Tesseract.recognize(imageData, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    console.log(`OCR：识别进度 ${Math.round(m.progress * 100)}%`);
                }
            }
        });
        
        // 提取识别结果，只保留字母和数字
        let code = result.data.text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        console.log('OCR：原始识别结果:', result.data.text, '处理后:', code);
        
        if (code.length >= 4) {
            // 只取前4-6位
            code = code.substring(0, 6);
            return { success: true, code };
        }
        
        return { success: false, error: '识别结果无效' };
        
    } catch (error) {
        console.error('OCR：识别失败', error);
        return { success: false, error: error.message };
    }
}

/**
 * 尝试本地 OCR 服务（ddddocr）
 */
async function tryLocalOCR(imageOrBase64) {
    try {
        let base64;
        if (typeof imageOrBase64 === 'string') {
            base64 = imageOrBase64.includes(',') ? imageOrBase64.split(',')[1] : imageOrBase64;
        } else {
            const canvas = document.createElement('canvas');
            canvas.width = imageOrBase64.naturalWidth || imageOrBase64.width;
            canvas.height = imageOrBase64.naturalHeight || imageOrBase64.height;
            canvas.getContext('2d').drawImage(imageOrBase64, 0, 0);
            base64 = canvas.toDataURL('image/png').split(',')[1];
        }
        
        const response = await fetch('http://127.0.0.1:9898/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.code && result.code.length >= 4) {
                console.log('OCR：本地服务识别成功', result.code);
                return { success: true, code: result.code };
            }
        }
    } catch (e) {
        // 本地服务不可用，静默失败
    }
    return { success: false };
}

// 导出函数（供其他脚本使用）
window.recognizeCaptchaJS = recognizeCaptchaJS;
window.loadTesseract = loadTesseract;

