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