/**
 * Mythic Quest - Core Application Logic
 * Manages state, local storage persistence, leveling system, and UI updates.
 */

// --- RPG Mechanics & State Configuration ---
const STORAGE_KEYS = {
    AREAS: 'mythic_quest_areas',
    QUESTS: 'mythic_quest_quests',
    XP: 'mythic_quest_xp',
    LEVEL: 'mythic_quest_level'
};

let state = {
    areas: [],
    quests: [],
    xp: 0,
    level: 1,
    activeAreaFilter: null, // ID of currently focused area, or null for all
    activeStatusFilter: 'all' // 'all', 'active', 'completed'
};

// --- Custom Theme Map: Mythological Beings per Level (30 Levels) ---
const MYTHIC_BEINGS = [
    { 
        level: 1, 
        name: "Sátiro Travieso", 
        emoji: "🐐", 
        lore: "Habitantes salvajes de los bosques y compañeros de Dioniso. Tienen patas y cuernos de cabra, y son conocidos por su amor a la música, el baile, el vino y su tendencia a evadir todo tipo de responsabilidades. Tu viaje comienza con este espíritu inquieto pero lleno de energía potencial." 
    },
    { 
        level: 2, 
        name: "Arpía Fugaz", 
        emoji: "🦅", 
        lore: "Criaturas aladas con rostro de mujer y garras afiladas que encarnan los vientos de tormenta. Son veloces e impulsivas, pero carecen de constancia. Has ganado velocidad, aunque todavía necesitas ordenar tu fuerza interior." 
    },
    { 
        level: 3, 
        name: "Ninfa de los Bosques", 
        emoji: "🌱", 
        lore: "Divinidades menores vinculadas a árboles y manantiales sagrados. Cuidan de la vida silvestre y representan el florecimiento y el crecimiento orgánico. Tu sendero comienza a tomar raíces profundas en la disciplina cotidiana." 
    },
    { 
        level: 4, 
        name: "Sirena Cautivadora", 
        emoji: "🧜‍♀️", 
        lore: "Criaturas marinas mitad mujer y mitad pez (o ave). Atraen a los marineros con sus voces celestiales e hipnóticas. Tu nivel de enfoque e influencia personal se expanden, atrayendo mejores hábitos a tu rutina." 
    },
    { 
        level: 5, 
        name: "Centauro Errante", 
        emoji: "🏹", 
        lore: "Criaturas mitad hombre y mitad caballo que vagan por los montes de Tesalia. Famosos por su fuerza física, su destreza con el arco y su dualidad entre la barbarie y la sabiduría natural. Comienzas a equilibrar tu mente con tu cuerpo." 
    },
    { 
        level: 6, 
        name: "Hipocampo de las Mareas", 
        emoji: "🐴", 
        lore: "Los majestuosos corceles del dios Poseidón, con cuerpo de caballo y cola de pez. Nadas con gracia a través del mar agitado de tus emociones y logras avanzar con fluidez y elegancia ante los cambios." 
    },
    { 
        level: 7, 
        name: "Pegaso Alado", 
        emoji: "🐎", 
        lore: "El legendario caballo alado nacido de la sangre de Medusa y cabalgado por Belerofonte. Símbolo de la libertad absoluta y de la inspiración celestial. Te elevas por encima de los obstáculos mundanos y cotidianos." 
    },
    { 
        level: 8, 
        name: "Basilisco de Arena", 
        emoji: "🐍", 
        lore: "El rey de los reptiles, capaz de petrificar a sus enemigos con una sola mirada directa. Has desarrollado una concentración de mirada y un poder de enfoque inquebrantable; nada puede distraer tu atención del objetivo." 
    },
    { 
        level: 9, 
        name: "Cíclope Forjador", 
        emoji: "👁️", 
        lore: "Gigantes de un solo ojo que asisten al dios Hefesto en las profundidades del Monte Etna. Moldean metales divinos y crean el rayo de Zeus. Ahora tienes la disciplina y destreza necesarias para forjar tus propias metas." 
    },
    { 
        level: 10, 
        name: "Minotauro de Creta", 
        emoji: "🐂", 
        lore: "La bestia descomunal encerrada en el corazón del Laberinto de Dédalo. Posee una fuerza física arrolladora y una obstinación inquebrantable. Has conquistado tus laberintos mentales internos y dominas tus peores impulsos." 
    },
    { 
        level: 11, 
        name: "Quimera Ígnea", 
        emoji: "🦁", 
        lore: "Un temible ser híbrido con partes de león, cabra y serpiente que exhala llamaradas de fuego. Posees múltiples aptitudes y eres capaz de trabajar en varios frentes del desarrollo personal simultáneamente sin quemarte." 
    },
    { 
        level: 12, 
        name: "Esfinge Enigmática", 
        emoji: "🧩", 
        lore: "Guardiana con cuerpo de león y rostro de mujer que custodia las puertas de Tebas, devorando a quienes no resuelven sus acertijos. Tu agudeza mental, razonamiento lógico e inteligencia son armas formidables." 
    },
    { 
        level: 13, 
        name: "Grifo Guardián", 
        emoji: "🦅", 
        lore: "Criaturas con cuerpo de león y cabeza y alas de águila, consagradas a proteger los tesoros de Apolo y las minas de oro del norte. Mantienes una vigilancia extrema sobre los hábitos que valoras." 
    },
    { 
        level: 14, 
        name: "Hidra de Lerna", 
        emoji: "🐉", 
        lore: "El monstruo acuático de múltiples cabezas que habitaba el pantano de Lerna. Por cada cabeza cortada, le brotan dos nuevas. Tu resiliencia se vuelve absoluta: ante cada error o fracaso, resurges con el doble de fuerza." 
    },
    { 
        level: 15, 
        name: "Cerbero de las Sombras", 
        emoji: "🐕", 
        lore: "El sabueso de tres cabezas que vigila las puertas del Inframundo de Hades, asegurando que nadie escape. Representa el autocontrol absoluto y la vigilancia eterna sobre tu disciplina diario." 
    },
    { 
        level: 16, 
        name: "Fénix Resurgente", 
        emoji: "🔥", 
        lore: "El ave de fuego sagrada que, al final de su largo ciclo vital, arde en su nido para renacer triunfalmente de sus cenizas. Ya no temes a la adversidad ni al agotamiento; cada caída es solo una oportunidad para renacer." 
    },
    { 
        level: 17, 
        name: "Guerrero Mirmidón", 
        emoji: "⚔️", 
        lore: "Los legendarios soldados nacidos de las hormigas por el favor de Zeus, famosos por su lealtad absoluta y fiabilidad en batalla junto a Aquiles. Ejecutas tus misiones diarias con orden, frialdad militar y sin dudar." 
    },
    { 
        level: 18, 
        name: "Guerrera Amazona", 
        emoji: "🛡️", 
        lore: "Miembro de la tribu de temibles guerreras hijas de Ares. Conocidas por su valentía en batalla, su destreza con el arco y su independencia absoluta. Gobiernas tu vida con fuerza propia y estrategia impecable." 
    },
    { 
        level: 19, 
        name: "Cazador de Constelaciones", 
        emoji: "🏹", 
        lore: "Un rastreador estelar inspirado en el gigante Orión. Tus pasos ya no miran al suelo, sino al firmamento; tus metas se proyectan a largo plazo y buscas inscribir tu nombre en el destino." 
    },
    { 
        level: 20, 
        name: "Héroe Consagrado", 
        emoji: "🎖️", 
        lore: "Un mortal cuyas proezas físicas e integridad moral le han valido el favor directo de los dioses y cantos eternos de los poetas. Tu reputación contigo mismo se consolida; eres un verdadero héroe de tu propia vida." 
    },
    { 
        level: 21, 
        name: "Semidiós de la Lanza", 
        emoji: "⚡", 
        lore: "Hijo de un dios y un mortal. La sangre divina fluye por tus venas, otorgándote una fuerza superior a las leyes humanas y una voluntad capaz de mover montañas. Has cruzado el límite de lo ordinario." 
    },
    { 
        level: 22, 
        name: "Titán del Fuego (Prometeo)", 
        emoji: "🔥", 
        lore: "El titán protector de la humanidad que desafió a Zeus robando el fuego sagrado de la sabiduría para dárselo a los mortales. Has encendido en ti la llama del intelecto, el autoconocimiento y la compasión." 
    },
    { 
        level: 23, 
        name: "Titán Portador (Atlas)", 
        emoji: "🌍", 
        lore: "Condenado a sostener la pesada bóveda celeste sobre sus hombros por la eternidad. Posees una fuerza espiritual y una resistencia infinitas, capaces de cargar con enormes responsabilidades sin doblegarte." 
    },
    { 
        level: 24, 
        name: "Titán del Tiempo (Cronos)", 
        emoji: "⌛", 
        lore: "El soberano de la Edad de Oro que controla el curso y la fluidez del tiempo. Tienes un dominio total sobre tus horas, planificando tu rutina con precisión quirúrgica y haciendo que el tiempo trabaje para ti." 
    },
    { 
        level: 25, 
        name: "Heraldo del Olimpo (Hermes)", 
        emoji: "📯", 
        lore: "El mensajero de los dioses con sandalias aladas. Dios de la comunicación, los viajes y la agilidad mental. Posees la destreza para moverte velozmente entre tareas y resolver desafíos con ligereza y gracia celestial." 
    },
    { 
        level: 26, 
        name: "Señor de las Profundidades (Poseidón)", 
        emoji: "🔱", 
        lore: "El gobernante supremo de los océanos. Con tu tridente dominas las tempestades y calmas las aguas de tus emociones. Tienes el control absoluto sobre los mares de tus proyectos a gran escala." 
    },
    { 
        level: 27, 
        name: "Diosa del Inframundo (Perséfone)", 
        emoji: "🌾", 
        lore: "Reina de las sombras y causante del cambio de estaciones. Representa los ciclos de crecimiento, siembra y renovación en tu vida. Entiendes que cada meta tiene sus épocas de descanso y de cosecha." 
    },
    { 
        level: 28, 
        name: "Diosa de la Sabiduría (Atenea)", 
        emoji: "🦉", 
        lore: "Nacida armada de la cabeza de Zeus. Diosa de la guerra justa, la estrategia militar, la ciencia y la sabiduría práctica. Tus decisiones se basan en una lógica pura y planificas cada paso con maestría." 
    },
    { 
        level: 29, 
        name: "Rey del Trueno (Zeus)", 
        emoji: "⚡", 
        lore: "El gobernante absoluto del Olimpo y señor del rayo. Has alcanzado la cumbre de tu propia jerarquía interna, posees un poder de decisión incuestionable y tu voluntad inquebrantable gobierna tus acciones." 
    },
    { 
        level: 30, 
        name: "Deidad Suprema del Cosmos", 
        emoji: "👑", 
        lore: "Tu ascensión se ha completado por completo. Has superado los límites del Olimpo para fundirte con el propio universo. Eres una constelación inmortal e imperecedera grabada para siempre en el firmamento estelar." 
    }
];

