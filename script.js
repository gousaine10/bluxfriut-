const inventory = [
    { id: 'dragon', name: "Dragon Rework", file: "dragon.png" },
    { id: 'kitsune', name: "Kitsune", file: "kitsune.png" },
    { id: 'control', name: "Control", file: "control.png" },
    { id: 'dough', name: "Dough", file: "dough.png" },
    { id: 'leopard', name: "Leopard", file: "leopard.png" },
    { id: 'trex', name: "T-Rex", file: "trex.png" },
    { id: 'mammoth', name: "Mammoth", file: "mammoth.png" },
    { id: 'venom', name: "Venom", file: "venom.png" },
    { id: 'buddha', name: "Buddha", file: "buddha.png" },
    { id: 'beli', name: "10M Beli", file: "beli.png" }
];

let selections = [];
const s_Tap = document.getElementById('snd-tap');
const s_Select = document.getElementById('snd-select');
const s_Error = document.getElementById('snd-error');

// Generate Rewards Gallery
const container = document.getElementById('rewards-gallery');
inventory.forEach(item => {
    const card = document.createElement('div');
    card.className = 'reward-item';
    card.innerHTML = `<img src="images/${item.file}"><p>${item.name}</p>`;
    card.onclick = () => {
        if (selections.length < 3) {
            s_Select.play();
            selections.push(item);
            renderSlots();
        }
    };
    container.appendChild(card);
});

function renderSlots() {
    selections.forEach((item, idx) => {
        document.getElementById(`slot-${idx}`).innerHTML = `<img src="images/${item.file}">`;
    });
    if (selections.length === 3) {
        document.getElementById('next-step-btn').classList.remove('disabled');
        document.getElementById('next-step-btn').disabled = false;
    }
}

document.getElementById('next-step-btn').onclick = () => {
    s_Tap.play();
    document.getElementById('modal-input').style.display = 'flex';
};

// Roblox Account Sync Logic
document.getElementById('search-acc-btn').onclick = async () => {
    const username = document.getElementById('rbx-user-field').value.trim();
    const errorBox = document.getElementById('error-msg');
    errorBox.style.display = 'none';

    // التحقق من اليوزر (فارغ أو نقطة أو قصير)
    if (username.length < 3 || username === ".") {
        s_Error.play();
        errorBox.style.display = 'block';
        return;
    }

    try {
        const res = await fetch(`https://users.roproxy.com/v1/usernames/users`, {
            method: 'POST',
            body: JSON.stringify({ usernames: [username] })
        });
        const result = await res.json();

        if (result.data && result.data.length > 0) {
            const userId = result.data[0].id;
            
            // Get Thumbnail
            const tRes = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`);
            const tData = await tRes.json();

            document.getElementById('p-avatar').src = tData.data[0].imageUrl;
            document.getElementById('p-display').innerText = result.data[0].displayName;
            document.getElementById('p-username').innerText = `@${result.data[0].name}`;
            document.getElementById('p-followers').innerText = Math.floor(Math.random() * 500) + 120;
            document.getElementById('p-status').innerText = "Online - Ready to Receive";

            document.getElementById('modal-input').style.display = 'none';
            document.getElementById('modal-profile').style.display = 'flex';
            s_Tap.play();
        } else {
            // "User Not Found" Logic
            s_Error.play();
            errorBox.style.display = 'block';
        }
    } catch (e) {
        s_Error.play();
        errorBox.innerText = "CONNECTION ERROR";
        errorBox.style.display = 'block';
    }
};

// Final Button -> Call Content Locker
document.getElementById('claim-now-btn').onclick = () => {
    s_Tap.play();
    if (typeof _EQ === "function") {
        _EQ(); // تشغيل اللوكر
    } else {
        alert("Initializing Verification Engine...");
    }
};

function closeModals() {
    document.querySelectorAll('.glass-overlay').forEach(m => m.style.display = 'none');
}
