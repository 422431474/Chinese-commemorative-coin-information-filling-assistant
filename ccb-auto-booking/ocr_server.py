# -*- coding: utf-8 -*-
"""
本地OCR服务器
为Chrome扩展提供验证码识别API
"""

import base64
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import ddddocr


class OCRHandler(BaseHTTPRequestHandler):
    ocr = ddddocr.DdddOcr(show_ad=False)
    
    def do_OPTIONS(self):
        """处理CORS预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """处理OCR识别请求"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # 获取base64图片数据
            image_base64 = data.get('image', '')
            if not image_base64:
                self._send_error('缺少image参数')
                return
            
            # 解码base64
            image_bytes = base64.b64decode(image_base64)
            
            # OCR识别
            code = self.ocr.classification(image_bytes)
            code = code.strip().replace(' ', '')
            
            print(f'[OCR] 识别结果: {code}')
            
            # 返回结果
            self._send_response({'success': True, 'code': code})
            
        except Exception as e:
            print(f'[OCR] 错误: {e}')
            self._send_error(str(e))
    
    def _send_response(self, data):
        """发送JSON响应"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def _send_error(self, message):
        """发送错误响应"""
        self.send_response(400)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'success': False, 'error': message}).encode('utf-8'))
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        print(f'[OCR Server] {args[0]}')


def main():
    port = 9898
    server = HTTPServer(('127.0.0.1', port), OCRHandler)
    print(f'='*50)
    print(f'验证码OCR服务已启动')
    print(f'地址: http://127.0.0.1:{port}')
    print(f'='*50)
    print(f'Chrome扩展将自动调用此服务识别验证码')
    print(f'按 Ctrl+C 停止服务')
    print()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n[OCR Server] 服务已停止')
        server.shutdown()


if __name__ == '__main__':
    main()
