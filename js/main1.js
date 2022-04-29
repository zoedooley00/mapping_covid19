// initialize basemmap
mapboxgl.accessToken =
'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
zoom: 3, // starting zoom
center: [-100, 40] // starting center
});

// load data and add as layer
async function geojsonFetch() {
let response = await fetch('assets/covid_rates_2020_simplified.geojson');
let stateData = await response.json();

map.on('load', function loadingData() {
    map.addSource('covid_rates_2020_simplified', {
        type: 'geojson',
        data: stateData
    });

    map.addLayer({
        'id': 'covid_rates_2020_simplified-layer',
        'type': 'fill',
        'source': 'covid_rates_2020_simplified',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0',   // stop_output_0
                50,          // stop_input_0
                '#FED976',   // stop_output_1
                100,          // stop_input_1
                '#FEB24C',   // stop_output_2
                150,          // stop_input_2
                '#FD8D3C',   // stop_output_3
                200,         // stop_input_3
                '#FC4E2A',   // stop_output_4
                250,         // stop_input_4
                '#E31A1C',   // stop_output_5
                300,         // stop_input_5
                '#BD0026',   // stop_output_6
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });

    const layers = [
        '0-49',
        '50-99',
        '100-149',
        '150-199',
        '200-249',
        '250-299',
        '300 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670'
    ];

    // create legend
    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Covid-19 Rates<br>(cases/population)</b><br><br>";


    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });
});

map.on('mousemove', ({point}) => {
    const covid = map.queryRenderedFeatures(point, {
        layers: ['covid_rates_2020_simplified-layer']
    });
    document.getElementById('text-escription').innerHTML = covid.length ?
        `<h3>${covid[0].properties.county}</h3><p><strong><em>${covid[0].properties.rates}</strong> cases/population</em></p>` :
        `<p>Hover over a county!</p>`;
});
}

geojsonFetch();