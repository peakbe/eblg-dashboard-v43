import { SONOS, SONO_ADDRESSES } from "./config.js";
import { haversineDistance } from "./helpers.js";

export let sonometers = {};
export let heatLayer = null;

export function highlightSonometerInList(id) {
    const list = document.getElementById("sono-list");
    if (!list) return;

    list.querySelectorAll(".sono-item").forEach(el =>
        el.classList.remove("sono-highlight")
    );

    const item = [...list.children].find(el => el.textContent.trim() === id);
    if (item) {
        item.classList.add("sono-highlight");
        item.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

export function updateHeatmap(map) {
    if (heatLayer) map.removeLayer(heatLayer);

    const points = Object.values(sonometers).map(s => {
        let weight = 0.2;
        if (s.marker.options.color === "green") weight = 0.6;
        if (s.marker.options.color === "red") weight = 1.0;
        return [s.lat, s.lon, weight];
    });

    heatLayer = L.heatLayer(points, {
        radius: 35,
        blur: 25,
        maxZoom: 12,
        minOpacity: 0.3
    }).addTo(map);
}

export function showDetailPanel(id, runwayHeading) {
    const s = sonometers[id];
    if (!s) return;

    const panel = document.getElementById("detail-panel");
    const title = document.getElementById("detail-title");
    const address = document.getElementById("detail-address");
    const town = document.getElementById("detail-town");
    const status = document.getElementById("detail-status");
    const distance = document.getElementById("detail-distance");

    const fullAddress = SONO_ADDRESSES[id] || "Adresse inconnue";
    const townName = fullAddress.split(",")[1] || "—";

    const d = haversineDistance([s.lat, s.lon], runwayHeading).toFixed(2);

    title.textContent = id;
    address.textContent = fullAddress;
    town.textContent = townName.trim();
    status.textContent = s.marker.options.color.toUpperCase();
    distance.textContent = `${d} km`;

    panel.classList.remove("hidden");
}

export function initSonometers(map) {
    SONOS.forEach(s => {
        const marker = L.circleMarker([s.lat, s.lon], {
            radius: 6,
            color: "gray",
            fillColor: "gray",
            fillOpacity: 0.9,
            weight: 1
        }).addTo(map);

        const address = SONO_ADDRESSES[s.id] || "Adresse inconnue";

        marker.bindTooltip(s.id);

        marker.on("click", () => {
            marker.bindPopup(`<b>${s.id}</b><br>${address}`).openPopup();
            highlightSonometerInList(s.id);
            showDetailPanel(s.id, [50.64695, 5.44340]); // centre piste 22
        });

        sonometers[s.id] = { ...s, marker, status: "UNKNOWN" };
    });
}