// --- Helper Functions for RPG mechanics ---
// Level L requires: 50 * (L - 1) * L cumulative XP
function getXpForLevel(lvl) {
    if (lvl <= 1) return 0;
    return 50 * (lvl - 1) * lvl;
}

function getRankName(lvl) {
    const index = Math.min(Math.max(1, lvl), MYTHIC_BEINGS.length) - 1;
    return MYTHIC_BEINGS[index].name;
}

function getRankAvatar(lvl) {
    const index = Math.min(Math.max(1, lvl), MYTHIC_BEINGS.length) - 1;
    return MYTHIC_BEINGS[index].emoji;
}

// --- Local Storage Access ---
function loadState() {
    try {
        const storedAreas = localStorage.getItem(STORAGE_KEYS.AREAS);
        const storedQuests = localStorage.getItem(STORAGE_KEYS.QUESTS);
        const storedXp = localStorage.getItem(STORAGE_KEYS.XP);
        const storedLevel = localStorage.getItem(STORAGE_KEYS.LEVEL);

        if (storedAreas && storedQuests) {
            state.areas = JSON.parse(storedAreas);
            state.quests = JSON.parse(storedQuests);
            state.xp = parseInt(storedXp) || 0;
            state.level = parseInt(storedLevel) || 1;
        } else {
            // Load Demo Data
            loadDemoData();
        }
    } catch (e) {
        console.error("Error loading local storage state, using demo data:", e);
        loadDemoData();
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEYS.AREAS, JSON.stringify(state.areas));
        localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(state.quests));
        localStorage.setItem(STORAGE_KEYS.XP, state.xp.toString());
        localStorage.setItem(STORAGE_KEYS.LEVEL, state.level.toString());
    } catch (e) {
        console.error("Failed to save state to localStorage:", e);
    }
}

