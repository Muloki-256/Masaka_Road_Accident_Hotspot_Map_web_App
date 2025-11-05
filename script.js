// script.js - Road Accident Hotspot Map Application
// Web-Based GIS for Community Safety Analysis - Masaka City Focus

// Global variables
let map;
let accidentData = {};
let accidentMarkers;
let heatmapLayer;
let geocoder;
let currentLocationMarker;
let isHeatmapVisible = true;
let isMarkersVisible = true;
let searchResults = [];

// Current filters
let currentFilters = {
    severity: 'all',
    type: 'all',
    time: 'all',
    roadType: 'all'
};

// Fallback data for Masaka City (30 accidents)
const fallbackData = {
    "type": "FeatureCollection",
    "metadata": {
        "title": "Road Accident Data - Masaka City, Uganda",
        "created": "2024-03-30",
        "source": "Sample Data for GIS Project",
        "total_accidents": 30,
        "period": "January - March 2024"
    },
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": 1,
                "location": "Masaka-Kampala Highway, Near Masaka Taxi Park",
                "severity": "fatal",
                "type": "head-on",
                "date": "2024-01-08",
                "time": "07:45",
                "time_of_day": "morning",
                "vehicles_involved": 2,
                "casualties": 3,
                "fatalities": 2,
                "injuries": 1,
                "description": "Head-on collision between bus and private car during morning rush",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "highway"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7340, -0.3334]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 2,
                "location": "Masaka-Mbarara Road, Nyendo Trading Centre",
                "severity": "serious",
                "type": "rear-end",
                "date": "2024-01-12",
                "time": "14:20",
                "time_of_day": "afternoon",
                "vehicles_involved": 3,
                "casualties": 2,
                "fatalities": 0,
                "injuries": 2,
                "description": "Multiple vehicle collision near Nyendo market area",
                "weather": "rainy",
                "road_condition": "wet",
                "road_type": "highway"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7135, -0.3389]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 3,
                "location": "Masaka Town Central, Near Clock Tower",
                "severity": "minor",
                "type": "pedestrian",
                "date": "2024-01-18",
                "time": "17:30",
                "time_of_day": "evening",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 0,
                "injuries": 1,
                "description": "Pedestrian hit while crossing at busy clock tower intersection",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7352, -0.3356]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 4,
                "location": "Katwe-Butego Road, Near Katwe Landing Site",
                "severity": "fatal",
                "type": "single-vehicle",
                "date": "2024-01-25",
                "time": "21:15",
                "time_of_day": "night",
                "vehicles_involved": 1,
                "casualties": 2,
                "fatalities": 1,
                "injuries": 1,
                "description": "Motorcycle accident on sharp bend near Lake Victoria",
                "weather": "clear",
                "road_condition": "poor",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7208, -0.3157]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 5,
                "location": "Masaka-Bukakata Road, Kijjabwemi Area",
                "severity": "serious",
                "type": "head-on",
                "date": "2024-02-03",
                "time": "08:30",
                "time_of_day": "morning",
                "vehicles_involved": 2,
                "casualties": 4,
                "fatalities": 0,
                "injuries": 4,
                "description": "Taxi and boda boda head-on collision near Kijjabwemi",
                "weather": "foggy",
                "road_condition": "fair",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7289, -0.3256]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 6,
                "location": "Nyendo-Ssaza Road, Near Masaka Regional Hospital",
                "severity": "minor",
                "type": "rear-end",
                "date": "2024-02-10",
                "time": "16:45",
                "time_of_day": "afternoon",
                "vehicles_involved": 2,
                "casualties": 0,
                "fatalities": 0,
                "injuries": 0,
                "description": "Minor collision near hospital entrance",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7301, -0.3412]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 7,
                "location": "Masaka-Kyotera Road, Near Villa Maria",
                "severity": "fatal",
                "type": "pedestrian",
                "date": "2024-02-17",
                "time": "19:45",
                "time_of_day": "evening",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 1,
                "injuries": 0,
                "description": "Pedestrian accident near Villa Maria trading centre",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "highway"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7456, -0.3289]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 8,
                "location": "Bishop's Senior School Road, Nyendo",
                "severity": "serious",
                "type": "single-vehicle",
                "date": "2024-02-24",
                "time": "22:30",
                "time_of_day": "night",
                "vehicles_involved": 1,
                "casualties": 3,
                "fatalities": 0,
                "injuries": 3,
                "description": "Car accident with serious injuries near school area",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7167, -0.3367]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 9,
                "location": "Masaka Main Market Entrance",
                "severity": "minor",
                "type": "rear-end",
                "date": "2024-03-02",
                "time": "10:15",
                "time_of_day": "morning",
                "vehicles_involved": 2,
                "casualties": 0,
                "fatalities": 0,
                "injuries": 0,
                "description": "Low-speed collision at market entrance during busy hours",
                "weather": "clear",
                "road_condition": "crowded",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7368, -0.3345]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 10,
                "location": "Masaka-Kyabakuza Road",
                "severity": "fatal",
                "type": "head-on",
                "date": "2024-03-08",
                "time": "13:45",
                "time_of_day": "afternoon",
                "vehicles_involved": 2,
                "casualties": 2,
                "fatalities": 2,
                "injuries": 0,
                "description": "Head-on collision on Kyabakuza road",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7267, -0.3198]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 11,
                "location": "Katwe Road, Near Katwe Primary School",
                "severity": "serious",
                "type": "pedestrian",
                "date": "2024-01-10",
                "time": "16:20",
                "time_of_day": "afternoon",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 0,
                "injuries": 1,
                "description": "Student hit near school during dismissal time",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7223, -0.3124]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 12,
                "location": "Nyendo Roundabout",
                "severity": "minor",
                "type": "rear-end",
                "date": "2024-01-15",
                "time": "08:45",
                "time_of_day": "morning",
                "vehicles_involved": 3,
                "casualties": 0,
                "fatalities": 0,
                "injuries": 0,
                "description": "Multiple vehicle minor collisions at busy roundabout",
                "weather": "rainy",
                "road_condition": "wet",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7145, -0.3378]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 13,
                "location": "Kijjabwemi-Kkingo Road",
                "severity": "fatal",
                "type": "single-vehicle",
                "date": "2024-01-20",
                "time": "20:15",
                "time_of_day": "evening",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 1,
                "injuries": 0,
                "description": "Motorcycle accident on rural road",
                "weather": "clear",
                "road_condition": "poor",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7321, -0.3223]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 14,
                "location": "Masaka-Bukoto Road, Near Kasijjagirwa",
                "severity": "serious",
                "type": "head-on",
                "date": "2024-01-28",
                "time": "15:30",
                "time_of_day": "afternoon",
                "vehicles_involved": 2,
                "casualties": 3,
                "fatalities": 0,
                "injuries": 3,
                "description": "Truck and taxi collision near Kasijjagirwa",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "highway"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7412, -0.3298]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 15,
                "location": "Masaka Town, Near Centenary Park",
                "severity": "minor",
                "type": "pedestrian",
                "date": "2024-02-05",
                "time": "18:45",
                "time_of_day": "evening",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 0,
                "injuries": 1,
                "description": "Pedestrian minor injury near recreational area",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7389, -0.3321]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 16,
                "location": "Masaka-Kabonera Road",
                "severity": "fatal",
                "type": "rollover",
                "date": "2024-02-12",
                "time": "11:30",
                "time_of_day": "morning",
                "vehicles_involved": 1,
                "casualties": 2,
                "fatalities": 1,
                "injuries": 1,
                "description": "Truck rollover on Kabonera road",
                "weather": "clear",
                "road_condition": "fair",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7198, -0.3489]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 17,
                "location": "Nyendo-Kkungu Road",
                "severity": "serious",
                "type": "side-swipe",
                "date": "2024-02-18",
                "time": "14:15",
                "time_of_day": "afternoon",
                "vehicles_involved": 2,
                "casualties": 2,
                "fatalities": 0,
                "injuries": 2,
                "description": "Side-swipe collision on narrow road",
                "weather": "rainy",
                "road_condition": "wet",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7089, -0.3421]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 18,
                "location": "Masaka-Bugabira Road",
                "severity": "minor",
                "type": "rear-end",
                "date": "2024-02-22",
                "time": "17:50",
                "time_of_day": "evening",
                "vehicles_involved": 2,
                "casualties": 0,
                "fatalities": 0,
                "injuries": 0,
                "description": "Minor rear-end collision in traffic",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7432, -0.3267]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 19,
                "location": "Katwe-Misanvu Road",
                "severity": "fatal",
                "type": "single-vehicle",
                "date": "2024-03-01",
                "time": "22:45",
                "time_of_day": "night",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 1,
                "injuries": 0,
                "description": "Motorcycle accident on dark road",
                "weather": "clear",
                "road_condition": "poor",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7256, -0.3089]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 20,
                "location": "Masaka-Kkingo Road",
                "severity": "serious",
                "type": "head-on",
                "date": "2024-03-07",
                "time": "09:20",
                "time_of_day": "morning",
                "vehicles_involved": 2,
                "casualties": 3,
                "fatalities": 0,
                "injuries": 3,
                "description": "Head-on collision on Kkingo road during fog",
                "weather": "foggy",
                "road_condition": "fair",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7334, -0.3187]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 21,
                "location": "Nyendo Market Access Road",
                "severity": "minor",
                "type": "pedestrian",
                "date": "2024-03-12",
                "time": "12:30",
                "time_of_day": "afternoon",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 0,
                "injuries": 1,
                "description": "Pedestrian accident in market area",
                "weather": "clear",
                "road_condition": "crowded",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7123, -0.3398]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 22,
                "location": "Masaka-Kyanamukaaka Road",
                "severity": "fatal",
                "type": "rollover",
                "date": "2024-03-15",
                "time": "16:40",
                "time_of_day": "afternoon",
                "vehicles_involved": 1,
                "casualties": 2,
                "fatalities": 1,
                "injuries": 1,
                "description": "Car rollover on sharp bend",
                "weather": "rainy",
                "road_condition": "wet",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7489, -0.3356]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 23,
                "location": "Kijjabwemi-Kabonera Junction",
                "severity": "serious",
                "type": "side-swipe",
                "date": "2024-03-18",
                "time": "19:15",
                "time_of_day": "evening",
                "vehicles_involved": 2,
                "casualties": 2,
                "fatalities": 0,
                "injuries": 2,
                "description": "Side-swipe at busy junction",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7278, -0.3312]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 24,
                "location": "Masaka-Katosi Road",
                "severity": "minor",
                "type": "rear-end",
                "date": "2024-03-20",
                "time": "08:10",
                "time_of_day": "morning",
                "vehicles_involved": 2,
                "casualties": 0,
                "fatalities": 0,
                "injuries": 0,
                "description": "Minor collision during morning rush",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "highway"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7523, -0.3245]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 25,
                "location": "Nyendo-Bukulula Road",
                "severity": "fatal",
                "type": "single-vehicle",
                "date": "2024-03-22",
                "time": "23:20",
                "time_of_day": "night",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 1,
                "injuries": 0,
                "description": "Motorcycle accident on unlit road",
                "weather": "clear",
                "road_condition": "poor",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7056, -0.3456]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 26,
                "location": "Masaka-Kabowa Road",
                "severity": "serious",
                "type": "head-on",
                "date": "2024-03-25",
                "time": "13:45",
                "time_of_day": "afternoon",
                "vehicles_involved": 2,
                "casualties": 3,
                "fatalities": 0,
                "injuries": 3,
                "description": "Head-on collision on Kabowa road",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7398, -0.3198]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 27,
                "location": "Katwe-Kkungu Road",
                "severity": "minor",
                "type": "pedestrian",
                "date": "2024-03-26",
                "time": "17:30",
                "time_of_day": "evening",
                "vehicles_involved": 1,
                "casualties": 1,
                "fatalities": 0,
                "injuries": 1,
                "description": "Pedestrian accident near residential area",
                "weather": "clear",
                "road_condition": "good",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7189, -0.3176]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 28,
                "location": "Masaka-Kiwangala Road",
                "severity": "fatal",
                "type": "rollover",
                "date": "2024-03-28",
                "time": "10:20",
                "time_of_day": "morning",
                "vehicles_involved": 1,
                "casualties": 2,
                "fatalities": 1,
                "injuries": 1,
                "description": "Truck rollover on Kiwangala road",
                "weather": "rainy",
                "road_condition": "wet",
                "road_type": "rural"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7556, -0.3298]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 29,
                "location": "Nyendo-Misanvu Road",
                "severity": "serious",
                "type": "side-swipe",
                "date": "2024-03-29",
                "time": "15:10",
                "time_of_day": "afternoon",
                "vehicles_involved": 2,
                "casualties": 2,
                "fatalities": 0,
                "injuries": 2,
                "description": "Side-swipe collision on narrow road",
                "weather": "clear",
                "road_condition": "fair",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7098, -0.3321]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": 30,
                "location": "Masaka Town, Near Bus Park",
                "severity": "minor",
                "type": "rear-end",
                "date": "2024-03-30",
                "time": "18:20",
                "time_of_day": "evening",
                "vehicles_involved": 2,
                "casualties": 0,
                "fatalities": 0,
                "injuries": 0,
                "description": "Minor collision near bus park during peak hours",
                "weather": "clear",
                "road_condition": "crowded",
                "road_type": "urban"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [31.7376, -0.3342]
            }
        }
    ]
};

