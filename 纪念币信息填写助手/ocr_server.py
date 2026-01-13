#!/usr/bin/env python3
"""
验证码识别服务 - 使用 ddddocr
运行方式: python ocr_server.py
依赖安装: pip install ddddocr flask flask-cors
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import ddddocr
import base64

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 初始化 OCR
ocr = ddddocr.DdddOcr(show_ad=False)

@app.route('/ocr', methods=['POST'])
def recognize():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': '缺少image参数'}), 400
        
        # 解码 base64 图片
        image_data = base64.b64decode(data['image'])
        
        # OCR 识别
        result = ocr.classification(image_data)
        
        print(f'识别结果: {result}')
        return jsonify({'text': result, 'success': True})
    
    except Exception as e:
        print(f'识别错误: {e}')
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print('=' * 50)
    print('验证码识别服务已启动')
    print('地址: http://127.0.0.1:9898')
    print('按 Ctrl+C 停止服务')
    print('=' * 50)
    app.run(host='127.0.0.1', port=9898, debug=False)

