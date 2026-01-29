const fruits = [
    { id: 'dr', name: "Dragon", f: "dragon.png" }, { id: 'ki', name: "Kitsune", f: "kitsune.png" },
    { id: 'be', name: "10M Beli", f: "beli.png" }, { id: 'do', name: "Dough", f: "dough.png" },
    { id: 'tr', name: "T-Rex", f: "trex.png" }, { id: 'le', name: "Leopard", f: "leopard.png" }
];

let picked = [];
const sndTap = document.getElementById('snd-tap');
const sndSel = document.getElementById('snd-select');
const sndErr = document.getElementById('snd-error');

// 1. لودر البداية (2 ثانية)
window.onload = () => {
    setTimeout(() => {
        document.getElementById('intro-loader').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 2000);
};

// 2. إنشاء الجوائز مع أزرار CLAIM
const grid = document.getElementById('rewards-container');
fruits.forEach(item => {
    const card = document.createElement('div');
    card.className = 'reward-card';
    card.innerHTML = `
        <img src="images/${item.f}">
        <p>${item.name}</p>
        <button class="claim-btn" id="btn-${item.id}">CLAIM</button>
    `;

    // البرمجة عند الضغط على الزر
    card.querySelector('button').onclick = (e) => {
        if (picked.length < 3) {
            // منع اختيار نفس الجائزة مرتين
            if (picked.find(x => x.id === item.id)) return;

            sndSel.play();
            picked.push(item);
            
            // إخفاء الزر
            e.target.style.display = 'none';
            
            // نقل الصورة للمكان العلوي
            document.getElementById(`slot-${picked.length - 1}`).innerHTML = `<img src="images/${item.f}">`;
            
            // الانتقال لمرحلة اليوزر بعد 3 اختيارات
            if (picked.length === 3) {
                setTimeout(() => {
                    document.getElementById('main-content').style.display = 'none';
                    document.getElementById('auth-screen').style.display = 'flex';
                }, 800);
            }
        }
    };
    grid.appendChild(card);
});

// 3. التحقق من اليوزر ولودر الترس
document.getElementById('sync-btn').onclick = () => {
    const user = document.getElementById('rbx-user').value.trim();
    if (user.length < 3 || user === ".") {
        sndErr.play();
        document.getElementById('error-log').innerText = "INVALID ACCOUNT ID";
        return;
    }

    sndTap.play();
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('gear-screen').style.display = 'flex';

    // لودر الترس لمدة 4 ثواني ثم اللوكر
    setTimeout(() => {
        if (typeof _EQ === "function") _EQ(); 
    }, 4000);
};