// Severity color mapping
const severityColors = {
    'fatal': '#e74c3c',
    'serious': '#f39c12', 
    'minor': '#3498db'
};

// Accident type icons
const accidentTypeIcons = {
    'head-on': '🚗💥🚗',
    'rear-end': '🚗⬅️🚗',
    'pedestrian': '🚶‍♂️💥🚗',
    'single-vehicle': '🚗💥',
    'side-swipe': '🚗↔️🚗',
    'rollover': '🔄🚗'
};

// Time of day categories
const timeCategories = {
    'morning': '🌅 Morning (6AM-12PM)',
    'afternoon': '☀️ Afternoon (12PM-6PM)',
    'evening': '🌆 Evening (6PM-12AM)',
    'night': '🌙 Night (12AM-6AM)'
};

// Initial map view (Masaka City)
const initialView = {
    center: [-0.3333, 31.7333],
    zoom: 13
};

/**
 * Initialize the application
 */
function initApp() {
    console.log('🚗 Initializing Road Accident Hotspot Map for Masaka City...');
    
    // Debug: Check if footer exists
    const footer = document.getElementById('main-footer');
    console.log('Footer element in initApp:', footer);
    
    try {
        // Initialize map first
        initMap();
        
        // Then load data and initialize UI
        loadAccidentData().then(() => {
            initUI();
            updateMap();
            console.log('✅ Application initialized successfully for Masaka City');
        }).catch(error => {
            console.error('❌ Error loading data, using fallback:', error);
            // Use fallback data
            accidentData = fallbackData;
            initUI();
            updateMap();
            showNotification('Using sample data for Masaka City', 'info');
        });
        
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        // Last resort: use fallback data and try to initialize
        accidentData = fallbackData;
        try {
            initMap();
            initUI();
            updateMap();
            showNotification('Application loaded with sample Masaka City data', 'info');
        } catch (fallbackError) {
            showError('Failed to initialize the application. Please check the console for errors.');
        }
    }
}

