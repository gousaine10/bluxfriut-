// قائمة الجوائز بناءً على أسماء صورك
const inventory = [
    { id: 'dr', name: "Dragon", p: "dragon.png" }, { id: 'ki', name: "Kitsune", p: "kitsune.png" },
    { id: 'be', name: "10M Beli", p: "beli.png" }, { id: 'do', name: "Dough", p: "dough.png" },
    { id: 'tr', name: "T-Rex", p: "trex.png" }, { id: 'le', name: "Leopard", p: "leopard.png" }
];

let picked = [];
const sndTap = document.getElementById('snd-tap');
const sndSel = document.getElementById('snd-select');
const sndErr = document.getElementById('snd-error');

// 1. لودر البداية (2 ثانية)
window.onload = () => {
    setTimeout(() => {
        document.getElementById('intro-loader').style.display = 'none';
        document.getElementById('selection-stage').style.display = 'block';
    }, 2000);
};

// 2. بناء شبكة الجوائز
const grid = document.getElementById('grid');
inventory.forEach(item => {
    const card = document.createElement('div');
    card.className = 'reward-item';
    card.innerHTML = `<img src="images/${item.p}"><p>${item.name}</p><button class="claim-btn">CLAIM</button>`;
    
    card.querySelector('button').onclick = (e) => {
        // منع التكرار الصامت
        if (picked.find(x => x.id === item.id) || picked.length >= 3) return;

        sndSel.play();
        picked.push(item);
        e.target.style.display = 'none'; // إخفاء الزر
        
        // الانتقال للفتحة العلوية
        document.getElementById(`slot-${picked.length - 1}`).innerHTML = `<img src="images/${item.p}" style="width:85%">`;

        if (picked.length === 3) {
            setTimeout(() => {
                document.getElementById('selection-stage').style.display = 'none';
                document.getElementById('sync-stage').style.display = 'flex';
            }, 800);
        }
    };
    grid.appendChild(card);
});

// 3. التحقق من اليوزر
document.getElementById('sync-btn').onclick = () => {
    const user = document.getElementById('rbx-user').value.trim();
    if (user.length < 3 || user === ".") {
        sndErr.play();
        document.getElementById('error-box').innerText = "INVALID ACCOUNT ID";
        return;
    }
    sndTap.play();
    document.getElementById('sync-stage').style.display = 'none';
    document.getElementById('final-stage').style.display = 'flex';
};

// 4. تشغيل اللوكر عند ضغط الزر الأخضر
document.getElementById('captcha-btn').onclick = () => {
    sndTap.play();
    if (typeof _EQ === "function") _EQ(); 
};
