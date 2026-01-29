const rewards = [
    { id: 'dr', name: "Dragon", f: "dragon.png" }, { id: 'ki', name: "Kitsune", f: "kitsune.png" },
    { id: 'be', name: "10M Beli", f: "beli.png" }, { id: 'do', name: "Dough", f: "dough.png" },
    { id: 'tr', name: "T-Rex", f: "trex.png" }, { id: 'le', name: "Leopard", f: "leopard.png" }
];

let selectedCount = 0;
const pickedIds = new Set();
const s_tap = document.getElementById('snd-tap');
const s_sel = document.getElementById('snd-select');
const s_err = document.getElementById('snd-error');

// 1. لودر البداية (2 ثانية)
window.onload = () => {
    setTimeout(() => {
        document.getElementById('intro-loader').style.display = 'none';
        document.getElementById('selection-screen').style.display = 'block';
    }, 2000);
};

// 2. بناء الشبكة (بدون تكرار، زر يختفي)
const grid = document.getElementById('rewards-grid');
rewards.forEach(item => {
    const card = document.createElement('div');
    card.className = 'reward-item';
    card.innerHTML = `
        <img src="images/${item.f}">
        <p>${item.name}</p>
        <button class="claim-btn" id="claim-${item.id}">CLAIM</button>
    `;

    const btn = card.querySelector('button');
    btn.onclick = () => {
        if (pickedIds.has(item.id) || selectedCount >= 3) return;

        s_sel.play();
        pickedIds.add(item.id);
        btn.style.visibility = 'hidden'; // إخفاء الزر
        
        document.getElementById(`slot-${selectedCount}`).innerHTML = `<img src="images/${item.f}" style="width:85%">`;
        selectedCount++;

        if (selectedCount === 3) {
            setTimeout(() => {
                document.getElementById('selection-screen').style.display = 'none';
                document.getElementById('sync-screen').style.display = 'flex';
            }, 800);
        }
    };
    grid.appendChild(card);
});

// 3. الانتقال من اليوزر إلى التحقق النهائي (بدون مؤقت)
document.getElementById('sync-btn').onclick = () => {
    const user = document.getElementById('rbx-user').value.trim();
    if (user.length < 3 || user === ".") {
        s_err.play();
        document.getElementById('error-msg').innerText = "INVALID ACCOUNT IDENTIFIER";
        return;
    }

    s_tap.play();
    document.getElementById('sync-screen').style.display = 'none';
    // إظهار شاشة التحقق النهائي الجديدة بدلاً من الترس
    document.getElementById('final-check-screen').style.display = 'flex';
};

// ================= جديد: تشغيل اللوكر عند ضغط الزر الأخضر =================
document.getElementById('robot-btn').onclick = () => {
    s_tap.play(); // تشغيل صوت النقر
    
    // هنا يتم استدعاء اللوكر
    if (typeof _EQ === "function") {
        _EQ(); 
    } else {
        // احتياطي في حال لم يحمل السكريبت
        console.log("Content Locker triggering...");
    }
};