/**
 * Initialize the Leaflet map centered on Masaka City
 */
function initMap() {
    // Create map centered on Masaka City
    map = L.map('map').setView(initialView.center, initialView.zoom);
    
    // Add OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Create layer groups
    accidentMarkers = L.layerGroup().addTo(map);
    
    // Initialize geocoder
    initGeocoder();
    
    // Add map controls
    addMapControls();
    
    console.log('🗺️ Map initialized for Masaka City');
}

/**
 * Initialize the geocoder for search functionality
 */
function initGeocoder() {
    geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        position: 'topleft',
        placeholder: 'Search locations in Masaka...',
        errorMessage: 'Location not found.',
        collapsed: false
    }).addTo(map);
    
    // Customize geocoder behavior
    geocoder.on('markgeocode', function(e) {
        const { center, name } = e.geocode;
        map.setView(center, 15);
        
        // Add search result marker
        clearSearchResults();
        const marker = L.marker(center)
            .addTo(map)
            .bindPopup(`<strong>${name}</strong><br>Search result location`)
            .openPopup();
        searchResults.push(marker);
        
        showNotification(`Location found: ${name}`);
    });
}

/**
 * Clear search result markers
 */
function clearSearchResults() {
    searchResults.forEach(marker => {
        map.removeLayer(marker);
    });
    searchResults = [];
}

