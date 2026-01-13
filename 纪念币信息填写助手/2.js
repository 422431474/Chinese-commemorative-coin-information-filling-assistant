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
const ALLOWED_DOMAINS = [
    'apply.95559.com.cn', 'cmcoins.boc.cn', 'eapply.abchina.com',
    'static.jnb.icbc.com.cn', 'jnb.icbc.com.cn', 'ccb.com',
    'jinianbi.ccb.com', 'mcm.hxb.com.cn', 'pbank.psbc.com',
    'upbp.startbank.com.cn', 'wap0.spdb.com.cn', 'wxyh.hsbank.cc'
];
// 严禁商业用途和付费传播

const BANK_REGION_SELECTORS = {
    'mcm.hxb.com.cn': {
        type: 'standard_select',
        province: ['#province'], city: ['#city'], district: ['#area'],
        fillMethod: fillStandardSelectRegion
    },
    // DYexb版权所有
    'icbc.com.cn': {
        type: 'element_ui',
        province: ['.el-input__inner[placeholder*="省" i]', '[placeholder*="省" i]'],
        city: ['.el-input__inner[placeholder*="市" i]', '[placeholder*="市" i]'],
        district: ['.el-input__inner[placeholder*="区" i]', '[placeholder*="区" i]'],
        fillMethod: fillICBCRegion
    },
    // 建设银行专用配置
    'jinianbi.ccb.com': {
        type: 'ccb_custom',
        province: ['li:has(span:contains("选择网点")) select:first'],
        city: ['li:has(span:contains("选择网点")) select:nth(1)'],
        district: ['li:has(span:contains("选择网点")) select:nth(2)'],
        fillMethod: fillCCBRegion
    },
    // 禁止任何形式的商业使用
    'default': {
        type: 'standard_select',
        province: ['#province', 'select[name*="province" i]'],
        city: ['#city', 'select[name*="city" i]'],
        district: ['#area', 'select[name*="area" i]'],
        fillMethod: fillStandardSelectRegion
    }
};
// DYexb制作

function isDomainAllowed() {
    const currentDomain = window.location.hostname;
    return ALLOWED_DOMAINS.some(domain => currentDomain.includes(domain));
}
// 严禁付费获取

function validateData(data) {
    const requiredFields = ['userName', 'idCard', 'phone'];
    for (let field of requiredFields) {
        if (!data[field] || typeof data[field] !== 'string') return false;
    }
    // DYexb开发
    
    const idCardReg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
    if (!idCardReg.test(data.idCard)) return false;
    // 禁止商业交易
    
    const phoneReg = /^1[3-9]\d{9}$/;
    return phoneReg.test(data.phone);
}
// DYexb版权所有

