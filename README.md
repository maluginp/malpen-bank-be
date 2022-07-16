Malpen Bank in processing


###

Генерация самоподписанного серта

```
openssl req -nodes -x509 -newkey rsa:4096 -keyout private_key.pem -out public_cert.pem -sha256 -days 365
```