function loadDemoData() {
    state.areas = [
        { id: 'area-1', name: 'Sabiduría', deity: 'Atenea', icon: 'fa-book-open', progress: 50 },
        { id: 'area-2', name: 'Fuerza', deity: 'Hércules', icon: 'fa-dumbbell', progress: 0 },
        { id: 'area-3', name: 'Creatividad', deity: 'Apolo', icon: 'fa-feather', progress: 0 }
    ];

    state.quests = [
        { id: 'q-1', areaId: 'area-1', name: 'Leer 10 páginas de mitología clásica', difficulty: 'comun', completed: true },
        { id: 'q-2', areaId: 'area-1', name: 'Completar 1 lección de desarrollo web', difficulty: 'heroica', completed: false },
        { id: 'q-3', areaId: 'area-2', name: 'Hacer 30 flexiones de brazos', difficulty: 'comun', completed: false },
        { id: 'q-4', areaId: 'area-3', name: 'Escribir un poema corto o tocar un instrumento por 15m', difficulty: 'comun', completed: false },
        { id: 'q-5', areaId: 'area-3', name: 'Completar el lienzo principal de Mythic Quest', difficulty: 'legendaria', completed: false }
    ];

    state.xp = 50; // Demo starting XP
    state.level = 1;
    recalculateProgress();
    saveState();
}

