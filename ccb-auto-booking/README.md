# OCR验证码识别服务

为Chrome扩展提供验证码识别API。

## 安装

```bash
cd ccb-auto-booking
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 启动

```bash
python ocr_server.py
```

服务地址: `http://127.0.0.1:9898`

## API

POST /ocr
```json
{"image": "base64图片数据"}
```

响应:
```json
{"success": true, "code": "识别结果"}
```