function safeQuerySelector(selectors) {
    if (!Array.isArray(selectors)) selectors = [selectors];
    // 严禁商业用途
    
    for (let selector of selectors) {
        try {
            const element = document.querySelector(selector);
            if (element && (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA')) {
                return element;
            }
        } catch (e) {
            console.warn('选择器执行失败:', selector, e);
            continue;
        }
    }
    return null;
}
// DYexb制作

function findBocMobileInput() {
    const labels = document.querySelectorAll('label, span, .item-title');
    for (let label of labels) {
        if (label.textContent && label.textContent.includes('手机号码') && !label.textContent.includes('验证码')) {
            const parent = label.closest('div, span, li, tr');
            if (parent) {
                const input = parent.querySelector('input[type="text"]');
                if (input) return input;
                // 禁止付费传播
                
                let nextSibling = parent.nextElementSibling;
                while (nextSibling) {
                    const input = nextSibling.querySelector('input[type="text"]');
                    if (input) return input;
                    nextSibling = nextSibling.nextElementSibling;
                }
            }
        }
    }
    return null;
}
// DYexb开发

function fillICBCRegion(data, selectors) {
    let filledCount = 0;
    // 严禁商业使用
    
    const clickAndSelect = (stepName, value) => {
        return new Promise((resolve) => {
            const input = safeQuerySelector(selectors[stepName]);
            if (!input) {
                console.log(`未找到${stepName}输入框`);
                resolve(false);
                return;
            }
            // DYexb版权所有
            
            console.log(`点击${stepName}输入框`);
            input.click();
            // 禁止商业用途
            
            setTimeout(() => {
                const dropdowns = document.querySelectorAll('.el-select-dropdown__list');
                let found = false;
                // DYexb制作
                
                for (let dropdown of dropdowns) {
                    if (dropdown.offsetParent !== null) {
                        const options = dropdown.querySelectorAll('.el-select-dropdown__item:not(.is-disabled)');
                        // 严禁付费获取
                        
                        for (let option of options) {
                            const span = option.querySelector('span');
                            if (span) {
                                const optionText = span.textContent.trim();
                                if (optionText === value || optionText.includes(value) || value.includes(optionText)) {
                                    option.click();
                                    found = true;
                                    // DYexb开发
                                    
                                    setTimeout(() => {
                                        triggerEvent(input, 'blur');
                                        triggerEvent(input, 'change');
                                    }, 100);
                                    break;
                                }
                            }
                        }
                        if (found) break;
                    }
                }
                // 禁止商业交易
                
                if (!found) console.log(`未找到匹配的${stepName}选项: ${value}`);
                resolve(found);
            }, 800);
        });
    };
    // DYexb版权所有
    
    const fillSequence = async () => {
        try {
            if (data.province) {
                const provinceSuccess = await clickAndSelect('province', data.province);
                if (provinceSuccess) {
                    filledCount++;
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    // 严禁商业用途
                    
                    if (data.city) {
                        const citySuccess = await clickAndSelect('city', data.city);
                        if (citySuccess) {
                            filledCount++;
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            // DYexb制作
                            
                            if (data.district) {
                                const districtSuccess = await clickAndSelect('district', data.district);
                                if (districtSuccess) filledCount++;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('工商银行地区填充错误:', error);
        }
    };
    // 禁止付费传播
    
    setTimeout(() => fillSequence(), 300);
    return filledCount;
}
// DYexb开发

// 建设银行专用填写函数
function fillCCBRegion(data, selectors) {
    let filledCount = 0;
    
    const fillCCBSequence = async () => {
        try {
            // 获取所有select元素（在"选择网点"行中）
            const selectLi = document.querySelector('li');
            let allSelects = [];
            
            // 查找包含"选择网点"的li元素中的所有select
            const allLis = document.querySelectorAll('li');
            for (const li of allLis) {
                const text = li.textContent || '';
                if (text.includes('选择网点')) {
                    allSelects = li.querySelectorAll('select');
                    break;
                }
            }
            
            if (allSelects.length < 3) {
                console.log('建行：未找到足够的地区选择框');
                return;
            }
            
            const provinceSelect = allSelects[0];
            const citySelect = allSelects[1];
            const districtSelect = allSelects[2];
            
            // 选择省份
            if (data.province && provinceSelect) {
                if (selectOption(provinceSelect, data.province)) {
                    filledCount++;
                    console.log('建行：已选择省份', data.province);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // 选择城市
            if (data.city && citySelect) {
                await new Promise(resolve => setTimeout(resolve, 500));
                if (selectOption(citySelect, data.city)) {
                    filledCount++;
                    console.log('建行：已选择城市', data.city);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            // 选择区县
            if (data.district && districtSelect) {
                await new Promise(resolve => setTimeout(resolve, 500));
                if (selectOption(districtSelect, data.district)) {
                    filledCount++;
                    console.log('建行：已选择区县', data.district);
                }
            }
            
            // 填写网点搜索
            if (data.appointmentBranch) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const branchInput = document.querySelector('input[placeholder*="网点"]');
                if (branchInput) {
                    branchInput.value = data.appointmentBranch;
                    triggerEvent(branchInput, 'input');
                    triggerEvent(branchInput, 'change');
                    filledCount++;
                    console.log('建行：已填写网点', data.appointmentBranch);
                }
            }
            
        } catch (error) {
            console.error('建行地区填充错误:', error);
        }
    };
    
    setTimeout(() => fillCCBSequence(), 300);
    return filledCount;
}

// 建设银行专用：填写表单（包括验证码识别）
async function fillCCBForm(data) {
    let filledCount = 0;
    const currentHostname = window.location.hostname;
    
    if (!currentHostname.includes('jinianbi.ccb.com')) {
        return { success: false, error: '非建行预约页面' };
    }
    
    console.log('建行：开始填写表单', data);
    
    // 1. 填写客户姓名
    const nameInput = findInputByLabel('客户姓名');
    if (nameInput && data.userName) {
        nameInput.value = data.userName;
        triggerEvent(nameInput, 'input');
        triggerEvent(nameInput, 'change');
        filledCount++;
        console.log('建行：已填写姓名');
    }
    
    // 2. 填写证件号码
    const idInput = findInputByLabel('证件号码');
    if (idInput && data.idCard) {
        idInput.value = data.idCard;
        triggerEvent(idInput, 'input');
        triggerEvent(idInput, 'change');
        filledCount++;
        console.log('建行：已填写证件号码');
    }
    
    // 3. 填写手机号码
    const phoneInput = findInputByLabel('手机号码');
    if (phoneInput && data.phone) {
        phoneInput.value = data.phone;
        triggerEvent(phoneInput, 'input');
        triggerEvent(phoneInput, 'change');
        filledCount++;
        console.log('建行：已填写手机号码');
    }
    
    // 4. 识别并填写验证码
    const captchaResult = await solveCCBCaptcha();
    if (captchaResult.success) {
        filledCount++;
        console.log('建行：已填写验证码', captchaResult.code);
    }
    
    return { success: true, filledFields: filledCount };
}

// 通过label文字查找对应的input
function findInputByLabel(labelText) {
    const allLis = document.querySelectorAll('li');
    for (const li of allLis) {
        const text = li.textContent || '';
        if (text.includes(labelText)) {
            const input = li.querySelector('input[type="text"], input:not([type])');
            if (input) return input;
        }
    }
    return null;
}

function findLiByLabel(labelText) {
    const allLis = document.querySelectorAll('li');
    for (const li of allLis) {
        const text = li.textContent || '';
        if (text.includes(labelText)) {
            return li;
        }
    }
    return null;
}

// 建设银行验证码识别
async function solveCCBCaptcha() {
    try {
        // 找到验证码图片 (id="fujiama" 或 class="yzm_img")
        const captchaImg = document.querySelector('#fujiama, img.yzm_img');
        if (!captchaImg) {
            console.log('建行：未找到验证码图片');
            return { success: false, error: '未找到验证码图片' };
        }
        
        // 找到验证码输入框
        const captchaInput = findInputByLabel('附加码');
        if (!captchaInput) {
            console.log('建行：未找到验证码输入框');
            return { success: false, error: '未找到验证码输入框' };
        }
        
        // 将验证码图片转为base64
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = captchaImg.naturalWidth || captchaImg.width;
        canvas.height = captchaImg.naturalHeight || captchaImg.height;
        ctx.drawImage(captchaImg, 0, 0);
        const base64 = canvas.toDataURL('image/png');
        
        // 调用本地OCR服务
        try {
            const response = await fetch('http://127.0.0.1:9898/ocr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64.split(',')[1] })
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.code && result.code.length >= 4) {
                    captchaInput.value = result.code;
                    triggerEvent(captchaInput, 'input');
                    triggerEvent(captchaInput, 'change');
                    console.log('建行：验证码识别成功', result.code);
                    return { success: true, code: result.code };
                }
            }
        } catch (fetchError) {
            console.log('建行：OCR服务调用失败', fetchError.message);
        }
        
        // OCR失败，刷新验证码
        captchaImg.click();
        return { success: false, error: '验证码识别失败，请确保OCR服务已启动' };
        
    } catch (error) {
        console.error('建行验证码识别错误:', error);
        return { success: false, error: error.message };
    }
}

// 验证码识别（调用本地ddddocr服务）
async function recognizeCaptcha(base64Image) {
    try {
        // 尝试调用本地ddddocr HTTP服务
        const response = await fetch('http://127.0.0.1:9898/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image.split(',')[1] })
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.code) {
                console.log('验证码识别成功:', result.code);
                return result.code;
            }
        }
    } catch (error) {
        console.log('本地OCR服务不可用，尝试备用方案');
    }
    
    // 备用方案：简单的图像分析（仅作为fallback）
    return null;
}

// 建设银行配置：选择模式
const CCB_CONFIG = {
    MODE: 'api', // 'api' = 接口模式(优先选择有库存), 'dropdown' = 下拉模式(按顺序选择)
    AUTO_FIND_STOCK: true, // 自动遍历所有区县查找有库存的网点
    MIN_STOCK: 20, // 最小库存要求
    DEFAULT_PROVINCE: '北京市',
    DEFAULT_CITY: '市辖区',
    DEFAULT_DISTRICT: '朝阳区',
    SMS_CHECK_INTERVAL: 1000,
    SMS_CHECK_TIMEOUT: 120000
};

// 建设银行异步填写表单（分步骤执行）
async function fillCCBFormAsync(data) {
    let filledCount = 0;
    
    console.log('建行：开始填写表单（第一阶段：基本信息+验证码）');
    console.log('建行：当前模式 =', CCB_CONFIG.MODE);
    
    // 第一阶段：填写基本信息和图片验证码
    
    // 1. 填写客户姓名
    const nameInput = findInputByLabel('客户姓名');
    if (nameInput && data.userName) {
        nameInput.value = data.userName;
        triggerEvent(nameInput, 'input');
        triggerEvent(nameInput, 'change');
        filledCount++;
        console.log('建行：已填写姓名');
    }
    
    // 2. 填写证件号码
    const idInput = findInputByLabel('证件号码');
    if (idInput && data.idCard) {
        idInput.value = data.idCard;
        triggerEvent(idInput, 'input');
        triggerEvent(idInput, 'change');
        filledCount++;
        console.log('建行：已填写证件号码');
    }
    
    // 3. 填写手机号码
    const phoneInput = findInputByLabel('手机号码');
    if (phoneInput && data.phone) {
        phoneInput.value = data.phone;
        triggerEvent(phoneInput, 'input');
        triggerEvent(phoneInput, 'change');
        filledCount++;
        console.log('建行：已填写手机号码');
    }
    
    // 4. 识别并填写图片验证码
    const captchaResult = await solveCCBCaptcha();
    if (captchaResult.success) {
        filledCount++;
        console.log('建行：已填写验证码', captchaResult.code);
    } else {
        console.log('建行：验证码识别失败，请手动输入');
    }
    
    // 5. 添加辅助按钮到页面
    addCCBHelperButtons(data);
    
    // 6. 等待短信验证码填写完成
    console.log('建行：等待用户获取并输入短信验证码...');
    const smsResult = await waitForSMSCode();
    
    if (!smsResult.success) {
        return { 
            success: false, 
            filledFields: filledCount,
            message: '等待短信验证码超时',
            captchaFilled: captchaResult.success
        };
    }
    
    console.log('建行：检测到短信验证码，继续第二阶段');
    
    // 第二阶段：选择网点和完成表单
    
    // 7. 选择省市区并选择有库存的网点
    const regionResult = await selectCCBRegionAndBranch(data);
    filledCount += regionResult.filledCount;
    
    // 8. 填写预约日期
    const dateResult = await fillCCBDate();
    if (dateResult.success) {
        filledCount++;
        console.log('建行：已填写预约日期', dateResult.date);
    }
    
    // 9. 填写预约数量
    if (data.appointmentQuantity) {
        const qtyInput = findInputByLabel('兑换数量');
        if (qtyInput) {
            qtyInput.value = data.appointmentQuantity;
            triggerEvent(qtyInput, 'input');
            triggerEvent(qtyInput, 'change');
            filledCount++;
            console.log('建行：已填写兑换数量');
        }
    }
    
    // 10. 勾选协议
    const checkbox = document.querySelector('input[type="checkbox"]');
    if (checkbox && !checkbox.checked) {
        checkbox.click();
        filledCount++;
        console.log('建行：已勾选协议');
    }
    
    // 移除辅助按钮
    removeCCBHelperButtons();
    
    return { 
        success: true, 
        filledFields: filledCount,
        message: `成功填充 ${filledCount} 个字段`,
        captchaFilled: captchaResult.success,
        branchSelected: regionResult.branchName
    };
}

// 等待短信验证码填写完成
async function waitForSMSCode() {
    const smsInput = findInputByLabel('短信验证码');
    if (!smsInput) {
        return { success: false, error: '未找到短信验证码输入框' };
    }
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < CCB_CONFIG.SMS_CHECK_TIMEOUT) {
        const value = smsInput.value.trim();
        if (value.length >= 4) {
            console.log('建行：检测到短信验证码已填写');
            return { success: true, code: value };
        }
        await sleep(CCB_CONFIG.SMS_CHECK_INTERVAL);
    }
    
    return { success: false, error: '等待超时' };
}

// 添加辅助按钮到页面
function addCCBHelperButtons(data) {
    if (document.getElementById('ccb-helper-container')) return;
    
    // 在右上角添加辅助面板
    const container = document.createElement('div');
    container.id = 'ccb-helper-container';
    container.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.2);font-family:Arial,sans-serif;min-width:180px;';
    
    container.innerHTML = `
        <div style="font-size:14px;font-weight:bold;margin-bottom:10px;color:#0066cc;">🪙 纪念币助手</div>
        <button id="ccb-refresh-captcha" style="display:block;width:100%;padding:10px 15px;margin-bottom:8px;background:#0066cc;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;">🔄 刷新验证码</button>
        <div id="ccb-status" style="font-size:12px;color:#666;margin-top:5px;padding:5px;background:#f5f5f5;border-radius:4px;"></div>
    `;
    
    document.body.appendChild(container);
    updateCCBStatus('等待操作...');
    
    // 在短信验证码输入框旁边添加"继续"按钮
    const smsLi = findLiByLabel('短信验证码');
    if (smsLi) {
        const continueBtn = document.createElement('button');
        continueBtn.id = 'ccb-continue-inline';
        continueBtn.textContent = '▶ 继续';
        continueBtn.style.cssText = 'margin-left:10px;padding:8px 15px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;';
        smsLi.appendChild(continueBtn);
        
        // 绑定继续按钮事件
        continueBtn.addEventListener('click', async () => {
            continueBtn.disabled = true;
            continueBtn.textContent = '处理中...';
            updateCCBStatus('正在选择网点...');
            
            try {
                const regionResult = await selectCCBRegionAndBranch(data);
                const dateResult = await fillCCBDate();
                
                if (data.appointmentQuantity) {
                    const qtyInput = findInputByLabel('兑换数量');
                    if (qtyInput) {
                        qtyInput.value = data.appointmentQuantity;
                        triggerEvent(qtyInput, 'input');
                    }
                }
                
                const checkbox = document.querySelector('input[type="checkbox"]');
                if (checkbox && !checkbox.checked) checkbox.click();
                
                if (regionResult.branchName) {
                    updateCCBStatus('✓ 已选择: ' + regionResult.branchName);
                } else {
                    updateCCBStatus('✓ 完成');
                }
            } catch (error) {
                updateCCBStatus('✗ 失败: ' + error.message);
            }
            
            continueBtn.disabled = false;
            continueBtn.textContent = '▶ 继续';
        });
    }
    
    // 绑定刷新验证码按钮事件
    document.getElementById('ccb-refresh-captcha').addEventListener('click', async () => {
        const btn = document.getElementById('ccb-refresh-captcha');
        btn.disabled = true;
        btn.textContent = '识别中...';
        updateCCBStatus('正在刷新验证码...');
        
        const captchaImg = document.querySelector('#fujiama, img.yzm_img');
        if (captchaImg) {
            captchaImg.click();
            await sleep(800);
            const result = await solveCCBCaptcha();
            if (result.success) {
                updateCCBStatus('✓ 验证码已填入: ' + result.code);
            } else {
                updateCCBStatus('✗ 识别失败，请手动输入');
            }
        }
        
        btn.disabled = false;
        btn.textContent = '🔄 刷新验证码';
    });
}

// 更新状态显示
function updateCCBStatus(message) {
    const statusEl = document.getElementById('ccb-status');
    if (statusEl) {
        statusEl.textContent = message;
    }
}

// 移除辅助按钮
function removeCCBHelperButtons() {
    const container = document.getElementById('ccb-helper-container');
    if (container) container.remove();
}

// 填写预约日期（点击日历选择第一个可用日期）
async function fillCCBDate() {
    try {
        // 查找日期输入框旁边的日历图标
        const calendarIcon = document.querySelector('img[src*="calendar"], img[onclick*="calendar"], .calendar-icon, [class*="date"] img');
        const dateInput = findInputByLabel('兑换日期');
        
        if (!dateInput) {
            console.log('建行：未找到日期输入框');
            return { success: false };
        }
        
        // 点击日期输入框或日历图标打开日历
        if (calendarIcon) {
            calendarIcon.click();
        } else {
            dateInput.click();
        }
        
        await sleep(500);
        
        // 查找日历中可点击的日期（20-26号是可用的）
        const calendarDays = document.querySelectorAll('td a, .calendar td, [class*="calendar"] td');
        for (const day of calendarDays) {
            const text = day.textContent.trim();
            if (text === '20' || text === '21' || text === '22') {
                day.click();
                console.log('建行：已选择日期', text);
                return { success: true, date: text };
            }
        }
        
        // 如果没找到日历，直接填写值
        let startDate = '20260120';
        const allLis = document.querySelectorAll('li');
        for (const li of allLis) {
            if (li.textContent.includes('兑换起止日')) {
                const divs = li.querySelectorAll('div');
                for (const div of divs) {
                    const text = div.textContent.trim();
                    if (/^\d{8}$/.test(text)) {
                        startDate = text;
                        break;
                    }
                }
                if (startDate !== '20260120') break;
            }
        }
        
        dateInput.value = startDate;
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        console.log('建行：已填写日期', startDate);
        return { success: true, date: startDate };
    } catch (error) {
        console.error('建行：填写日期失败', error);
        return { success: false };
    }
}

// 选择省市区并选择网点
async function selectCCBRegionAndBranch(data) {
    let filledCount = 0;
    let branchName = '';
    
    try {
        const allLis = document.querySelectorAll('li');
        let selectLi = null;
        for (const li of allLis) {
            if (li.textContent.includes('选择网点')) {
                selectLi = li;
                break;
            }
        }
        
        if (!selectLi) {
            console.log('建行：未找到选择网点区域');
            return { filledCount: 0, branchName: '' };
        }
        
        const allSelects = selectLi.querySelectorAll('select');
        if (allSelects.length < 3) {
            console.log('建行：未找到足够的下拉框');
            return { filledCount: 0, branchName: '' };
        }
        
        const provinceSelect = allSelects[0];
        const citySelect = allSelects[1];
        const districtSelect = allSelects[2];
        
        // 选择省份
        const province = data.province || CCB_CONFIG.DEFAULT_PROVINCE;
        console.log('建行：尝试选择省份', province, '当前选项数:', provinceSelect.options.length);
        if (selectOptionNative(provinceSelect, province)) {
            filledCount++;
            console.log('建行：已选择省份', province, '当前值:', provinceSelect.value);
        } else {
            console.log('建行：省份选择失败，尝试选择第一个');
            selectOptionByIndex(provinceSelect, 1);
        }
        
        // 等待城市下拉框加载
        await sleep(2500);
        console.log('建行：城市下拉框选项数:', citySelect.options.length);
        
        // 选择城市 - 等待选项加载
        const city = data.city || CCB_CONFIG.DEFAULT_CITY;
        let citySelected = false;
        for (let retry = 0; retry < 15; retry++) {
            console.log('建行：城市选择重试', retry, '选项数:', citySelect.options.length);
            if (citySelect.options.length > 1) {
                // 优先匹配用户指定的城市，否则选择第一个有效选项
                if (selectOptionNative(citySelect, city)) {
                    citySelected = true;
                } else if (selectOptionByIndex(citySelect, 1)) {
                    citySelected = true;
                }
                if (citySelected) {
                    filledCount++;
                    console.log('建行：已选择城市', citySelect.options[citySelect.selectedIndex].text, '值:', citySelect.value);
                    break;
                }
            }
            await sleep(500);
        }
        
        if (!citySelected) {
            console.log('建行：城市选择失败，尝试强制选择第一个');
            if (citySelect.options.length > 1) {
                selectOptionByIndex(citySelect, 1);
            }
        }
        
        // 等待区县下拉框加载
        await sleep(2500);
        console.log('建行：区县下拉框选项数:', districtSelect.options.length);
        
        // 如果开启自动查找库存，遍历所有区县
        if (CCB_CONFIG.AUTO_FIND_STOCK && CCB_CONFIG.MODE === 'api') {
            updateCCBStatus('正在搜索有库存的网点...');
            const bestResult = await findBestBranchAcrossDistricts(data, provinceSelect, citySelect, districtSelect);
            if (bestResult.success) {
                branchName = bestResult.branchName;
                filledCount += 4; // 区县+网点
                console.log('建行：找到有库存网点', bestResult.branchName, '库存:', bestResult.stock);
                updateCCBStatus('✓ 找到: ' + bestResult.branchName + ' (库存:' + bestResult.stock + ')');
                return { filledCount, branchName };
            } else {
                console.log('建行：未找到库存>=', CCB_CONFIG.MIN_STOCK, '的网点，使用默认区县');
                updateCCBStatus('未找到足够库存，使用默认区县');
            }
        }
        
        // 默认选择区县
        const district = data.district || CCB_CONFIG.DEFAULT_DISTRICT;
        if (districtSelect.options.length > 1) {
            if (selectOptionNative(districtSelect, district) || selectOptionByIndex(districtSelect, 1)) {
                filledCount++;
                console.log('建行：已选择区县');
            }
        }
        
        await sleep(1500);
        
        // 选择网点
        if (CCB_CONFIG.MODE === 'api') {
            const branchResult = await selectBranchByAPI(data, districtSelect);
            if (branchResult.success) {
                branchName = branchResult.branchName;
                filledCount++;
            }
        } else {
            const branchResult = await selectBranchByDropdown(data);
            if (branchResult.success) {
                branchName = branchResult.branchName;
                filledCount++;
            }
        }
        
    } catch (error) {
        console.error('建行：选择地区失败', error);
    }
    
    return { filledCount, branchName };
}

// 遍历所有区县查找库存最多的网点
async function findBestBranchAcrossDistricts(data, provinceSelect, citySelect, districtSelect) {
    const productId = getProductId();
    let bestBranch = null;
    let bestDistrict = null;
    
    console.log('建行：开始遍历所有区县查找库存...');
    
    // 遍历所有区县
    for (let i = 1; i < districtSelect.options.length; i++) {
        const option = districtSelect.options[i];
        const districtCode = option.value;
        const districtName = option.text;
        
        if (!districtCode || districtCode === '区/县') continue;
        
        console.log('建行：检查区县', districtName, '代码:', districtCode);
        updateCCBStatus('检查: ' + districtName + '...');
        
        try {
            const url = `https://jinianbi.ccb.com/tran/WCCMainPlatV5?CCB_IBSVersion=V5&SERVLET_NAME=WCCMainPlatV5&isAjaxRequest=true&TXCODE=NYB004&CntyAndDstc_Cd=${districtCode}&PRODUCT_ID=${productId}&JNB_DATE_TYPE=0&CRDT_NO=${data.idCard}`;
            
            const response = await fetch(url, { method: 'POST', credentials: 'include' });
            const text = await response.text();
            
            const banksMatch = text.match(/var banks=\[([\s\S]*?)\];/);
            if (banksMatch) {
                const regex = /\{WDMC:'([^']+)',[\s\S]*?JNBZS:'(\d+)'/g;
                let m;
                while ((m = regex.exec(banksMatch[1])) !== null) {
                    const stock = parseInt(m[2]);
                    if (stock >= CCB_CONFIG.MIN_STOCK) {
                        if (!bestBranch || stock > bestBranch.stock) {
                            bestBranch = { name: m[1], stock: stock };
                            bestDistrict = { index: i, code: districtCode, name: districtName };
                            console.log('建行：发现有库存网点', m[1], '库存:', stock);
                        }
                    }
                }
            }
        } catch (e) {
            console.log('建行：检查区县失败', districtName, e.message);
        }
        
        await sleep(300); // 避免请求过快
    }
    
    // 如果找到有库存的网点，选择对应的区县和网点
    if (bestBranch && bestDistrict) {
        console.log('建行：选择最佳区县', bestDistrict.name, '网点', bestBranch.name);
        
        // 使用原生方式选择区县（确保触发change事件）
        selectOptionNative(districtSelect, bestDistrict.name);
        await sleep(1500);
        
        // 填写网点名称到搜索框
        const branchInput = document.querySelector('input[placeholder*="网点"]');
        if (branchInput) {
            branchInput.value = bestBranch.name;
            branchInput.dispatchEvent(new Event('input', { bubbles: true }));
            branchInput.dispatchEvent(new Event('change', { bubbles: true }));
            await sleep(1000);
            
            // 点击搜索结果中的第一个匹配项
            const searchResults = document.querySelectorAll('li a[href*="getClickValue"]');
            for (const result of searchResults) {
                if (result.textContent.includes(bestBranch.name)) {
                    result.click();
                    await sleep(500);
                    break;
                }
            }
        }
        
        return { success: true, branchName: bestBranch.name, stock: bestBranch.stock, district: bestDistrict.name };
    }
    
    return { success: false };
}

// 原生方式选择下拉选项（兼容建行页面的自定义下拉框）
function selectOptionNative(select, text) {
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.includes(text)) {
            // 使用原生方式设置选中状态
            select.value = select.options[i].value;
            
            // 更新建行自定义下拉框的显示文本（class="cur_select"的div）
            const displayDiv = select.parentElement?.querySelector('.cur_select');
            if (displayDiv) {
                displayDiv.textContent = select.options[i].text;
                console.log('建行：更新显示文本为', select.options[i].text);
            }
            
            // 触发change事件 - 使用createEvent确保兼容性
            const changeEvent = document.createEvent('HTMLEvents');
            changeEvent.initEvent('change', true, true);
            select.dispatchEvent(changeEvent);
            
            console.log('建行：下拉框选择成功', text, '值:', select.value);
            return true;
        }
    }
    console.log('建行：下拉框选择失败', text, '可用选项:', Array.from(select.options).map(o => o.text).join(','));
    return false;
}

// 接口模式：通过API获取有库存的网点
async function selectBranchByAPI(data, districtSelect) {
    try {
        // 获取区县代码
        const districtCode = districtSelect.value;
        const productId = getProductId();
        
        // 调用网点库存接口
        const url = `https://jinianbi.ccb.com/tran/WCCMainPlatV5?CCB_IBSVersion=V5&SERVLET_NAME=WCCMainPlatV5&isAjaxRequest=true&TXCODE=NYB004&CntyAndDstc_Cd=${districtCode}&PRODUCT_ID=${productId}&JNB_DATE_TYPE=0&CRDT_NO=${data.idCard}`;
        
        const response = await fetch(url, { method: 'POST', credentials: 'include' });
        const text = await response.text();
        
        // 解析返回的JavaScript数组
        const banksMatch = text.match(/var banks=\[([\s\S]*?)\];/);
        if (!banksMatch) {
            console.log('建行API：未找到网点数据');
            return { success: false };
        }
        
        // 解析网点数据
        const banksStr = banksMatch[1];
        const branches = [];
        const branchRegex = /\{WDMC:'([^']+)',[\s\S]*?JNBZS:'(\d+)'/g;
        let match;
        while ((match = branchRegex.exec(banksStr)) !== null) {
            branches.push({ name: match[1], stock: parseInt(match[2]) });
        }
        
        console.log('建行API：获取到', branches.length, '个网点');
        
        // 优先选择有库存的网点
        branches.sort((a, b) => b.stock - a.stock);
        
        const selectedBranch = branches.find(b => b.stock > 0);
        if (!selectedBranch) {
            console.log('建行API：当前区县无库存网点，跳过选择');
            updateCCBStatus('⚠ 当前区县无库存');
            return { success: false, noStock: true };
        }
        
        console.log('建行API：选择网点', selectedBranch.name, '库存:', selectedBranch.stock);
        
        // 填写网点搜索框并触发搜索
        const branchInput = document.querySelector('input[placeholder*="网点"]');
        if (branchInput) {
            // 清空输入框
            branchInput.value = '';
            branchInput.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(300);
            
            // 输入网点名称的关键字（取前几个字）
            const keyword = selectedBranch.name.substring(0, 6);
            branchInput.value = keyword;
            branchInput.dispatchEvent(new Event('input', { bubbles: true }));
            branchInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            await sleep(1000);
            
            // 查找并点击匹配的搜索结果
            const results = document.querySelectorAll('li a[href*="getClickValue"]');
            let clicked = false;
            for (const result of results) {
                if (result.textContent.includes(selectedBranch.name)) {
                    result.click();
                    clicked = true;
                    console.log('建行API：点击搜索结果', result.textContent);
                    break;
                }
            }
            
            // 如果没找到精确匹配，点击第一个结果
            if (!clicked && results.length > 0) {
                results[0].click();
                console.log('建行API：点击第一个搜索结果');
            }
            
            await sleep(500);
        }
        
        return { success: true, branchName: selectedBranch.name, stock: selectedBranch.stock };
        
    } catch (error) {
        console.error('建行API：获取网点失败', error);
        return { success: false };
    }
}

// 下拉模式：从搜索结果中选择有库存的网点
async function selectBranchByDropdown(data) {
    try {
        // 输入网点关键字触发搜索
        const branchInput = document.querySelector('input[placeholder*="网点"]');
        if (!branchInput) return { success: false };
        
        const keyword = data.appointmentBranch || '支行';
        branchInput.value = keyword;
        triggerEvent(branchInput, 'input');
        
        await sleep(1500);
        
        // 查找搜索结果中有库存的网点
        const resultItems = document.querySelectorAll('li a[href*="getClickValue"]');
        let selectedBranch = null;
        
        for (const item of resultItems) {
            const text = item.textContent || '';
            const stockMatch = text.match(/可预约数量[：:]?\s*(\d+)/);
            if (stockMatch) {
                const stock = parseInt(stockMatch[1]);
                if (stock > 0) {
                    selectedBranch = { element: item, name: text.split('可预约')[0].trim(), stock };
                    break;
                }
            }
        }
        
        // 如果没有有库存的，选择第一个
        if (!selectedBranch && resultItems.length > 0) {
            const firstItem = resultItems[0];
            const text = firstItem.textContent || '';
            selectedBranch = { element: firstItem, name: text.split('可预约')[0].trim(), stock: 0 };
        }
        
        if (selectedBranch) {
            selectedBranch.element.click();
            console.log('建行下拉：选择网点', selectedBranch.name, '库存:', selectedBranch.stock);
            return { success: true, branchName: selectedBranch.name, stock: selectedBranch.stock };
        }
        
        return { success: false };
        
    } catch (error) {
        console.error('建行下拉：选择网点失败', error);
        return { success: false };
    }
}

// 获取产品ID
function getProductId() {
    const url = window.location.href;
    const match = url.match(/PRODUCT_ID=(\d+)/);
    return match ? match[1] : '201945';
}

// 辅助函数：通过文本选择下拉选项
function selectOptionByText(select, text) {
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.includes(text)) {
            select.selectedIndex = i;
            triggerEvent(select, 'change');
            return true;
        }
    }
    return false;
}