// Recalculates area completion percentages based on current quests
function recalculateProgress() {
    state.areas.forEach(area => {
        const areaQuests = state.quests.filter(q => q.areaId === area.id);
        if (areaQuests.length === 0) {
            area.progress = 0;
        } else {
            const completed = areaQuests.filter(q => q.completed).length;
            area.progress = Math.round((completed / areaQuests.length) * 100);
        }
    });
}

// --- XP and Leveling Logic ---
function addXP(amount, eventX = null, eventY = null) {
    state.xp += amount;
    
    // Check level-up
    let currentLvl = state.level;
    let newLvl = currentLvl;
    
    while (state.xp >= getXpForLevel(newLvl + 1)) {
        newLvl++;
    }
    
    if (newLvl > currentLvl) {
        state.level = newLvl;
        triggerLevelUpOverlay(newLvl);
    } else {
        // Normal quest complete toast and particle burst
        showBlessingToast(`¡Bendición de los Dioses!`, `Has ganado +${amount} XP completando una misión.`);
        if (eventX && eventY && window.constellationSky) {
            window.constellationSky.triggerBurst(eventX, eventY, '#d4af37');
        }
    }
    
    saveState();
    updateUI();
}

// --- Modal Control Functions ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
}

// --- Notification Toast (God's Blessing) ---
let toastTimeout;
function showBlessingToast(title, message, iconClass = 'fa-sun') {
    const toast = document.getElementById('blessing-toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-message');

    if (!toast) return;

    toastIcon.className = `fa-solid ${iconClass}`;
    toastTitle.innerText = title;
    toastMsg.innerText = message;

    clearTimeout(toastTimeout);
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

// --- Level Up Banner Animation ---
function triggerLevelUpOverlay(newLvl) {
    const overlay = document.getElementById('levelup-overlay');
    const rankBadge = document.getElementById('levelup-new-rank');
    const msg = document.querySelector('.levelup-msg');
    
    const index = Math.min(newLvl, MYTHIC_BEINGS.length) - 1;
    const newBeing = MYTHIC_BEINGS[index];
    
    if (rankBadge) {
        rankBadge.innerText = `Nivel ${newLvl} - ${newBeing.name}`;
    }

    if (msg) {
        msg.innerHTML = `
            Los dioses del Olimpo celebran tus logros con agrado. Has ascendido y encarnado el espíritu sagrado de:
            <div style="font-size: 2.2rem; margin: 15px 0;">${newBeing.emoji} ${newBeing.name}</div>
            <p style="font-style: italic; color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                "${newBeing.lore.substring(0, 150)}..."
            </p>
        `;
    }

    if (overlay) {
        overlay.classList.add('show');
    }
    
    // Level up visual bursts
    if (window.constellationSky) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Trigger multiple bursts
        setTimeout(() => window.constellationSky.triggerBurst(w/2 - 100, h/2 - 50, '#d4af37'), 100);
        setTimeout(() => window.constellationSky.triggerBurst(w/2 + 100, h/2 - 50, '#00f2fe'), 300);
        setTimeout(() => window.constellationSky.triggerBurst(w/2, h/2 + 100, '#8a2be2'), 500);
    }
}

