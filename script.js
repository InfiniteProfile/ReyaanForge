/* ==========================================================================
   REYAAN — Infinite Identity Generator (Core Script)
   ================================================================          */

// Internal Component Data Pools for Dynamic Combinations
const USERNAME_PREFIXES = [
    "reyaan", "rx", "ry", "rey", "iam", "the", "real", "nova", "zen", "cyber",
    "midnight", "dark", "urban", "cosmic", "solitude", "minimal", "phantom", "neo"
];

const USERNAME_SUFFIXES = [
    "_", "_x", ".io", "hq", "archive", "labs", "core", "v2", "sys", "alt",
    "99", "01", "77", "studio", "zone", "protocol", "net", "omni"
];

const LOCATIONS = [
    "Tokyo, Japan", "Reykjavik, Iceland", "Kyoto, Japan", "Berlin, Germany",
    "London, UK", "New York, USA", "Zurich, Switzerland", "Stockholm, Sweden",
    "Seoul, South Korea", "Singapore", "Oslo, Norway", "Vancouver, Canada",
    "Melbourne, Australia", "Helsinki, Finland", "Copenhagen, Denmark", "Vienna, Austria"
];

const PERSONALITIES = [
    "Quiet strategist with an adventurous mind.",
    "Methodical thinker driven by design aesthetics.",
    "Introverted technologist seeking deep digital truths.",
    "Curious wanderer exploring modern minimalist paradigms.",
    "Calculated optimist focused on long-term systemic impact.",
    "Analytical creator balancing logic with profound artistic vision.",
    "Reserved observer fascinated by cosmic patterns and urban architecture.",
    "Passionate innovator building subtle digital experiences.",
    "Stoic realist with an eye for exceptional craftsmanship.",
    "Discreet night-owl analyzing high-frequency data structures."
];

const INTEREST_POOL = [
    "Photography", "Technology", "Astronomy", "Music", "Architecture",
    "Cybersecurity", "Minimalist Design", "Philosophy", "Generative Art",
    "Quantum Physics", "Urban Exploration", "Sound Design", "Cryptographic Systems",
    "Modernist Literature", "Cinematography", "Astrophotography", "Game Theory",
    "Analog Synthesizers", "Typography", "Alpenism", "Data Visualization"
];

const STYLES = [
    "Midnight Minimalism", "Quiet Luxury", "Dark Academia", "Urban Noir",
    "Cyber Noir", "Classic Modern", "Silver Future", "Golden Hour",
    "Deep Ocean", "Cosmic Minimalism", "Vintage Modern", "Street Minimal",
    "Modern Intellectual", "Brutalist Clean", "Monochrome Noir"
];

const VIBES = [
    "Calm • Mysterious • Intelligent",
    "Confident • Elegant • Reserved",
    "Creative • Adventurous • Focused",
    "Intelligent • Stoic • Analytical",
    "Social • Charismatic • Grounded",
    "Melancholic • Poetic • Observant",
    "Sharp • Minimal • Futuristic",
    "Relaxed • Visionary • Independent"
];

const BIO_TEMPLATES = [
    "Navigating the intersection of design, code, and silence.",
    "Building systems by day, chasing celestial photography by night.",
    "In pursuit of absolute clarity through minimalist structures.",
    "Obsessed with quiet spaces, clean code, and timeless architecture.",
    "Constantly deconstructing complex realities into simple frameworks.",
    "Living between Tokyo midnights and futuristic digital aesthetics.",
    "Finding profound meaning in minor design details and solitude.",
    "Exploring the universe one line of architecture and sound at a time.",
    "A quiet advocate for digital privacy and uncompromising aesthetics.",
    "Curating an intentional life with minimal friction and maximum focus."
];

// Application State
let generatedProfiles = [];
let favorites = JSON.parse(localStorage.getItem('reyaan_favorites')) || [];
let totalGeneratedCount = parseInt(localStorage.getItem('reyaan_total_count')) || 0;
let currentSessionHistory = new Set(); // Stores signature strings to ensure uniqueness
let isShowingFavoritesOnly = false;
let selectedBatchSize = 10;

