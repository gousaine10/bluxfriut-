const fruits = [
    { name: "Dragon", file: "dragon.png" }, { name: "Kitsune", file: "kitsune.png" },
    { name: "Control", file: "control.png" }, { name: "Rumble", file: "rumble.png" },
    { name: "Buddha", file: "buddha.png" }, { name: "Venom", file: "venom.png" },
    { name: "T-Rex", file: "trex.png" }, { name: "Mammoth", file: "mammoth.png" },
    { name: "Dough", file: "dough.png" }, { name: "Leopard", file: "leopard.png" },
    { name: "10M Beli", file: "beli.png" }
];

let selected = 0;
const sndTap = document.getElementById('snd-tap');
const sndSelect = document.getElementById('snd-select');
const sndError = document.getElementById('snd-error');

// Generate Gallery
const gallery = document.getElementById('fruit-gallery');
fruits.forEach(f => {
    const item = document.createElement('div');
    item.className = 'fruit-item';
    item.innerHTML = `<img src="images/${f.file}"><p>${f.name}</p><button class="btn-green">CLAIM</button>`;
    item.onclick = () => {
        if (selected < 3) {
            sndSelect.play();
            document.getElementById(`slot-${selected}`).innerHTML = `<img src="images/${f.file}">`;
            selected++;
            if (selected === 3) {
                document.getElementById('continue-btn').disabled = false;
                document.getElementById('continue-btn').classList.remove('disabled');
            }
        }
    };
    gallery.appendChild(item);
});

// Sound for all buttons
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') sndTap.play();
});

// Modal Actions
document.getElementById('continue-btn').onclick = () => document.getElementById('modal-username').style.display = 'flex';
document.getElementById('cancel-btn').onclick = () => document.getElementById('modal-username').style.display = 'none';

// Roblox API Search
document.getElementById('search-btn').onclick = async () => {
    const user = document.getElementById('username-input').value;
    if (user.length < 3) {
        sndError.play();
        return alert("Username too short!");
    }

    try {
        // Fetch User ID
        const res = await fetch(`https://users.roproxy.com/v1/usernames/users`, {
            method: 'POST',
            body: JSON.stringify({ usernames: [user], "excludeBannedUsers": true })
        });
        const data = await res.json();

        if (data.data.length > 0) {
            const userId = data.data[0].id;
            
            // Fetch Avatar
            const thumbRes = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`);
            const thumbData = await thumbRes.json();

            // Fetch Presence (Activity)
            const presRes = await fetch(`https://presence.roproxy.com/v1/presence/users`, {
                method: 'POST',
                body: JSON.stringify({ userIds: [userId] })
            });
            const presData = await presRes.json();
            const lastActivity = presData.userPresences[0].lastLocation || "Offline / Hidden";

            // Update UI
            document.getElementById('user-avatar').src = thumbData.data[0].imageUrl;
            document.getElementById('user-name').innerText = data.data[0].displayName;
            document.getElementById('user-activity').innerText = `Current Activity: ${lastActivity}`;
            
            document.getElementById('modal-username').style.display = 'none';
            document.getElementById('modal-profile').style.display = 'flex';
        } else {
            sndError.play();
            alert("User not found!");
        }
    } catch (e) {
        sndError.play();
        alert("Error connecting to Roblox Servers.");
    }
};

// Final Button -> Redirect to CPA Link
document.getElementById('final-btn').onclick = () => {
    window.location.href = "YOUR_CPA_LINK_HERE";
};