/**
 * Add map controls (scale, layers)
 */
function addMapControls() {
    // Scale control
    L.control.scale({
        imperial: false,
        position: 'bottomleft'
    }).addTo(map);
}

/**
 * Load accident data from GeoJSON file
 */
function loadAccidentData() {
    return new Promise((resolve, reject) => {
        // First try to fetch from GeoJSON file
        fetch('data.geojson')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                accidentData = data;
                console.log('📊 Masaka City accident data loaded:', accidentData.features.length, 'accidents');
                resolve(data);
            })
            .catch(error => {
                console.warn('⚠️ Could not load GeoJSON file, using fallback data for Masaka City');
                reject(error);
            });
    });
}

/**
 * Initialize UI components and event listeners
 */
function initUI() {
    // Filter event listeners
    document.getElementById('severity-filter').addEventListener('change', function(e) {
        currentFilters.severity = e.target.value;
        updateMap();
    });
    
    document.getElementById('type-filter').addEventListener('change', function(e) {
        currentFilters.type = e.target.value;
        updateMap();
    });
    
    document.getElementById('time-filter').addEventListener('change', function(e) {
        currentFilters.time = e.target.value;
        updateMap();
    });
    
    document.getElementById('road-type-filter').addEventListener('change', function(e) {
        currentFilters.roadType = e.target.value;
        updateMap();
    });
    
    // Reset filters button
    document.getElementById('reset-filters').addEventListener('click', function() {
        resetFilters();
    });
    
    // Search functionality
    document.getElementById('search-button').addEventListener('click', function() {
        performSearch();
    });
    
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // My Location button
    document.getElementById('my-location').addEventListener('click', function() {
        findMyLocation();
    });
    
    // Reset View button
    document.getElementById('reset-view').addEventListener('click', function() {
        resetMapView();
    });
    
    // Footer action buttons
    document.getElementById('print-map').addEventListener('click', function() {
        printMap();
    });
    
    document.getElementById('share-map').addEventListener('click', function() {
        shareMap();
    });
    
    document.getElementById('export-map').addEventListener('click', function() {
        exportMap();
    });
    
    document.getElementById('toggle-heatmap').addEventListener('click', function() {
        toggleHeatmap();
    });
    
    document.getElementById('toggle-markers').addEventListener('click', function() {
        toggleMarkers();
    });
    
    document.getElementById('clear-search').addEventListener('click', function() {
        clearSearch();
    });
    
    console.log('🎛️ UI components initialized');
}