// DOM Element References
const generateBtn = document.getElementById('generateBtn');
const firstGenerateBtn = document.getElementById('firstGenerateBtn');
const openBatchModalBtn = document.getElementById('openBatchModalBtn');
const toggleFavsBtn = document.getElementById('toggleFavsBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');

const totalCounterEl = document.getElementById('totalCounter');
const favCounterEl = document.getElementById('favCounter');
const favTabCountEl = document.getElementById('favTabCount');

const searchInput = document.getElementById('searchInput');
const filterStyle = document.getElementById('filterStyle');
const filterVibe = document.getElementById('filterVibe');
const filterLocation = document.getElementById('filterLocation');
const filterAge = document.getElementById('filterAge');

const profilesGrid = document.getElementById('profilesGrid');
const emptyState = document.getElementById('emptyState');

const batchModal = document.getElementById('batchModal');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmBatchBtn = document.getElementById('confirmBatchBtn');
const customBatchInput = document.getElementById('customBatchInput');
const batchChips = document.querySelectorAll('.batch-chip');

const exportModal = document.getElementById('exportModal');
const closeExportModalBtn = document.getElementById('closeExportModalBtn');
const exportFormatBtns = document.querySelectorAll('.export-format-btn');

const toastContainer = document.getElementById('toastContainer');