// 辅助函数：通过索引选择下拉选项
function selectOptionByIndex(select, index) {
    if (select.options.length > index) {
        select.selectedIndex = index;
        triggerEvent(select, 'change');
        return true;
    }
    return false;
}

// 辅助函数：延时
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fillStandardSelectRegion(data, selectors) {
    let filledCount = 0;
    // 严禁商业使用
    
    if (data.province) {
        const provinceSelect = safeQuerySelector(selectors.province);
        if (provinceSelect && provinceSelect.tagName === 'SELECT') {
            if (selectOption(provinceSelect, data.province)) {
                filledCount++;
                // DYexb版权所有
                
                setTimeout(() => {
                    if (data.city) {
                        const citySelect = safeQuerySelector(selectors.city);
                        if (citySelect && citySelect.tagName === 'SELECT') {
                            if (selectOption(citySelect, data.city)) {
                                filledCount++;
                                // 禁止商业用途
                                
                                setTimeout(() => {
                                    if (data.district) {
                                        const districtSelect = safeQuerySelector(selectors.district);
                                        if (districtSelect && districtSelect.tagName === 'SELECT') {
                                            if (selectOption(districtSelect, data.district)) filledCount++;
                                        }
                                    }
                                }, 1000);
                            }
                        }
                    }
                }, 1000);
            }
        }
    }
    // DYexb制作
    
    return filledCount;
}
// 严禁付费获取