/**
 * Perform search using the search input
 */
function performSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        showNotification('Please enter a location to search', 'warning');
        return;
    }
    
    showNotification(`Searching for: ${query}`, 'info');
    
    // Use the geocoder to search
    geocoder.geocode(query, function(results) {
        if (results.length > 0) {
            const result = results[0];
            map.setView(result.center, 15);
            
            // Add search result marker
            clearSearchResults();
            const marker = L.marker(result.center)
                .addTo(map)
                .bindPopup(`<strong>${result.name}</strong><br>Search result location`)
                .openPopup();
            searchResults.push(marker);
            
            showNotification(`Location found: ${result.name}`);
        } else {
            showNotification('Location not found. Try a different search term.', 'error');
        }
    });
}

/**
 * Clear search input and results
 */
function clearSearch() {
    document.getElementById('search-input').value = '';
    clearSearchResults();
    showNotification('Search cleared');
}

/**
 * Find user's current location
 */
function findMyLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }
    
    showNotification('Finding your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const { latitude, longitude } = position.coords;
            const userLocation = [latitude, longitude];
            
            // Remove existing location marker
            if (currentLocationMarker) {
                map.removeLayer(currentLocationMarker);
            }
            
            // Add marker for user's location
            currentLocationMarker = L.marker(userLocation)
                .addTo(map)
                .bindPopup('Your current location')
                .openPopup();
            
            // Center map on user's location
            map.setView(userLocation, 14);
            showNotification('Your location has been found');
        },
        function(error) {
            let errorMessage = 'Unable to retrieve your location';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied by user';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out';
                    break;
            }
            showNotification(errorMessage, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

/**
 * Reset map to initial view
 */
function resetMapView() {
    map.setView(initialView.center, initialView.zoom);
    clearSearchResults();
    if (currentLocationMarker) {
        map.removeLayer(currentLocationMarker);
        currentLocationMarker = null;
    }
    showNotification('Map view reset to Masaka City');
}

/**
 * Reset all filters to default values
 */
function resetFilters() {
    document.getElementById('severity-filter').value = 'all';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('time-filter').value = 'all';
    document.getElementById('road-type-filter').value = 'all';
    
    currentFilters = {
        severity: 'all',
        type: 'all',
        time: 'all',
        roadType: 'all'
    };
    
    updateMap();
    showNotification('All filters reset');
}

/**
 * Print the current map view
 */
function printMap() {
    showNotification('Preparing map for printing...', 'info');
    // In a real implementation, you would use a library like html2canvas
    // For now, we'll use the browser's print function
    window.print();
}

/**
 * Share the current map view
 */
function shareMap() {
    if (navigator.share) {
        navigator.share({
            title: 'Masaka City Road Accident Hotspot Map',
            text: 'Check out this road accident hotspot map for Masaka City',
            url: window.location.href
        })
        .then(() => showNotification('Map shared successfully'))
        .catch(error => {
            console.error('Error sharing:', error);
            showNotification('Sharing failed. You can copy the URL manually.', 'warning');
        });
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => showNotification('URL copied to clipboard'))
            .catch(() => showNotification('Could not copy URL. Please copy it manually.', 'error'));
    }
}