/* ==========================================================================
   Utility & Randomization Functions
   ================================================================          */
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInterests(count = 4) {
    const shuffled = [...INTEREST_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join(' • ');
}

function generateUniqueUsername() {
    let username = "";
    let attempts = 0;
    do {
        const p = getRandomItem(USERNAME_PREFIXES);
        const s = getRandomItem(USERNAME_SUFFIXES);
        const num = Math.random() > 0.4 ? getRandomInt(1, 999) : "";
        username = `@${p}${s}${num}`;
        attempts++;
        if (attempts > 50) break; // fallback safety
    } while (currentSessionHistory.has(username));
    return username;
}

/* ==========================================================================
   Profile Generation Engine
   ================================================================          */
function createProfileObject() {
    let profile;
    let signature;
    let loopGuard = 0;

    do {
        const username = generateUniqueUsername();
        const age = getRandomInt(20, 48);
        const location = getRandomItem(LOCATIONS);
        const personality = getRandomItem(PERSONALITIES);
        const interests = getRandomInterests(getRandomInt(3, 5));
        const style = getRandomItem(STYLES);
        const vibe = getRandomItem(VIBES);
        const bio = getRandomItem(BIO_TEMPLATES);

        signature = `${username}|${location}|${personality}|${style}|${vibe}`;

        profile = {
            id: ++totalGeneratedCount,
            name: "Reyaan",
            username: username,
            age: age,
            location: location,
            personality: personality,
            interests: interests,
            style: style,
            vibe: vibe,
            bio: bio,
            signature: signature
        };

        loopGuard++;
        if (loopGuard > 100) break; // prevent infinite lock if combinations saturate
    } while (currentSessionHistory.has(signature));

    currentSessionHistory.add(signature);
    return profile;
}

function generateProfiles(count = 1) {
    const newProfiles = [];
    for (let i = 0; i < count; i++) {
        newProfiles.unshift(createProfileObject()); // Add to top of array
    }
    
    generatedProfiles = [...newProfiles, ...generatedProfiles];
    localStorage.setItem('reyaan_total_count', totalGeneratedCount);
    
    updateFilterDropdownOptions();
    renderProfiles();
    updateCounters();
}

/* ==========================================================================
   Rendering Engine
   ================================================================          */
function renderProfiles() {
    const filtered = getFilteredProfiles();

    if (filtered.length === 0) {
        profilesGrid.innerHTML = '';
        emptyState.style.display = 'block';
        if (generatedProfiles.length > 0) {
            emptyState.querySelector('.empty-title').textContent = 'No matching profiles found.';
            emptyState.querySelector('button').style.display = 'none';
        } else {
            emptyState.querySelector('.empty-title').textContent = 'No identities generated yet.';
            emptyState.querySelector('button').style.display = 'inline-flex';
        }
        return;
    }

    emptyState.style.display = 'none';
    
    // Efficient DOM rendering mapping
    profilesGrid.innerHTML = filtered.map(profile => {
        const isFav = favorites.some(f => f.id === profile.id);
        const formattedId = String(profile.id).padStart(6, '0');

        return `
            <div class="profile-card" data-id="${profile.id}">
                <div class="card-header">
                    <span class="card-meta-id">PROFILE #${formattedId}</span>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${profile.id})" title="Favorite Profile">
                        ${isFav ? '★' : '☆'}
                    </button>
                </div>
                
                <div class="profile-main-info">
                    <h2 class="profile-name">${profile.name}</h2>
                    <div class="profile-username">${profile.username}</div>
                </div>

                <div class="profile-details">
                    <div class="detail-group">
                        <label>Age</label>
                        <span>${profile.age}</span>
                    </div>
                    <div class="detail-group">
                        <label>Location</label>
                        <span>${profile.location}</span>
                    </div>
                </div>

                <div class="profile-attributes">
                    <div class="attribute-row">
                        <span class="attribute-label">Personality</span>
                        <span class="attribute-value">${profile.personality}</span>
                    </div>
                    <div class="attribute-row">
                        <span class="attribute-label">Interests</span>
                        <span class="attribute-value">${profile.interests}</span>
                    </div>
                    <div class="attribute-row">
                        <span class="attribute-label">Style</span>
                        <span class="attribute-value">${profile.style}</span>
                    </div>
                    <div class="attribute-row">
                        <span class="attribute-label">Vibe</span>
                        <span class="attribute-value">${profile.vibe}</span>
                    </div>
                </div>

                <div class="profile-bio">
                    “${profile.bio}”
                </div>

                <div class="card-actions">
                    <button class="card-btn" onclick="copyProfileText(${profile.id})">Copy</button>
                    <button class="card-btn" onclick="copyField(${profile.id}, 'bio')">Copy Bio</button>
                    <button class="card-btn" onclick="copyField(${profile.id}, 'username')">Copy Username</button>
                    <button class="card-btn" onclick="saveSingleProfile(${profile.id})">Save</button>
                    <button class="card-btn" onclick="shareProfile(${profile.id})">Share</button>
                    <button class="card-btn delete-btn" onclick="deleteProfile(${profile.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

/* ==========================================================================
   Filtering & Search Logic
   ================================================================          */
function getFilteredProfiles() {
    let pool = isShowingFavoritesOnly ? favorites : generatedProfiles;
    
    const query = searchInput.value.toLowerCase().trim();
    const styleVal = filterStyle.value;
    const vibeVal = filterVibe.value;
    const locVal = filterLocation.value;
    const ageRange = filterAge.value;

    return pool.filter(p => {
        // Search query check across properties
        if (query) {
            const matchQuery = 
                p.name.toLowerCase().includes(query) ||
                p.username.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query) ||
                p.personality.toLowerCase().includes(query) ||
                p.interests.toLowerCase().includes(query) ||
                p.style.toLowerCase().includes(query) ||
                p.vibe.toLowerCase().includes(query) ||
                p.bio.toLowerCase().includes(query);
            if (!matchQuery) return false;
        }

        if (styleVal && p.style !== styleVal) return false;
        if (vibeVal && p.vibe !== vibeVal) return false;
        if (locVal && p.location !== locVal) return false;

        if (ageRange) {
            if (ageRange === '18-25' && (p.age < 18 || p.age > 25)) return false;
            if (ageRange === '26-35' && (p.age < 26 || p.age > 35)) return false;
            if (ageRange === '36-50' && (p.age < 36 || p.age > 50)) return false;
            if (ageRange === '51+' && p.age < 51) return false;
        }

        return true;
    });
}

function updateFilterDropdownOptions() {
    // Populate dropdown options dynamically based on active dataset
    const styles = [...new Set(generatedProfiles.map(p => p.style))].sort();
    const vibes = [...new Set(generatedProfiles.map(p => p.vibe))].sort();
    const locations = [...new Set(generatedProfiles.map(p => p.location))].sort();

    populateSelect(filterStyle, styles, "All Styles");
    populateSelect(filterVibe, vibes, "All Vibes");
    populateSelect(filterLocation, locations, "All Locations");
}

function populateSelect(selectEl, items, defaultLabel) {
    const currentVal = selectEl.value;
    selectEl.innerHTML = `<option value="">${defaultLabel}</option>` + 
        items.map(item => `<option value="${item}" ${item === currentVal ? 'selected' : ''}>${item}</option>`).join('');
}

/* ==========================================================================
   Action Handlers & Interactivity
   ================================================================          */
function updateCounters() {
    totalCounterEl.textContent = String(totalGeneratedCount).padStart(6, '0');
    favCounterEl.textContent = String(favorites.length).padStart(3, '0');
    favTabCountEl.textContent = favorites.length;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Card Action Operations
window.toggleFavorite = function(id) {
    const profile = generatedProfiles.find(p => p.id === id) || favorites.find(f => f.id === id);
    if (!profile) return;

    const index = favorites.findIndex(f => f.id === id);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Removed from favorites.');
    } else {
        favorites.push(profile);
        showToast('Added to favorites!');
    }

    localStorage.setItem('reyaan_favorites', JSON.stringify(favorites));
    updateCounters();
    renderProfiles();
};

window.copyProfileText = function(id) {
    const p = generatedProfiles.find(item => item.id === id) || favorites.find(item => item.id === id);
    if (!p) return;

    const text = `PROFILE #${String(p.id).padStart(6, '0')}
Name: ${p.name}
Username: ${p.username}
Age: ${p.age}
Location: ${p.location}
Personality: ${p.personality}
Interests: ${p.interests}
Style: ${p.style}
Vibe: ${p.vibe}
Bio: "${p.bio}"`;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Complete profile copied to clipboard!');
    });
};

window.copyField = function(id, field) {
    const p = generatedProfiles.find(item => item.id === id) || favorites.find(item => item.id === id);
    if (!p) return;

    const val = p[field];
    navigator.clipboard.writeText(val).then(() => {
        showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} copied!`);
    });
};