// --- UI Renderer Functions ---
function updateUI() {
    renderHeroProfile();
    renderAreas();
    renderQuests();
    populateAreaSelect();
    renderPantheon();
}

function renderHeroProfile() {
    const xpInfo = getLevelInfo(state.xp);
    
    document.getElementById('hero-level-badge').innerText = state.level;
    
    const rankName = getRankName(state.level);
    document.getElementById('hero-rank').innerText = rankName;
    document.getElementById('hero-avatar').innerText = getRankAvatar(state.level);
    
    const xpBar = document.getElementById('xp-bar');
    xpBar.style.width = `${xpInfo.percentage}%`;
    
    document.getElementById('xp-text').innerText = `${xpInfo.xpInCurrentLevel} / ${xpInfo.xpNeededForNextLevel} XP`;
}

function getLevelInfo(xp) {
    let lvl = 1;
    while (xp >= getXpForLevel(lvl + 1)) {
        lvl++;
    }
    const currentLevelMin = getXpForLevel(lvl);
    const nextLevelMin = getXpForLevel(lvl + 1);
    const xpInCurrentLevel = xp - currentLevelMin;
    const xpNeededForNextLevel = nextLevelMin - currentLevelMin;
    
    return {
        level: lvl,
        xpInCurrentLevel,
        xpNeededForNextLevel,
        percentage: (xpInCurrentLevel / xpNeededForNextLevel) * 100
    };
}