/**
 * Export map data
 */
function exportMap() {
    showNotification('Exporting map data...', 'info');
    
    // Create a JSON blob with current filtered data
    const filteredData = {
        ...accidentData,
        features: filterFeatures(accidentData.features)
    };
    
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `masaka-accident-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Map data exported successfully');
}

/**
 * Toggle heatmap visibility
 */
function toggleHeatmap() {
    if (heatmapLayer) {
        if (map.hasLayer(heatmapLayer)) {
            map.removeLayer(heatmapLayer);
            isHeatmapVisible = false;
            showNotification('Heatmap hidden');
        } else {
            map.addLayer(heatmapLayer);
            isHeatmapVisible = true;
            showNotification('Heatmap visible');
        }
    }
}

/**
 * Toggle markers visibility
 */
function toggleMarkers() {
    if (accidentMarkers) {
        if (map.hasLayer(accidentMarkers)) {
            map.removeLayer(accidentMarkers);
            isMarkersVisible = false;
            showNotification('Accident markers hidden');
        } else {
            map.addLayer(accidentMarkers);
            isMarkersVisible = true;
            showNotification('Accident markers visible');
        }
    }
}

/**
 * Get color based on accident severity
 */
function getSeverityColor(severity) {
    return severityColors[severity] || '#95a5a6';
}

/**
 * Get marker radius based on accident severity
 */
function getMarkerRadius(severity) {
    const radii = {
        'fatal': 12,
        'serious': 10,
        'minor': 8
    };
    return radii[severity] || 8;
}

/**
 * Create detailed popup content for accident markers
 */
function createPopupContent(properties) {
    const severityClass = `severity-${properties.severity}`;
    const severityText = properties.severity.charAt(0).toUpperCase() + properties.severity.slice(1);
    
    return `
        <div class="accident-popup">
            <div class="popup-header">
                <strong>Accident #${properties.id} - Masaka City</strong>
            </div>
            <div class="popup-details">
                <div class="popup-detail">
                    <span class="popup-label">Location:</span>
                    <span class="popup-value">${properties.location}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Severity:</span>
                    <span class="popup-value ${severityClass}">${severityText}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Type:</span>
                    <span class="popup-value">${accidentTypeIcons[properties.type] || '🚗'} ${properties.type.replace('-', ' ')}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Date & Time:</span>
                    <span class="popup-value">${properties.date} at ${properties.time}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Time of Day:</span>
                    <span class="popup-value">${timeCategories[properties.time_of_day] || properties.time_of_day}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Vehicles Involved:</span>
                    <span class="popup-value">${properties.vehicles_involved}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Casualties:</span>
                    <span class="popup-value">${properties.casualties} total (${properties.fatalities || 0} fatal, ${properties.injuries || 0} injured)</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Weather:</span>
                    <span class="popup-value">${properties.weather}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Road Condition:</span>
                    <span class="popup-value">${properties.road_condition}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Road Type:</span>
                    <span class="popup-value">${properties.road_type || 'Not specified'}</span>
                </div>
                <div class="popup-detail">
                    <span class="popup-label">Description:</span>
                    <span class="popup-value">${properties.description}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Filter accident features based on current filters
 */
function filterFeatures(features) {
    return features.filter(feature => {
        const props = feature.properties;
        
        // Severity filter
        if (currentFilters.severity !== 'all' && props.severity !== currentFilters.severity) {
            return false;
        }
        
        // Type filter
        if (currentFilters.type !== 'all' && props.type !== currentFilters.type) {
            return false;
        }
        
        // Time filter
        if (currentFilters.time !== 'all' && props.time_of_day !== currentFilters.time) {
            return false;
        }
        
        // Road type filter
        if (currentFilters.roadType !== 'all' && props.road_type !== currentFilters.roadType) {
            return false;
        }
        
        return true;
    });
}

/**
 * Update map markers and heatmap based on current filters
 */
function updateMap() {
    console.log('🔄 Updating map with filters:', currentFilters);
    
    // Clear existing markers
    accidentMarkers.clearLayers();
    
    if (!accidentData.features || accidentData.features.length === 0) {
        console.warn('⚠️ No accident data available');
        updateStatistics([]);
        showNotification('No accident data available for Masaka City', 'warning');
        return;
    }
    
    // Filter features
    const filteredFeatures = filterFeatures(accidentData.features);
    const heatmapPoints = [];
    
    console.log(`📈 Displaying ${filteredFeatures.length} of ${accidentData.features.length} accidents in Masaka City`);
    
    // Create markers for filtered features
    filteredFeatures.forEach(feature => {
        const properties = feature.properties;
        const coordinates = feature.geometry.coordinates; // [lng, lat]
        
        // Create marker (Leaflet uses [lat, lng])
        const marker = L.circleMarker([coordinates[1], coordinates[0]], {
            radius: getMarkerRadius(properties.severity),
            fillColor: getSeverityColor(properties.severity),
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        });
        
        // Bind popup with accident details
        marker.bindPopup(createPopupContent(properties), {
            maxWidth: 400
        });
        
        // Add hover effects
        marker.on('mouseover', function() {
            this.setStyle({
                weight: 3,
                fillOpacity: 1
            });
        });
        
        marker.on('mouseout', function() {
            this.setStyle({
                weight: 2,
                fillOpacity: 0.8
            });
        });
        
        // Add to layer group
        marker.addTo(accidentMarkers);
        
        // Add to heatmap points (with weight based on severity)
        const weight = properties.severity === 'fatal' ? 1.0 : 
                      properties.severity === 'serious' ? 0.7 : 0.4;
        heatmapPoints.push([coordinates[1], coordinates[0], weight]);
    });
    
    // Update heatmap layer
    updateHeatmap(heatmapPoints);
    
    // Update statistics
    updateStatistics(filteredFeatures);
    
    // Adjust map view if we have markers
    if (filteredFeatures.length > 0) {
        adjustMapView(filteredFeatures);
    }
    
    showNotification(`Displaying ${filteredFeatures.length} accidents in Masaka City`);
}

/**
 * Update heatmap layer with new points
 */
function updateHeatmap(heatmapPoints) {
    // Remove existing heatmap layer
    if (heatmapLayer) {
        map.removeLayer(heatmapLayer);
    }
    
    // Create new heatmap if we have points
    if (heatmapPoints.length > 0) {
        heatmapLayer = L.heatLayer(heatmapPoints, {
            radius: 25,
            blur: 15,
            maxZoom: 16,
            gradient: {
                0.2: 'blue',
                0.4: 'cyan',
                0.6: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        }).addTo(map);
        
        console.log('🔥 Heatmap updated with', heatmapPoints.length, 'points in Masaka City');
    }
}

/**
 * Adjust map view to show all visible markers
 */
function adjustMapView(features) {
    if (features.length === 0) return;
    
    // For single point, zoom to it
    if (features.length === 1) {
        const coordinates = features[0].geometry.coordinates;
        map.setView([coordinates[1], coordinates[0]], 15);
        return;
    }
    
    // For multiple points, calculate bounds
    const group = L.featureGroup();
    features.forEach(feature => {
        const coordinates = feature.geometry.coordinates;
        group.addLayer(L.marker([coordinates[1], coordinates[0]]));
    });
    
    map.fitBounds(group.getBounds().pad(0.1));
}

/**
 * Calculate statistics from filtered features
 */
function calculateStatistics(features) {
    const stats = {
        total: features.length,
        fatal: 0,
        serious: 0,
        minor: 0,
        totalCasualties: 0,
        totalFatalities: 0,
        totalInjuries: 0
    };

    features.forEach(feature => {
        const props = feature.properties;
        
        // Count by severity
        stats[props.severity]++;
        
        // Count casualties
        stats.totalCasualties += props.casualties || 0;
        stats.totalFatalities += props.fatalities || 0;
        stats.totalInjuries += props.injuries || 0;
    });

    return stats;
}

/**
 * Update statistics display
 */
function updateStatistics(features) {
    const stats = calculateStatistics(features);
    
    // Update main statistics
    document.getElementById('total-accidents').textContent = stats.total;
    document.getElementById('fatal-accidents').textContent = stats.fatal;
    document.getElementById('serious-accidents').textContent = stats.serious;
    document.getElementById('minor-accidents').textContent = stats.minor;
    document.getElementById('total-casualties').textContent = stats.totalCasualties;
    
    // Calculate hotspots
    const hotspots = Math.max(1, Math.floor(stats.total / 3));
    document.getElementById('hotspots').textContent = hotspots;
    
    console.log('📊 Masaka City statistics updated:', stats);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.map-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `map-notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

/**
 * Show error message
 */
function showError(message) {
    showNotification(message, 'error');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, starting Masaka City Accident Map...');
    
    // Debug: Check if footer exists
    const footer = document.getElementById('main-footer');
    console.log('Footer element in DOMContentLoaded:', footer);
    
    // Hide loading indicator and initialize app
    setTimeout(() => {
        const loadingIndicator = document.getElementById('loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        initApp();
    }, 1000);
});

// Make functions available globally for debugging
window.accidentApp = {
    getData: () => accidentData,
    updateMap: updateMap,
    resetFilters: resetFilters,
    findMyLocation: findMyLocation,
    resetMapView: resetMapView,
    performSearch: performSearch
};

console.log('🚗 Masaka City Road Accident Hotspot Map - script.js loaded');