window.saveSingleProfile = function(id) {
    const p = generatedProfiles.find(item => item.id === id) || favorites.find(item => item.id === id);
    if (!p) return;

    const text = JSON.stringify(p, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reyaan_profile_${p.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Profile downloaded locally.');
};

window.shareProfile = function(id) {
    const p = generatedProfiles.find(item => item.id === id) || favorites.find(item => item.id === id);
    if (!p) return;

    if (navigator.share) {
        navigator.share({
            title: `Reyaan Identity - ${p.username}`,
            text: `Check out this Reyaan profile (${p.location}) - "${p.bio}"`,
            url: window.location.href
        }).catch(() => {});
    } else {
        copyProfileText(id);
    }
};

window.deleteProfile = function(id) {
    generatedProfiles = generatedProfiles.filter(p => p.id !== id);
    renderProfiles();
    showToast('Profile removed from current view.');
};

/* ==========================================================================
   Global Controls & Modals
   ================================================================ ----------*/
generateBtn.addEventListener('click', () => generateProfiles(1));
firstGenerateBtn.addEventListener('click', () => generateProfiles(1));

// Batch Modal Handling
openBatchModalBtn.addEventListener('click', () => {
    batchModal.style.display = 'flex';
});

cancelModalBtn.addEventListener('click', () => {
    batchModal.style.display = 'none';
});

batchChips.forEach(chip => {
    chip.addEventListener('click', () => {
        batchChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedBatchSize = parseInt(chip.getAttribute('data-value'));
        customBatchInput.value = '';
    });
});

confirmBatchBtn.addEventListener('click', () => {
    let amount = selectedBatchSize;
    const customVal = parseInt(customBatchInput.value);
    if (!isNaN(customVal) && customVal > 0) {
        amount = customVal;
    }
    batchModal.style.display = 'none';
    
    // Efficient execution for large generation batches
    setTimeout(() => {
        generateProfiles(amount);
        showToast(`Successfully generated ${amount.toLocaleString()} identities!`);
    }, 50);
});

// Favorites Toggle Tab
toggleFavsBtn.addEventListener('click', () => {
    isShowingFavoritesOnly = !isShowingFavoritesOnly;
    if (isShowingFavoritesOnly) {
        toggleFavsBtn.style.borderColor = '#f59e0b';
        toggleFavsBtn.style.color = '#f59e0b';
        toggleFavsBtn.textContent = `★ Showing Favorites (${favorites.length})`;
    } else {
        toggleFavsBtn.style.borderColor = '';
        toggleFavsBtn.style.color = '';
        toggleFavsBtn.textContent = `★ View Favorites (${favorites.length})`;
    }
    renderProfiles();
});

// Export Modal Handling
exportBtn.addEventListener('click', () => {
    if (generatedProfiles.length === 0) {
        showToast('No profiles available to export.');
        return;
    }
    exportModal.style.display = 'flex';
});

closeExportModalBtn.addEventListener('click', () => {
    exportModal.style.display = 'none';
});

exportFormatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const format = btn.getAttribute('data-format');
        executeExport(format);
        exportModal.style.display = 'none';
    });
});