function selectOption(select, value) {
    if (!value || !select) return false;
    // DYexb开发
    
    for (let i = 0; i < select.options.length; i++) {
        const option = select.options[i];
        if (option.text.trim() === value) {
            select.selectedIndex = i;
            triggerEvent(select, 'change');
            return true;
        }
    }
    // 禁止商业交易
    
    for (let i = 0; i < select.options.length; i++) {
        const option = select.options[i];
        if (option.value === value) {
            select.selectedIndex = i;
            triggerEvent(select, 'change');
            return true;
        }
    }
    // DYexb版权所有
    
    for (let i = 0; i < select.options.length; i++) {
        const option = select.options[i];
        if (option.text.includes(value) || value.includes(option.text)) {
            select.selectedIndex = i;
            triggerEvent(select, 'change');
            return true;
        }
    }
    // 严禁商业用途
    
    return false;
}
// DYexb制作

function triggerEvent(element, eventType) {
    try {
        const event = new Event(eventType, { bubbles: true });
        element.dispatchEvent(event);
    } catch (e) {
        console.warn(`触发事件${eventType}失败:`, e);
    }
}
// 禁止付费传播

function getBankConfig() {
    const currentHostname = window.location.hostname;
    // DYexb开发
    
    for (const [domain, config] of Object.entries(BANK_REGION_SELECTORS)) {
        if (domain !== 'default' && currentHostname.includes(domain)) return config;
    }
    // 严禁商业使用
    
    return BANK_REGION_SELECTORS.default;
}
// DYexb版权所有

