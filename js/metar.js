// ======================================================
// METAR
// ======================================================

import { ENDPOINTS } from "./config.js";
import { fetchJSON, updateStatusPanel } from "./helpers.js";
import { getRunwayFromWind } from "./runways.js";
import { updateHeatmap } from "./sonometers.js";
import { drawRunway, drawCorridor } from "./runways.js";
import { RUNWAYS, computeCrosswind, updateRunwayPanel } from "./runways.js";
import { updateHeatmapDynamic } from "./sonometers.js";

/**
 * Charge le METAR depuis le proxy.
 */
export async function loadMetar() {
    const data = await fetchJSON(ENDPOINTS.metar);
    updateMetarUI(data);
    updateStatusPanel("METAR", data);
}

/**
 * Met à jour l’UI METAR + piste + heatmap.
 */
export function updateMetarUI(data) {
    const el = document.getElementById("metar");
    if (!el) return;

    if (!data || !data.raw) {
        el.innerText = "METAR indisponible";
        drawRunway("UNKNOWN", window.runwayLayer);
        drawCorridor("UNKNOWN", window.corridorLayer);
        return;
    }

    el.innerText = data.raw;

    const windDir = data.wind_direction?.value;
    const windSpeed = data.wind_speed?.value;

    const runway = getRunwayFromWind(windDir);
    const { crosswind } = computeCrosswind(windDir, windSpeed, RUNWAYS[runway]?.heading);
    updateRunwayPanel(runway, windDir, windSpeed, crosswind);


    // 1) Dessin piste + corridor
    drawRunway(runway, window.runwayLayer);
    drawCorridor(runway, window.corridorLayer);

    // 2) Mise à jour heatmap après stabilisation du rendu
    requestAnimationFrame(() => {
        updateHeatmapDynamic(window.map, windDir, windSpeed, RUNWAYS[runway]?.heading);

    });
}
