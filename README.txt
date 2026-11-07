ROZANA HISAAB - ANDROID APP
===========================

TAREEQA 1: Android Studio (PC par)
----------------------------------
1. Yeh zip extract karein.
2. Android Studio kholein > File > Open > "RozanaHisaab" folder chunein.
3. Pehli dafa Gradle sync hoga (internet chahiye, 5-10 minute lag sakte hain).
4. Menu: Build > Build App Bundle(s) / APK(s) > Build APK(s)
5. Neeche "locate" par click karein. APK yahan milegi:
   app/build/outputs/apk/debug/app-debug.apk
6. Yeh APK WhatsApp/USB se phone par bhejein aur install karein
   ("Unknown sources" ki ijazat dena paregi).

TAREEQA 2: GitHub (Android Studio ke baghair)
---------------------------------------------
1. github.com par naya repository banayein.
2. Is folder ki saari files upload karein (.github folder samait).
3. Repository mein "Actions" tab kholein. "Build APK" khud chalega (5-8 minute).
4. Run mukammal hone par neeche "Artifacts" mein "RozanaHisaab-APK" download karein.
   Zip ke andar APK hogi.

LINK BADALNA HO TO
------------------
app/src/main/java/com/rozana/hisaab/MainActivity.java mein APP_URL badlein.

FEATURES
--------
- App ka naam aur icon: Rozana Hisaab
- Data (localStorage) phone mein mehfooz rehta hai
- File upload, download, pull-to-refresh
- Back button pichle page par le jata hai
- Internet na ho to Urdu/Roman message aur "Dobara koshish" button
- WhatsApp / phone / email links apni apps mein khulte hain