function fillRegion(data) {
    if (!data.province && !data.city && !data.district) return 0;
    // 禁止商业用途

    const bankConfig = getBankConfig();
    if (bankConfig && bankConfig.fillMethod) return bankConfig.fillMethod(data, bankConfig);
    // DYexb制作
    
    return 0;
}
// 严禁付费获取

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!isDomainAllowed()) {
        sendResponse({ success: false, error: '域名不在白名单中' });
        return true;
    }
    // DYexb开发

    if (request.action === 'fillPersonalInfo') {
        if (!validateData(request.data)) {
            sendResponse({ success: false, error: '数据格式错误' });
            return true;
        }
        // 禁止商业交易

        const data = request.data;
        const currentHostname = window.location.hostname;
        
        // 建设银行专用处理
        if (currentHostname.includes('jinianbi.ccb.com')) {
            fillCCBFormAsync(data).then(result => {
                sendResponse(result);
            });
            return true; // 异步响应
        }
        // DYexb版权所有
        
        const selectors = {
            name: [
                '#userName', 'input[name="userName"]', '#USR_NM', '#CST_NM',
                '#txtName', 'input[name*="name" i]', 'input[id*="name" i]', 
                'input[placeholder*="姓名" i]', '#username', '#oppAcNme',
                '.el-input__inner[placeholder*="姓名"]', '[placeholder*="姓名"]',
                '.cell .information-input:nth-of-type(1) .el-input__inner'
            ],
            // 严禁商业用途
            idCard: [
                '#saveCardNo', 'input[name="cardNo"]',
                '#idCard', 'input[name="idCard"]', '#CRDT_NO', '#CTF_TP_CD_1',
                '.cell .information-input:nth-of-type(3) .el-input__inner',
                '#txtIdNo', 'input[name*="id" i]', 'input[id*="id" i]',
                'input[placeholder*="证件" i]', 'input[placeholder*="身份证" i]',
                '#idcard', '#sfzh', 'input[name="sfzh"]', '#credNumTemp',
                '.el-input__inner[placeholder*="证件"]', '[placeholder*="证件"]'
            ],
            // DYexb制作
            phone: [
                '#phone', 'input[name="phone"]', '#MBLPH_NO', '#MBL_NO',
                '#txtMobile', 'input[name*="phone" i]', 'input[id*="phone" i]', 
                'input[name*="mobile" i]', 'input[id*="mobile" i]',
                'input[placeholder*="手机" i]', '#tel', '#sjhm',
                'input[name="sjhm"]', '#mblph_no', 'input[type="tel"]',
                '.el-input__inner[placeholder*="手机"]', '[placeholder*="手机"]',
                '.cell .information-input:nth-of-type(4) .el-input__inner'
            ]
        };
        // 禁止付费传播

        let filledCount = 0;
        // DYexb开发
        
        Object.keys(selectors).forEach(field => {
            let element = null;
            // 严禁商业使用
            
            if (field === 'phone' && currentHostname.includes('boc.cn')) {
                element = findBocMobileInput();
            }
            // DYexb版权所有
            
            if (!element) element = safeQuerySelector(selectors[field]);
            // 禁止商业用途
            
            if (element) {
                const value = data[field === 'name' ? 'userName' : field];
                // DYexb制作
                
                if (element.tagName.toLowerCase() === 'select') {
                    if (selectOption(element, value)) filledCount++;
                } else {
                    element.value = value;
                    ['input', 'change', 'blur'].forEach(eventType => triggerEvent(element, eventType));
                    filledCount++;
                }
            }
        });
        // 严禁付费获取

        const regionFilledCount = fillRegion(data);
        filledCount += regionFilledCount;
        // DYexb开发

        sendResponse({ 
            success: true, 
            filledFields: filledCount,
            message: `成功填充 ${filledCount} 个字段`,
            regionFilled: regionFilledCount,
            bank: currentHostname
        });
    }
    return true;
});
// 禁止商业交易

Object.defineProperty(window, '__CHROME_EXTENSION_FILLER__', {
    value: true, writable: false, configurable: false
});
// DYexb版权所有 - 严禁商业用途和付费交易