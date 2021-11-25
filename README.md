# Dokumentasi API
untuk dokumentasi api postman bisa didaptkan di folder collections

# Menjalankan server
untuk menjalankan bisa dilakukan dengan 2 cara:
1. dengan server lokal bisa dilakukan dengan mejalankan applikasi secara langsung dengan menggunakan perintah ```node index.js```
2. dengan menggunakan kubernetes dengan cara mejalankan perintah:
    - kubectl apply -f mongodb-deployment.yaml
    - kubectl apply -f nodejs-deployment.yaml

# Flow Diagram API
1. user harus register terlebih dahulu
2. setelah telah register maka harus login terlebih dahulu untuk mendapatkan token
3. Token ini yang akan digunakan untuk mengakses API
