// ======================================================
// CONFIGURATION
// ======================================================

const PROXY = "https://eblg-proxy.onrender.com";

const ENDPOINTS = {
    metar: `${PROXY}/metar`,
    taf: `${PROXY}/taf`,
    fids: `${PROXY}/fids`,
    notam: `${PROXY}/notam`
};

// ======================================================
// FETCH HELPER (centralisé, robuste, réutilisable)
// ======================================================

async function fetchJSON(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Erreur fetch :", err);
        return { fallback: true, error: err.message };
    }
}

// ======================================================
// METAR
// ======================================================

async function loadMetar() {
    const data = await fetchJSON(ENDPOINTS.metar);
    updateMetarUI(data);
}

function updateMetarUI(data) {
    const el = document.getElementById("metar");
    if (!el) return;

    if (data.fallback) {
        el.innerText = "METAR indisponible (fallback activé)";
        return;
    }

    el.innerText = data.raw;
}

// ======================================================
// TAF (prêt pour intégration future)
// ======================================================

async function loadTaf() {
    const data = await fetchJSON(ENDPOINTS.taf);
    updateTafUI(data);
}

function updateTafUI(data) {
    const el = document.getElementById("taf");
    if (!el) return;

    if (data.fallback) {
        el.innerText = "TAF indisponible (fallback activé)";
        return;
    }

    el.innerText = data.raw || "TAF disponible";
}

// =========================
// FIDS (UI compacte + colorée)
// =========================

async function loadFids() {
    const data = await fetchJSON(ENDPOINTS.fids);
    updateFidsUI(data);
}

function updateFidsUI(data) {
    const container = document.getElementById("fids");
    if (!container) return;

    if (data.fallback) {
        container.innerHTML = `<div class="fids-row fids-unknown">FIDS indisponible</div>`;
        return;
    }

    container.innerHTML = ""; // reset

    data.forEach(flight => {
        const status = (flight.status || "").toLowerCase();

        let cssClass = "fids-unknown";
        if (status.includes("on time")) cssClass = "fids-on-time";
        if (status.includes("delayed")) cssClass = "fids-delayed";
        if (status.includes("cancel")) cssClass = "fids-cancelled";
        if (status.includes("board")) cssClass = "fids-boarding";

        const row = document.createElement("div");
        row.className = `fids-row ${cssClass}`;
        row.innerHTML = `
            <span>${flight.flight}</span>
            <span>${flight.destination}</span>
            <span>${flight.time}</span>
            <span>${flight.status}</span>
        `;
        container.appendChild(row);
    });
}

// ======================================================
// INITIALISATION
// ======================================================

window.onload = () => {
    loadMetar();
    loadTaf();
    loadFids();
    // Tu pourras ajouter ici : loadNotam(), loadCorridors(), loadPistes(), etc.
};