function renderAreas() {
    const list = document.getElementById('areas-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (state.areas.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-gavel"></i>
                <p>No tienes santuarios erigidos. ¡Comienza consagrando un área de tu vida!</p>
            </div>
        `;
        return;
    }
    
    state.areas.forEach(area => {
        const card = document.createElement('div');
        card.className = `area-card ${state.activeAreaFilter === area.id ? 'active' : ''}`;
        
        // Count quests in this area
        const total = state.quests.filter(q => q.areaId === area.id).length;
        const active = state.quests.filter(q => q.areaId === area.id && !q.completed).length;
        
        card.innerHTML = `
            <div class="area-actions">
                <button class="btn-card-action edit" onclick="event.stopPropagation(); editArea('${area.id}')" title="Reformar Santuario">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-card-action delete" onclick="event.stopPropagation(); deleteArea('${area.id}')" title="Derribar Santuario">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="area-info">
                <div class="area-icon-box">
                    <i class="fa-solid ${area.icon}"></i>
                </div>
                <div class="area-title-container">
                    <div class="area-name">${escapeHTML(area.name)}</div>
                    <div class="area-deity">Bajo el amparo de ${escapeHTML(area.deity)}</div>
                </div>
            </div>
            <div class="area-progress-section">
                <div class="area-progress-bar-container">
                    <div class="area-progress-bar" style="width: ${area.progress}%"></div>
                </div>
                <span class="area-progress-percentage">${area.progress}%</span>
            </div>
            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 5px; text-align: right;">
                ${active} activas de ${total} misiones
            </div>
        `;
        
        // Handle filter clicking
        card.addEventListener('click', () => {
            if (state.activeAreaFilter === area.id) {
                state.activeAreaFilter = null; // Unfilter
            } else {
                state.activeAreaFilter = area.id; // Filter
            }
            updateUI();
        });
        
        list.appendChild(card);
    });
}

function renderQuests() {
    const list = document.getElementById('quests-list');
    const title = document.getElementById('tablon-heading');
    if (!list) return;
    
    list.innerHTML = '';
    
    // Update toolbar title based on active filters
    let currentAreaName = "";
    if (state.activeAreaFilter) {
        const matchedArea = state.areas.find(a => a.id === state.activeAreaFilter);
        if (matchedArea) {
            currentAreaName = ` en ${matchedArea.name}`;
        }
    }
    
    title.innerText = `Misiones${currentAreaName}`;
    
    // Filter quests
    let filteredQuests = [...state.quests];
    
    // Apply Area Filter
    if (state.activeAreaFilter) {
        filteredQuests = filteredQuests.filter(q => q.areaId === state.activeAreaFilter);
    }
    
    // Apply Status Filter
    if (state.activeStatusFilter === 'active') {
        filteredQuests = filteredQuests.filter(q => !q.completed);
    } else if (state.activeStatusFilter === 'completed') {
        filteredQuests = filteredQuests.filter(q => q.completed);
    }
    
    if (filteredQuests.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-scroll"></i>
                <p>El tablón está despejado. No hay misiones que coincidan con estos criterios.</p>
            </div>
        `;
        return;
    }
    
    // Sort so uncompleted quests are on top
    filteredQuests.sort((a, b) => a.completed - b.completed);
    
    filteredQuests.forEach(quest => {
        const area = state.areas.find(a => a.id === quest.areaId);
        const areaName = area ? area.name : 'Desconocido';
        const areaIcon = area ? area.icon : 'fa-question';
        
        let difficultyLabel = "Común";
        let xpGained = 10;
        
        if (quest.difficulty === 'heroica') {
            difficultyLabel = "Heroica";
            xpGained = 50;
        } else if (quest.difficulty === 'legendaria') {
            difficultyLabel = "Legendaria";
            xpGained = 200;
        }
        
        const item = document.createElement('div');
        item.className = `quest-item ${quest.completed ? 'completed' : ''}`;
        
        item.innerHTML = `
            <div class="quest-checkbox-container">
                <input type="checkbox" class="quest-checkbox" ${quest.completed ? 'checked' : ''} 
                       onclick="toggleQuest('${quest.id}', event)">
                <i class="fa-solid fa-check quest-checkmark"></i>
            </div>
            <div class="quest-content">
                <div class="quest-name">${escapeHTML(quest.name)}</div>
                <div class="quest-meta">
                    <span class="quest-area-badge">
                        <i class="fa-solid ${areaIcon}"></i> ${escapeHTML(areaName)}
                    </span>
                    <span class="quest-difficulty rarity-${quest.difficulty}">
                        <i class="fa-solid fa-crown"></i> ${difficultyLabel}
                    </span>
                    <span class="quest-rewards">
                        <i class="fa-solid fa-star"></i> +${xpGained} XP
                    </span>
                </div>
            </div>
            <div class="quest-actions">
                <button class="btn-card-action edit" onclick="editQuest('${quest.id}')" title="Reformular Misión">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-card-action delete" onclick="deleteQuest('${quest.id}')" title="Abandonar Misión">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        
        list.appendChild(item);
    });
}

function renderPantheon() {
    const grid = document.getElementById('pantheon-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    MYTHIC_BEINGS.forEach(being => {
        const card = document.createElement('div');
        const isUnlocked = state.level >= being.level;
        
        if (isUnlocked) {
            card.className = 'pantheon-card unlocked';
            card.innerHTML = `
                <div class="pantheon-lock-badge"><i class="fa-solid fa-lock-open"></i></div>
                <div class="pantheon-card-level">Nivel ${being.level}</div>
                <div class="pantheon-emoji">${being.emoji}</div>
                <div class="pantheon-card-name">${escapeHTML(being.name)}</div>
                <div class="pantheon-card-lore">${escapeHTML(being.lore)}</div>
            `;
        } else {
            card.className = 'pantheon-card locked';
            card.innerHTML = `
                <div class="pantheon-lock-badge"><i class="fa-solid fa-lock"></i></div>
                <div class="pantheon-card-level">Nivel ${being.level}</div>
                <div class="pantheon-emoji">❓</div>
                <div class="pantheon-card-name">Bloqueado</div>
                <div class="pantheon-card-lore" style="text-align: center; border-top: none; padding-top: 0.2rem;">
                    Alcanza el nivel ${being.level} de divinidad para encarnar a este ser y conocer su historia.
                </div>
            `;
        }
        grid.appendChild(card);
    });
}

function populateAreaSelect() {
    const select = document.getElementById('quest-area');
    if (!select) return;
    
    select.innerHTML = '';
    
    if (state.areas.length === 0) {
        select.innerHTML = '<option value="">-- Primero consagra un Santuario --</option>';
        return;
    }
    
    state.areas.forEach(area => {
        const opt = document.createElement('option');
        opt.value = area.id;
        opt.textContent = `${area.name} (Bajo la bendición de ${area.deity})`;
        select.appendChild(opt);
    });
}

// --- CRUD Operations ---

// Areas
function handleAreaSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('area-id').value;
    const name = document.getElementById('area-name').value.trim();
    const deity = document.getElementById('area-deity').value.trim();
    const selectedIconOpt = document.querySelector('.icon-option.selected');
    const icon = selectedIconOpt ? selectedIconOpt.dataset.icon : 'fa-book-open';
    
    if (!name || !deity) return;
    
    if (id) {
        // Edit Mode
        const area = state.areas.find(a => a.id === id);
        if (area) {
            area.name = name;
            area.deity = deity;
            area.icon = icon;
            showBlessingToast("Santuario Reformado", `El santuario de ${name} ha sido modificado.`);
        }
    } else {
        // Create Mode
        const newArea = {
            id: 'area-' + Date.now(),
            name,
            deity,
            icon,
            progress: 0
        };
        state.areas.push(newArea);
        showBlessingToast("Santuario Consagrado", `Has erigido el santuario de ${name} en honor a ${deity}.`, 'fa-gavel');
    }
    
    saveState();
    recalculateProgress();
    updateUI();
    closeModal('area-modal');
}

window.editArea = function(id) {
    const area = state.areas.find(a => a.id === id);
    if (!area) return;
    
    document.getElementById('area-id').value = area.id;
    document.getElementById('area-name').value = area.name;
    document.getElementById('area-deity').value = area.deity;
    
    // Select correct icon
    document.querySelectorAll('.icon-option').forEach(opt => {
        if (opt.dataset.icon === area.icon) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    
    document.getElementById('area-modal-title').innerText = "Reformular Santuario";
    document.getElementById('area-submit-btn').innerText = "Reformar";
    openModal('area-modal');
};

window.deleteArea = function(id) {
    const area = state.areas.find(a => a.id === id);
    if (!area) return;
    
    const confirmDelete = confirm(`¿Estás seguro de que quieres derribar el santuario de "${area.name}"?\nTodas las misiones asociadas a este santuario serán destruidas para siempre.`);
    
    if (confirmDelete) {
        // Remove quests associated
        state.quests = state.quests.filter(q => q.areaId !== id);
        // Remove area
        state.areas = state.areas.filter(a => a.id !== id);
        
        if (state.activeAreaFilter === id) {
            state.activeAreaFilter = null;
        }
        
        saveState();
        recalculateProgress();
        updateUI();
        showBlessingToast("Santuario Derribado", `El templo de ${area.name} ha caído en ruinas.`, 'fa-trash');
    }
};

// Quests
function handleQuestSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('quest-id').value;
    const name = document.getElementById('quest-name').value.trim();
    const areaId = document.getElementById('quest-area').value;
    const difficulty = document.getElementById('quest-difficulty').value;
    
    if (!name || !areaId || !difficulty) return;
    
    if (id) {
        // Edit Mode
        const quest = state.quests.find(q => q.id === id);
        if (quest) {
            quest.name = name;
            quest.areaId = areaId;
            quest.difficulty = difficulty;
            showBlessingToast("Misión Reformulada", `La misión ha sido modificada.`);
        }
    } else {
        // Create Mode
        const newQuest = {
            id: 'q-' + Date.now(),
            areaId,
            name,
            difficulty,
            completed: false
        };
        state.quests.push(newQuest);
        showBlessingToast("Misión Decretada", `Se ha añadido la misión al tablón.`, 'fa-scroll');
    }
    
    saveState();
    recalculateProgress();
    updateUI();
    closeModal('quest-modal');
}

window.toggleQuest = function(id, event) {
    const quest = state.quests.find(q => q.id === id);
    if (!quest) return;
    
    quest.completed = !quest.completed;
    
    let xpAmount = 10;
    if (quest.difficulty === 'heroica') xpAmount = 50;
    if (quest.difficulty === 'legendaria') xpAmount = 200;
    
    recalculateProgress();
    
    if (quest.completed) {
        // Add XP
        addXP(xpAmount, event.clientX, event.clientY);
    } else {
        // Deduct XP (avoid negative)
        state.xp = Math.max(0, state.xp - xpAmount);
        
        // Adjust level down if necessary
        let newLvl = 1;
        while (state.xp >= getXpForLevel(newLvl + 1)) {
            newLvl++;
        }
        state.level = newLvl;
        
        showBlessingToast("Misión Reabierta", `Se han descontado ${xpAmount} XP de tu sendero.`, 'fa-clock-rotate-left');
        saveState();
        updateUI();
    }
};

window.editQuest = function(id) {
    const quest = state.quests.find(q => q.id === id);
    if (!quest) return;
    
    document.getElementById('quest-id').value = quest.id;
    document.getElementById('quest-name').value = quest.name;
    document.getElementById('quest-area').value = quest.areaId;
    document.getElementById('quest-difficulty').value = quest.difficulty;
    
    document.getElementById('quest-modal-title').innerText = "Reformular Misión";
    document.getElementById('quest-submit-btn').innerText = "Reformar Misión";
    openModal('quest-modal');
};

window.deleteQuest = function(id) {
    const quest = state.quests.find(q => q.id === id);
    if (!quest) return;
    
    const confirmDelete = confirm(`¿Estás seguro de que quieres abandonar la misión: "${quest.name}"?`);
    
    if (confirmDelete) {
        state.quests = state.quests.filter(q => q.id !== id);
        
        saveState();
        recalculateProgress();
        updateUI();
        showBlessingToast("Misión Abandonada", `Has retirado la misión del tablón.`, 'fa-trash');
    }
};

// --- DOM Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Load local state
    loadState();
    updateUI();
    
    // Set up modal listeners
    // Area Modal triggers
    document.getElementById('btn-add-area').addEventListener('click', () => {
        document.getElementById('area-form').reset();
        document.getElementById('area-id').value = '';
        document.getElementById('area-modal-title').innerText = "Erigir Santuario";
        document.getElementById('area-submit-btn').innerText = "Consagrar";
        
        // Reset selected icon
        document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
        const defaultIcon = document.querySelector('.icon-option[data-icon="fa-book-open"]');
        if (defaultIcon) defaultIcon.classList.add('selected');
        
        openModal('area-modal');
    });
    
    document.getElementById('area-modal-close').addEventListener('click', () => closeModal('area-modal'));
    document.getElementById('area-modal-cancel').addEventListener('click', () => closeModal('area-modal'));
    document.getElementById('area-form').addEventListener('submit', handleAreaSubmit);
    
    // Quest Modal triggers
    document.getElementById('btn-add-quest').addEventListener('click', () => {
        if (state.areas.length === 0) {
            alert('¡Debe erigir al menos un Santuario antes de decretar misiones!');
            return;
        }
        document.getElementById('quest-form').reset();
        document.getElementById('quest-id').value = '';
        document.getElementById('quest-modal-title').innerText = "Iniciar Nueva Misión";
        document.getElementById('quest-submit-btn').innerText = "Decretar Misión";
        
        // Pre-select current active area filter if any
        if (state.activeAreaFilter) {
            document.getElementById('quest-area').value = state.activeAreaFilter;
        }
        
        openModal('quest-modal');
    });
    
    document.getElementById('quest-modal-close').addEventListener('click', () => closeModal('quest-modal'));
    document.getElementById('quest-modal-cancel').addEventListener('click', () => closeModal('quest-modal'));
    document.getElementById('quest-form').addEventListener('submit', handleQuestSubmit);
    
    // Levelup claim button
    document.getElementById('btn-levelup-claim').addEventListener('click', () => {
        document.getElementById('levelup-overlay').classList.remove('show');
        showBlessingToast("Bendición Aceptada", "El Olimpo guía tus pasos hacia la grandeza.");
        updateUI();
    });
    
    // Icon selector clicking logic inside Area Modal
    document.querySelectorAll('.icon-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });
    
    // Quest Status filter chips triggers
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            state.activeStatusFilter = chip.dataset.filter;
            renderQuests();
        });
    });

    // Pestañas (Tabs) Navigation Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding tab
            const tabId = btn.dataset.tab;
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }

            // Render Pantheon if active
            if (tabId === 'tab-pantheon') {
                renderPantheon();
            }
        });
    });
});

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