function executeExport(format) {
    const dataset = isShowingFavoritesOnly ? favorites : generatedProfiles;
    if (dataset.length === 0) return;

    let content = "";
    let filename = `reyaan_profiles_${Date.now()}`;
    let mime = "text/plain";

    if (format === 'json') {
        content = JSON.stringify(dataset, null, 2);
        filename += '.json';
        mime = 'application/json';
    } else if (format === 'csv') {
        mime = 'text/csv';
        filename += '.csv';
        const headers = ['ID', 'Name', 'Username', 'Age', 'Location', 'Personality', 'Interests', 'Style', 'Vibe', 'Bio'];
        const rows = dataset.map(p => [
            p.id, `"${p.name}"`, `"${p.username}"`, p.age, `"${p.location}"`, 
            `"${p.personality}"`, `"${p.interests}"`, `"${p.style}"`, `"${p.vibe}"`, `"${p.bio}"`
        ]);
        content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
        // TXT Format
        filename += '.txt';
        content = dataset.map(p => `[ID: ${p.id}] Name: ${p.name} | Username: ${p.username} | Age: ${p.age} | Location: ${p.location} | Style: ${p.style} | Vibe: ${p.vibe} | Bio: "${p.bio}"`).join('\n\n');
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${dataset.length} profiles as .${format.toUpperCase()}`);
}

// Reset Session Logic
resetBtn.addEventListener('click', () => {
    if (confirm("Reset current session? This will clear active profiles and counters. Favorites will remain safe unless cleared separately.")) {
        generatedProfiles = [];
        currentSessionHistory.clear();
        totalGeneratedCount = 0;
        localStorage.removeItem('reyaan_total_count');
        isShowingFavoritesOnly = false;
        toggleFavsBtn.textContent = `★ View Favorites (${favorites.length})`;
        toggleFavsBtn.style.borderColor = '';
        toggleFavsBtn.style.color = '';
        
        updateFilterDropdownOptions();
        renderProfiles();
        updateCounters();
        showToast('Session has been reset.');
    }
});

// Event Listeners for Real-time Search and Filters
searchInput.addEventListener('input', renderProfiles);
filterStyle.addEventListener('change', renderProfiles);
filterVibe.addEventListener('change', renderProfiles);
filterLocation.addEventListener('change', renderProfiles);
filterAge.addEventListener('change', renderProfiles);

// Initial App Boot
updateCounters();
renderProfiles();
