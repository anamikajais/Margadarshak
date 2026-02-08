let margdarshakData;

// Load JSON file
fetch("data/margdarshak_dummy_data.json")
  .then(response => response.json())
  .then(data => {
    margdarshakData = data;
    loadStates();
  })
  .catch(error => console.error("Error loading JSON:", error));

// Load states into dropdown
function loadStates() {
  const stateSelect = document.getElementById("stateSelect");
  margdarshakData.states.forEach(state => {
    let option = document.createElement("option");
    option.value = state.state;
    option.textContent = state.state;
    stateSelect.appendChild(option);
  });
}

// Load districts based on state
function loadDistricts() {
  const stateSelect = document.getElementById("stateSelect");
  const districtSelect = document.getElementById("districtSelect");

  districtSelect.innerHTML = '<option value="">-- Select District --</option>';

  const selectedState = margdarshakData.states.find(
    s => s.state === stateSelect.value
  );

  selectedState.districts.forEach(district => {
    let option = document.createElement("option");
    option.value = district.district;
    option.textContent = district.district;
    districtSelect.appendChild(option);
  });
}

// Show crop recommendation
function showCrops() {
  const stateSelect = document.getElementById("stateSelect");
  const districtSelect = document.getElementById("districtSelect");
  const output = document.getElementById("output");

  const state = margdarshakData.states.find(
    s => s.state === stateSelect.value
  );

  const district = state.districts.find(
    d => d.district === districtSelect.value
  );

  let html = `<h2 class="text-xl font-bold text-green-700">Recommended Crops</h2>`;

  district.recommended_crops.forEach(crop => {
    html += `
      <div class="mt-3 p-3 border rounded">
        <b>Crop:</b> ${crop.crop_name}<br>
        <b>Season:</b> ${crop.season}<br>
        <b>Sowing Time:</b> ${crop.sowing_time}<br>
        <b>Yield:</b> ${crop.avg_yield_kg_per_acre} kg/acre<br>
        <b>Fertilizer:</b> ${crop.fertilizer_advice}<br>
        <b>Scheme:</b> ${crop.government_scheme}<br>
        <b>Advisory:</b> ${crop.advisory.en}
      </div>
    `;
  });

  output.innerHTML = html;
}