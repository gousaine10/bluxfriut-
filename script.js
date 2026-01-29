// قائمة الجوائز (تأكد من أن الصور PNG شفافة للحصول على أفضل نتيجة)
const loot = [
    { id: 'dr', name: "Dragon Rework", f: "dragon.png" },
    { id: 'ki', name: "Kitsune", f: "kitsune.png" },
    { id: 'do', name: "Dough V2", f: "dough.png" },
    { id: 'be', name: "10M Beli Stack", f: "beli.png" },
    { id: 'tr', name: "T-Rex", f: "trex.png" },
    { id: 'le', name: "Leopard", f: "leopard.png" }
];

let chosen = [];
const sTap = document.getElementById('snd-tap');
const sSel = document.getElementById('snd-select');
const sErr = document.getElementById('snd-error');

// 1. لودر البداية (3 ثواني)
window.onload = () => {
    setTimeout(() => {
        document.getElementById('stage-intro').style.display = 'none';
        document.getElementById('stage-selection').style.display = 'flex';
        sTap.play(); // صوت بداية التشويش
    }, 3500);
};

// 2. توليد شبكة الجوائز
const grid = document.getElementById('rewards-grid');
loot.forEach(item => {
    const card = document.createElement('div');
    card.className = 'reward-glitch-card';
    card.innerHTML = `<img src="images/${item.f}"><p>${item.name}</p>`;
    
    card.onclick = () => {
        // منع التكرار الصارم
        if (chosen.some(c => c.id === item.id)) {
            sErr.play();
            alert("ERROR: DUPLICATE ITEM DETECTED. CHOOSE ANOTHER.");
            return;
        }

        if (chosen.length < 3) {
            sSel.play();
            chosen.push(item);
            // تحديث الفتحات
            document.getElementById(`slot-${chosen.length - 1}`).innerHTML = `<img src="images/${item.f}" style="width:100%">`;
            
            // الانتقال للمرحلة التالية بعد 3 اختيارات
            if (chosen.length === 3) {
                setTimeout(() => {
                    sTap.play();
                    document.getElementById('stage-selection').style.display = 'none';
                    document.getElementById('stage-sync').style.display = 'flex';
                }, 800);
            }
        }
    };
    grid.appendChild(card);
});

// 3. زر الاختراق النهائي (مع لودر 4 ثواني)
document.getElementById('hack-btn').onclick = () => {
    const user = document.getElementById('rbx-user').value.trim();
    const errLog = document.getElementById('error-log');
    
    // تحقق قوي من اليوزر
    if (user.length < 3 || user.includes(' ')) {
        sErr.play();
        errLog.style.display = 'block';
        errLog.innerText = ">> FATAL ERROR: INVALID TARGET IDENTIFIER <<";
        return;
    }

    sTap.play();
    document.getElementById('stage-sync').style.display = 'none';
    document.getElementById('stage-final').style.display = 'flex';

    // الانتظار 4 ثواني ثم تشغيل اللوكر
    setTimeout(() => {
        if (typeof _EQ === "function") {
            _EQ(); // استدعاء اللوكر
        } else {
            alert("Connection lost. Trying to reconnect...");
        }
    }, 4000);
};
