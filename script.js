const rewards = [
    { id: 'dr', name: "Dragon Rework", file: "dragon.png" },
    { id: 'ki', name: "Kitsune", file: "kitsune.png" },
    { id: 'do', name: "Dough", file: "dough.png" },
    { id: 'le', name: "Leopard", file: "leopard.png" },
    { id: 'tr', name: "T-Rex", file: "trex.png" },
    { id: 'be', name: "10M Beli", file: "beli.png" }
];

let myChoices = [];
const s_tap = document.getElementById('snd-tap');
const s_sel = document.getElementById('snd-select');
const s_err = document.getElementById('snd-error');

// إنشاء المعرض
const grid = document.getElementById('grid');
rewards.forEach(item => {
    const card = document.createElement('div');
    card.className = 'reward-card';
    card.innerHTML = `<img src="images/${item.file}"><p>${item.name}</p>`;
    card.onclick = () => {
        // التحقق من عدم التكرار
        if (myChoices.some(c => c.id === item.id)) {
            s_err.play();
            return alert("You already selected this unique reward!");
        }

        if (myChoices.length < 3) {
            s_sel.play();
            myChoices.push(item);
            drawSlots();
        }
    };
    grid.appendChild(card);
});

function drawSlots() {
    myChoices.forEach((c, i) => {
        document.getElementById(`slot-${i}`).innerHTML = `<img src="images/${c.file}">`;
    });
    if (myChoices.length === 3) {
        document.getElementById('init-btn').disabled = false;
        document.getElementById('init-btn').classList.remove('disabled');
    }
}

document.getElementById('init-btn').onclick = () => { s_tap.play(); document.getElementById('modal-auth').style.display = 'flex'; };

// التحقق من اليوزر
document.getElementById('sync-btn').onclick = async () => {
    const user = document.getElementById('rbx-user').value.trim();
    const errBox = document.getElementById('err-text');
    errBox.style.display = 'none';

    // منع النقاط واليوزرات القصيرة
    if (user.length < 3 || user === ".") {
        s_err.play();
        errBox.style.display = 'block';
        return;
    }

    try {
        const res = await fetch(`https://users.roproxy.com/v1/usernames/users`, {
            method: 'POST',
            body: JSON.stringify({ usernames: [user] })
        });
        const d = await res.json();

        if (d.data && d.data.length > 0) {
            const uid = d.data[0].id;
            const tRes = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${uid}&size=150x150&format=Png`);
            const tD = await tRes.json();
            
            document.getElementById('avatar-img').src = tD.data[0].imageUrl;
            document.getElementById('disp-name').innerText = d.data[0].displayName;
            document.getElementById('f-count').innerText = Math.floor(Math.random() * 300) + 50;
            
            document.getElementById('modal-auth').style.display = 'none';
            document.getElementById('modal-profile').style.display = 'flex';
            s_tap.play();
        } else {
            s_err.play();
            errBox.style.display = 'block';
        }
    } catch (e) { s_err.play(); errBox.innerText = "API CONNECTION ERROR"; errBox.style.display = 'block'; }
};

// تشغيل الـ Content Locker
document.getElementById('final-claim').onclick = () => {
    s_tap.play();
    if (typeof _EQ === "function") {
        _EQ(); // اللوكر الشفاف
    }
};

function closeAuth() { document.getElementById('modal-auth').style.display = 'none'; }
