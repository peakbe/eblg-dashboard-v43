// ======================================================
// CONFIG — VERSION PRO+
// Endpoints, constantes, sonomètres, adresses
// ======================================================


// ------------------------------------------------------
// Logging PRO+
// ------------------------------------------------------
const IS_DEV = location.hostname.includes("localhost") || location.hostname.includes("127.0.0.1");
const log = (...a) => IS_DEV && console.log("[CONFIG]", ...a);


// ======================================================
// 1) ENDPOINTS API
// ======================================================
// Tous les modules PRO+ utilisent fetchJSON() avec fallback
// Ces URLs sont centralisées ici pour éviter les doublons
// ======================================================

export const PROXY = "https://proxy-eblg.onrender.com";

export const ENDPOINTS = {
    metar: `${PROXY}/metar`,
    taf:   `${PROXY}/taf`,
    fids:  `${PROXY}/fids`,
    sonos: `${PROXY}/sonos`
};

log("Endpoints configurés :", ENDPOINTS);


// ======================================================
// 2) SONOMÈTRES (coordonnées)
// ======================================================
// Structure utilisée par initSonometers() PRO+
// ======================================================

export const SONOS = [
    { id: "S01", lat: 50.64695, lon: 5.44340 },
    { id: "S02", lat: 50.65010, lon: 5.45020 },
    { id: "S03", lat: 50.64250, lon: 5.46010 },
    { id: "S04", lat: 50.63980, lon: 5.47000 },
    { id: "S05", lat: 50.65320, lon: 5.43050 }
];

log("Sonomètres chargés :", SONOS.length);


// ======================================================
// 3) Adresses sonomètres
// ======================================================
// Utilisé par showDetailPanel() PRO+
// ======================================================

export const SONO_ADDRESSES = {
    "S01": "Rue du Village 12, Grâce-Hollogne",
    "S02": "Rue des Prés 5, Grâce-Hollogne",
    "S03": "Rue du Fort 8, Awans",
    "S04": "Rue de la Station 22, Awans",
    "S05": "Rue du Bois 14, Grâce-Hollogne"
};

log("Adresses sonomètres chargées :", Object.keys(SONO_ADDRESSES).length);
