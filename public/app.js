/**
 * Margadarshak - App logic: crop recommendations, financials, rainfall profile
 * Depends on crop-data.js (REAL_CROP_AREA, REAL_RAINFALL, CROP_DICT, districts)
 */

(function () {
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  /**
   * Get crop recommendations from district, soil, acres, budget.
   * Uses REAL_CROP_AREA + CROP_DICT; computes totalCost, estimatedEarnings, profit, season.
   */
  function getCropRecommendations(districtValue, soilType, acres, budget) {
    const districtKey = typeof getDistrictKey === 'function' ? getDistrictKey(districtValue) : (districtValue || '').toLowerCase().replace(/\s+/g, '_');
    const areaScores = REAL_CROP_AREA && REAL_CROP_AREA[districtKey];
    if (!CROP_DICT || CROP_DICT.length === 0) return [];

    const results = [];
    for (const crop of CROP_DICT) {
      if (!crop.soils || !crop.soils.includes(soilType)) continue;

      const districtScore = (areaScores && areaScores[crop.name]) ? areaScores[crop.name] : 50;
      const totalCost = crop.costPerAcre * acres;
      const yieldKg = crop.yieldPerAcre * acres;
      const quintals = yieldKg / 100;
      const estimatedEarnings = quintals * crop.marketPricePerQuintal;
      const profit = estimatedEarnings - totalCost;
      const withinBudget = totalCost <= budget;

      results.push({
        crop,
        districtScore,
        totalCost,
        yieldKg,
        estimatedEarnings,
        profit,
        withinBudget,
        season: crop.season,
        seasonHi: crop.seasonHi || crop.season,
        sowingMonths: crop.sowingMonths || ''
      });
    }

    // Sort by district success then by profit
    results.sort((a, b) => {
      if (b.districtScore !== a.districtScore) return b.districtScore - a.districtScore;
      return b.profit - a.profit;
    });

    return results;
  }

  /**
   * Get rainfall profile for a district (monthly mm). Returns array of { month, mm }.
   */
  function getRainfallProfile(districtValue) {
    const districtKey = typeof getDistrictKey === 'function' ? getDistrictKey(districtValue) : (districtValue || '').toLowerCase().replace(/\s+/g, '_');
    const monthly = REAL_RAINFALL && REAL_RAINFALL[districtKey];
    if (!monthly || monthly.length !== 12) return MONTH_NAMES.map((m, i) => ({ month: m, mm: 0 }));
    return MONTH_NAMES.map((month, i) => ({ month, mm: monthly[i] || 0 }));
  }

  /**
   * Get top rainfall months for sowing advice (e.g. "Highest rainfall: Jul, Aug, Sep").
   */
  function getTopRainfallMonths(districtValue, count) {
    const profile = getRainfallProfile(districtValue);
    const sorted = [...profile].sort((a, b) => b.mm - a.mm);
    return sorted.slice(0, count || 3).map(x => x.month);
  }

  function getCropIcon(cropName) {
    const icons = { 'Rice': '🌾', 'Maize': '🌽', 'Wheat': '🌾', 'Pulses': '🫘', 'Oilseeds': '🥜' };
    return icons[cropName] || '🌱';
  }

  // Expose to window for index.html
  window.MargadarshakApp = {
    getCropRecommendations,
    getRainfallProfile,
    getTopRainfallMonths,
    getCropIcon,
    MONTH_NAMES
  };
})();
