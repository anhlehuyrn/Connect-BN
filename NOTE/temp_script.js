// B岷痗 Ninh Locations Data (loaded from GeoJSON)
let locations = [];
let currentLanguage = 'vi';

// Global variables
let map;
let markers = [];
let currentCategory = 'all';

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing map...');
    applyLanguage(currentLanguage);
    loadGeoJSONData().then(() => {
        initializeMap();
        renderLocationsList();
        setupEventListeners();
    });
});

// Load GeoJSON data from file
function getPlacesUrl(lang) {
    return lang === 'vi' ? 'places.vi.geojson' : 'places.en.geojson';
}

async function loadGeoJSONData() {
    console.log('Attempting to load GeoJSON data...');
    try {
        const response = await fetch(getPlacesUrl(currentLanguage));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('GeoJSON data loaded successfully:', data);

        if (!data.features || data.features.length === 0) {
            console.warn('GeoJSON file is empty or has no features. Using fallback data.');
            locations = getFallbackLocations();
            return;
        }

        locations = data.features.map(feature => {
            const loc = {
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0],
                name: feature.properties.name,
                category: feature.properties.category,
                address: feature.properties.address,
                description: feature.properties.description,
                image: feature.properties.image,
                openingHours: feature.properties.opening_hours,
                ticketInfo: feature.properties.ticket_info,
                accessibility: feature.properties.accessibility
            };
            console.log(`Processing location: ${loc.name}, Image: ${loc.image}`);
            return loc;
        });

        console.log('Locations array populated from GeoJSON:', locations);

    } catch (error) {
        console.error('Error loading or parsing GeoJSON file:', error);
        console.log('Using fallback locations due to error.');
        locations = getFallbackLocations();
    }
}

// Simple i18n dictionary for UI strings
const I18N = {
    vi: {
        logo: 'B岷痗 Ninh',
        nav_intro: 'Gi峄沬 Thi峄噓',
        nav_map: 'B岷 膼峄?,
        nav_locations: '膼峄媋 膼i峄僲',
        nav_game: 'Tr貌 ch啤i',
        nav_memory: 'Gh茅p h矛nh',
        nav_printing: 'In tranh',
        nav_phuthe: 'B谩nh Phu Th锚',
        intro_title: 'Kh谩m Ph谩 B岷痗 Ninh',
        intro_p1: 'B岷痗 Ninh l脿 m峄檛 t峄塶h n岷眒 峄?v霉ng 膽峄搉g b岷眓g s么ng H峄搉g, mi峄乶 B岷痗 Vi峄噒 Nam. N峄昳 ti岷縩g v峄沬 truy峄乶 th峄憂g v膬n h贸a l芒u 膽峄漣.',
        intro_p2: 'T峄塶h n脿y c貌n 膽瓢峄 bi岷縯 膽岷縩 v峄沬 nhi峄乽 di t铆ch l峄媍h s峄? ch霉a chi峄乶 c峄?k铆nh v脿 膽岷穋 bi峄噒 l脿 d芒n ca Quan h峄?- 膽瓢峄 UNESCO c么ng nh岷璶 l脿 di s岷 v膬n h贸a phi v岷璽 th峄?c峄 nh芒n lo岷. V峄沬 v峄?tr铆 c谩ch H脿 N峄檌 ch峄?kho岷g 30km, B岷痗 Ninh l脿 膽i峄僲 膽岷縩 l媒 t瓢峄焠g cho nh峄痭g ai y锚u th铆ch kh谩m ph谩 v膬n h贸a v脿 l峄媍h s峄?Vi峄噒 Nam.',
        highlights_title: '膼i峄僲 N峄昳 B岷璽',
        hl1: '馃彌锔?H啤n 10 di t铆ch l峄媍h s峄?v脿 danh th岷痭g n峄昳 ti岷縩g',
        hl2: '馃幍 L脿ng d芒n ca Quan h峄?g峄慶',
        hl3: '馃彯 Nhi峄乽 l峄?h峄檌 truy峄乶 th峄憂g 膽岷穋 s岷痗',
        hl4: '馃帹 L脿ng ngh峄?truy峄乶 th峄憂g nh瓢 膼么ng H峄?,
        hl5: '馃摎 Truy峄乶 th峄憂g hi岷縰 h峄峜 n峄昳 ti岷縩g',
        map_title: 'B岷 膼峄?Du L峄媍h B岷痗 Ninh',
        map_subtitle: 'Kh谩m ph谩 c谩c 膽峄媋 膽i峄僲 du l峄媍h n峄昳 ti岷縩g tr锚n b岷 膽峄?t瓢啤ng t谩c',
        show_all: 'Hi峄噉 T岷 C岷?,
        filter_all: 'T岷 C岷?Danh M峄',
        filter_religious: 'Di T铆ch T么n Gi谩o',
        filter_historical: 'Di T铆ch L峄媍h S峄?,
        filter_cultural: '膼峄媋 膼i峄僲 V膬n H贸a',
        filter_craft: 'L脿ng Ngh峄?,
        filter_museum: 'B岷 T脿ng',
        filter_nature: 'Thi锚n Nhi锚n & Gi岷 Tr铆',
        locations_title: 'Danh S谩ch 膼峄媋 膼i峄僲',
        footer: '漏 2024 Kh谩m Ph谩 B岷痗 Ninh. Website th么ng tin du l峄媍h t峄塶h B岷痗 Ninh.',
        lbl_address: '馃搷 膼峄媋 ch峄?',
        lbl_hours: '馃晲 Gi峄?m峄?c峄璦:',
        lbl_ticket: '馃帿 V茅 v脿o c峄璦:',
        lbl_access: '鈾?Ti岷縫 c岷璶:',
        // New sections
        hero_subtitle: 'Di s岷 s峄憂g 鈥?V膬n h贸a 鈥?L峄媍h s峄?,
        hero_btn_map: 'Kh谩m ph谩 b岷 膽峄?,
        hero_btn_game: 'Tr貌 ch啤i',
        features: [
            { title: 'Di t铆ch n峄昳 ti岷縩g', text: 'H啤n 10 di t铆ch l峄媍h s峄?v脿 danh th岷痭g 膽岷穋 s岷痗.' },
            { title: 'Quan h峄?, text: 'C峄檌 ngu峄搉 d芒n ca Quan h峄?鈥?Di s岷 v膬n h贸a phi v岷璽 th峄?' },
            { title: 'L脿ng ngh峄?, text: 'Tranh 膼么ng H峄? g峄憁 Ph霉 L茫ng v脿 nhi峄乽 l脿ng ngh峄?truy峄乶 th峄憂g.' }
        ],
        cultural_title: 'Di S岷 V膬n H贸a N峄昳 B岷璽',
        cultural_cards: [
            { title: 'Tranh 膼么ng H峄?, text: 'Bi峄僽 t瓢峄g ngh峄?thu岷璽 d芒n gian 膽峄檆 膽谩o.' },
            { title: 'Ch霉a B煤t Th谩p', text: 'Ki岷縩 tr煤c c峄?k铆nh, linh thi锚ng.' },
            { title: 'Ch霉a Ph岷璽 T铆ch', text: 'T瓢峄g Ph岷璽 c峄?n峄昳 ti岷縩g, kh么ng gian t末nh l岷穘g.' },
            { title: 'D芒n ca Quan h峄?B岷痗 Ninh', text: 'H貌a gi峄峮g song ca b岷 t峄? 膽瓢峄 UNESCO vinh danh.' }
        ],
        video_title: 'B岷痗 Ninh qua g贸c nh矛n',
        video_subtitle: 'Kh谩m ph谩 v膬n h贸a Quan h峄?v脿 di s岷 s峄憂g',
        cta_title: 'S岷祅 s脿ng kh谩m ph谩 B岷痗 Ninh?',
        cta_subtitle: 'Xem b岷 膽峄?t瓢啤ng t谩c ho岷穋 tr岷 nghi峄噈 tr貌 ch啤i v膬n h贸a.',
        cta_btn_map: 'M峄?b岷 膽峄?,
        cta_btn_game: 'Tr貌 ch啤i',
        copyright: 'H矛nh 岷h s峄?d峄g tr锚n trang web n脿y 膽瓢峄 thu th岷璸 t峄?c谩c ngu峄搉 c么ng khai kh谩c nhau v脿 膽瓢峄 s瓢u t岷 cho m峄 膽铆ch gi谩o d峄 v脿 b岷 t峄搉 v膬n h贸a. Ch煤ng t么i cam k岷縯 kh么ng s峄?d峄g b岷 k峄?h矛nh 岷h n脿o cho m峄 膽铆ch th瓢啤ng m岷 m脿 kh么ng c贸 s峄?cho ph茅p th铆ch h峄.'
    },
    en: {
        logo: 'Bac Ninh',
        nav_intro: 'Introduction',
        nav_map: 'Map',
        nav_locations: 'Locations',
        nav_game: 'Game',
        nav_memory: 'Memory Game',
        nav_printing: 'Printing Game',
        nav_phuthe: 'Phu Th锚 Cake Game',
        intro_title: 'Discover Bac Ninh',
        intro_p1: 'Bac Ninh is a province in the Red River Delta, northern Vietnam, renowned for its long-standing cultural heritage and strong academic tradition.',
        intro_p2: 'It is home to numerous historical sites, ancient pagodas, and especially Quan ho folk songs鈥攔ecognized by UNESCO as an Intangible Cultural Heritage. Just ~30km from Hanoi, Bac Ninh is ideal for culture and history lovers.',
        highlights_title: 'Highlights',
        hl1: '馃彌锔?10+ famous historical and scenic sites',
        hl2: '馃幍 Origin of Quan ho folk songs',
        hl3: '馃彯 Many unique traditional festivals',
        hl4: '馃帹 Traditional craft villages like Dong Ho',
        hl5: '馃摎 Renowned culture of learning',
        map_title: 'Bac Ninh Travel Map',
        map_subtitle: 'Explore famous spots on the interactive map',
        show_all: 'Show All',
        filter_all: 'All Categories',
        filter_religious: 'Religious Site',
        filter_historical: 'Historical Site',
        filter_cultural: 'Cultural Site',
        filter_craft: 'Craft Village',
        filter_museum: 'Museum',
        filter_nature: 'Nature & Leisure',
        locations_title: 'Locations',
        footer: '漏 2024 Discover Bac Ninh. Provincial tourism information website.',
        lbl_address: '馃搷 Address:',
        lbl_hours: '馃晲 Opening hours:',
        lbl_ticket: '馃帿 Tickets:',
        lbl_access: '鈾?Accessibility:',
        // New sections
        hero_subtitle: 'Living Heritage 鈥?Culture 鈥?History',
        hero_btn_map: 'Explore the map',
        hero_btn_game: 'Game',
        features: [
            { title: 'Famous heritage sites', text: '10+ historical and scenic landmarks.' },
            { title: 'Quan ho', text: 'Origin of Quan ho 鈥?Intangible Cultural Heritage.' },
            { title: 'Craft villages', text: 'Dong Ho paintings, Phu Lang pottery, and more.' }
        ],
        cultural_title: 'Cultural Highlights',
        cultural_cards: [
            { title: 'Dong Ho Paintings', text: 'An iconic folk art tradition.' },
            { title: 'But Thap Pagoda', text: 'Ancient architecture, a sacred site.' },
            { title: 'Phat Tich Pagoda', text: 'Famous ancient Buddha statue, serene ambiance.' },
            { title: 'Bac Ninh Folk Songs', text: 'Timeless harmonized duet singing, UNESCO honored.' }
        ],
        video_title: 'Bac Ninh in Focus',
        video_subtitle: 'Explore Quan ho culture and living heritage',
        cta_title: 'Ready to explore Bac Ninh?',
        cta_subtitle: 'Open the interactive map or try the cultural game.',
        cta_btn_map: 'Open map',
        cta_btn_game: 'Game',
        copyright: 'Images used on this website are collected from various public sources and curated for educational and cultural preservation purposes. We commit to not using any image for commercial purposes without proper permission.'
    }
};

function applyLanguage(lang) {
    currentLanguage = lang;
    const t = I18N[lang];
    document.documentElement.lang = lang;
    const el = (id) => document.getElementById(id);
    const logoImg = document.getElementById('i18n-logo');
    if (logoImg && logoImg.tagName === 'IMG') {
        logoImg.setAttribute('alt', t.logo);
    }
    el('i18n-nav-intro')?.replaceChildren(document.createTextNode(t.nav_intro));
    el('i18n-nav-map')?.replaceChildren(document.createTextNode(t.nav_map));
    el('i18n-nav-locations')?.replaceChildren(document.createTextNode(t.nav_locations));
    el('i18n-nav-game')?.replaceChildren(document.createTextNode(t.nav_game));
    el('i18n-nav-memory')?.replaceChildren(document.createTextNode(t.nav_memory));
    el('i18n-nav-printing')?.replaceChildren(document.createTextNode(t.nav_printing));
    el('i18n-nav-phuthe')?.replaceChildren(document.createTextNode(t.nav_phuthe));
    el('i18n-intro-title')?.replaceChildren(document.createTextNode(t.intro_title));
    el('i18n-intro-p1')?.replaceChildren(document.createTextNode(t.intro_p1));
    el('i18n-intro-p2')?.replaceChildren(document.createTextNode(t.intro_p2));
    el('i18n-highlights-title')?.replaceChildren(document.createTextNode(t.highlights_title));
    el('i18n-hl-1')?.replaceChildren(document.createTextNode(t.hl1));
    el('i18n-hl-2')?.replaceChildren(document.createTextNode(t.hl2));
    el('i18n-hl-3')?.replaceChildren(document.createTextNode(t.hl3));
    el('i18n-hl-4')?.replaceChildren(document.createTextNode(t.hl4));
    el('i18n-hl-5')?.replaceChildren(document.createTextNode(t.hl5));
    el('i18n-map-title')?.replaceChildren(document.createTextNode(t.map_title));
    el('i18n-map-subtitle')?.replaceChildren(document.createTextNode(t.map_subtitle));
    el('show-all')?.replaceChildren(document.createTextNode(t.show_all));
    el('i18n-filter-all')?.replaceChildren(document.createTextNode(t.filter_all));
    el('i18n-filter-religious')?.replaceChildren(document.createTextNode(t.filter_religious));
    el('i18n-filter-historical')?.replaceChildren(document.createTextNode(t.filter_historical));
    el('i18n-filter-cultural')?.replaceChildren(document.createTextNode(t.filter_cultural));
    el('i18n-filter-craft')?.replaceChildren(document.createTextNode(t.filter_craft));
    el('i18n-filter-museum')?.replaceChildren(document.createTextNode(t.filter_museum));
    el('i18n-filter-nature')?.replaceChildren(document.createTextNode(t.filter_nature));
    el('i18n-locations-title')?.replaceChildren(document.createTextNode(t.locations_title));
    el('i18n-footer')?.replaceChildren(document.createTextNode(t.footer));

    // New sections wiring
    el('i18n-hero-subtitle')?.replaceChildren(document.createTextNode(t.hero_subtitle));
    el('i18n-hero-btn-map')?.replaceChildren(document.createTextNode(t.hero_btn_map));
    el('i18n-hero-btn-game')?.replaceChildren(document.createTextNode(t.hero_btn_game));

    // Features grid
    const f = t.features || [];
    el('i18n-feature-1-title')?.replaceChildren(document.createTextNode(f[0]?.title || ''));
    el('i18n-feature-1-text')?.replaceChildren(document.createTextNode(f[0]?.text || ''));
    el('i18n-feature-2-title')?.replaceChildren(document.createTextNode(f[1]?.title || ''));
    el('i18n-feature-2-text')?.replaceChildren(document.createTextNode(f[1]?.text || ''));
    el('i18n-feature-3-title')?.replaceChildren(document.createTextNode(f[2]?.title || ''));
    el('i18n-feature-3-text')?.replaceChildren(document.createTextNode(f[2]?.text || ''));

    // Cultural highlights
    el('i18n-cultural-title')?.replaceChildren(document.createTextNode(t.cultural_title));
    const c = t.cultural_cards || [];
    el('i18n-cultural-1-title')?.replaceChildren(document.createTextNode(c[0]?.title || ''));
    el('i18n-cultural-1-text')?.replaceChildren(document.createTextNode(c[0]?.text || ''));
    el('i18n-cultural-2-title')?.replaceChildren(document.createTextNode(c[1]?.title || ''));
    el('i18n-cultural-2-text')?.replaceChildren(document.createTextNode(c[1]?.text || ''));
    el('i18n-cultural-3-title')?.replaceChildren(document.createTextNode(c[2]?.title || ''));
    el('i18n-cultural-3-text')?.replaceChildren(document.createTextNode(c[2]?.text || ''));
    el('i18n-cultural-4-title')?.replaceChildren(document.createTextNode(c[3]?.title || ''));
    el('i18n-cultural-4-text')?.replaceChildren(document.createTextNode(c[3]?.text || ''));

    // Video section
    el('i18n-video-title')?.replaceChildren(document.createTextNode(t.video_title));
    el('i18n-video-subtitle')?.replaceChildren(document.createTextNode(t.video_subtitle));

    // CTA section
    el('i18n-cta-title')?.replaceChildren(document.createTextNode(t.cta_title));
    el('i18n-cta-subtitle')?.replaceChildren(document.createTextNode(t.cta_subtitle));
    el('i18n-cta-btn-map')?.replaceChildren(document.createTextNode(t.cta_btn_map));
    el('i18n-cta-btn-game')?.replaceChildren(document.createTextNode(t.cta_btn_game));

    // Copyright notice
    el('i18n-copyright')?.replaceChildren(document.createTextNode(t.copyright));
}

// Fallback locations data in case GeoJSON fails to load
function getFallbackLocations() {
    return [
        {
            name: "Dau Pagoda (Chua Dau)",
            category: "Religious Site",
            address: "Thanh Khuong, Thuan Thanh",
            description: "Oldest Buddhist pagoda in Vietnam, built in the 2nd century.",
            image: "Exterior.png",
            openingHours: "7:00鈥?8:00",
            ticketInfo: "Free",
            accessibility: "Wheelchair accessible",
            lat: 21.0276,
            lng: 106.0823
        }
        // Add more fallback locations as needed
    ];
}

function initializeMap() {
    try {
        // Create map centered on Bac Ninh
        map = L.map('map-container').setView([21.08, 106.05], 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '漏 OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        console.log('Map initialized successfully');
        
        // Add markers for all locations
        addMarkersToMap();
        
    } catch (error) {
        console.error('Error initializing map:', error);
        // Show error message in map container
        document.getElementById('map-container').innerHTML = 
            '<div style="display: flex; justify-content: center; align-items: center; height: 500px; color: red; font-size: 18px;">L峄梚 t岷 b岷 膽峄? Vui l貌ng l脿m m峄沬 trang.</div>';
    }
}

function addMarkersToMap() {
    try {
        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Filter locations based on current category
        const filteredLocations = currentCategory === 'all' 
            ? locations 
            : locations.filter(loc => loc.category === currentCategory);
        
        console.log('Adding markers for', filteredLocations.length, 'locations');
        
        // Add markers for each location
        filteredLocations.forEach(location => {
            // Create simple marker
            const marker = L.marker([location.lat, location.lng])
                .addTo(map)
                .bindPopup(createPopupContent(location));
            
            // Add hover tooltip
            marker.bindTooltip(createTooltipContent(location), {
                direction: 'top',
                permanent: false,
                offset: [0, -10]
            });
            
            // Add to markers array
            markers.push(marker);
        });
        
        // Fit map to show all markers
        if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
        
        console.log('Markers added successfully');
        
    } catch (error) {
        console.error('Error adding markers:', error);
    }
}

function createPopupContent(location) {
    const imagePath = location.image ? encodeURI(`image list png/places png/${location.image}`) : '';
    console.log(`Creating popup for ${location.name}, image path: ${imagePath}`);
    const imageHtml = location.image ? 
        `<div style="margin-bottom: 10px; text-align: center;">
            <img src="${imagePath}" 
                 alt="${location.name}" 
                 style="max-width: 100%; max-height: 150px; border-radius: 8px; object-fit: cover;"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block'; console.log('Image failed to load:', '${imagePath}');">
             <div style="display: none; color: #888; font-size: 11px; margin-top: 5px;">岷h kh么ng kh岷?d峄g</div>
          </div>` : '';
    const isDongHo = location.name === 'L脿ng tranh 膼么ng H峄? || location.name === 'Dong Ho Village';
    const externalUrl = 'http://localhost:8000/Giaodien/tranhdongho/dongho-village.html';
    const titleHtml = isDongHo 
        ? `<a href="${externalUrl}" style="color: inherit; text-decoration: none;">${location.name}</a>`
        : `${location.name}`;
    
    return `
        <div style="min-width: 250px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px;">${titleHtml}</h3>
            ${imageHtml}
            <div style="background: #3498db; color: white; padding: 3px 8px; border-radius: 10px; font-size: 12px; display: inline-block; margin-bottom: 8px;">
                ${getCategoryName(location.category)}
            </div>
            <div style="margin-bottom: 8px; font-size: 13px;">
                <strong>${I18N[currentLanguage].lbl_address}</strong> ${location.address}
            </div>
            <div style="margin-bottom: 8px; font-size: 13px;">
                <strong>${I18N[currentLanguage].lbl_hours}</strong> ${location.openingHours}
            </div>
            <div style="margin-bottom: 8px; font-size: 13px;">
                <strong>${I18N[currentLanguage].lbl_ticket}</strong> ${location.ticketInfo}
            </div>
            <div style="margin-bottom: 8px; font-size: 13px;">
                <strong>${I18N[currentLanguage].lbl_access}</strong> ${location.accessibility}
            </div>
            <div style="font-size: 13px; line-height: 1.4; color: #555;">
                ${location.description}
            </div>
            <div style="margin-top: 10px; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 5px;">
                馃椇锔?${location.lat}掳N, ${location.lng}掳E
            </div>
        </div>
    `;
}

function createTooltipContent(location) {
    return `
        <div style="font-weight: bold; color: #2c3e50; font-size: 13px;">${location.name}</div>
        <div style="font-size: 11px; color: #7f8c8d; margin-top: 2px;">${getCategoryName(location.category)}</div>
        <div style="font-size: 10px; margin-top: 3px; color: #555;">馃搷 ${location.address}</div>
    `;
}

function getCategoryName(category) {
    if (currentLanguage === 'vi') {
        const categoryNamesVi = {
            'Religious Site': 'Di T铆ch T么n Gi谩o',
            'Historical Site': 'Di T铆ch L峄媍h S峄?,
            'Cultural Site': '膼峄媋 膼i峄僲 V膬n H贸a',
            'Craft Village': 'L脿ng Ngh峄?,
            'Cultural Venue': 'Trung T芒m V膬n H贸a',
            'Museum': 'B岷 T脿ng',
            'Archaeological Site': 'Di T铆ch Kh岷 C峄?,
            'Nature & Leisure': 'Thi锚n Nhi锚n & Gi岷 Tr铆',
            'Nature Reserve': 'Khu b岷 t峄搉 thi锚n nhi锚n',
            'Ecotourism Site': 'Khu du l峄媍h sinh th谩i'
        };
        return categoryNamesVi[category] || category;
    } else {
        return category;
    }
}

function renderLocationsList() {
    try {
        const grid = document.getElementById('locations-grid');
        const filteredLocations = currentCategory === 'all' 
            ? locations 
            : locations.filter(loc => loc.category === currentCategory);
        
        grid.innerHTML = filteredLocations.map(location => {
            const imagePath = location.image ? encodeURI(`image list png/places png/${location.image}`) : '';
            const imageHtml = location.image ? 
                `<div style="margin-bottom: 12px; text-align: center;">
                    <img src="${imagePath}" 
                         alt="${location.name}" 
                         style="width: 100%; max-height: 120px; border-radius: 8px; object-fit: cover;"
                         onerror="this.style.display='none';">
                 </div>` : '';
            const isDongHo = location.name === 'L脿ng tranh 膼么ng H峄? || location.name === 'Dong Ho Village';
            const externalUrl = 'http://localhost:8000/Giaodien/tranhdongho/dongho-village.html';
            const titleHtml = isDongHo 
                ? `<a href="${externalUrl}" style="color: inherit; text-decoration: none;">${location.name}</a>`
                : `${location.name}`;
            
            return `
                <div class="location-card" data-category="${location.category}">
                    ${imageHtml}
                    <h3>${titleHtml}</h3>
                    <div class="location-category">${getCategoryName(location.category)}</div>
                    <div class="location-address">馃搷 ${location.address}</div>
                    <div class="location-description">${location.description}</div>
                    <div class="location-details">
                        <div class="location-detail">
                            <span>馃晲</span>
                            <span>${location.openingHours}</span>
                        </div>
                        <div class="location-detail">
                            <span>馃帿</span>
                            <span>${location.ticketInfo}</span>
                        </div>
                        <div class="location-detail">
                            <span>鈾?/span>
                            <span>${location.accessibility}</span>
                        </div>
                    </div>
                    <div class="location-coordinates">
                        馃椇锔?${location.lat}掳N, ${location.lng}掳E
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error rendering locations list:', error);
    }
}

function setupEventListeners() {
    try {
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                currentCategory = this.value;
                addMarkersToMap();
                renderLocationsList();
            });
        }
        
        // Show all button
        const showAllBtn = document.getElementById('show-all');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', function() {
                currentCategory = 'all';
                if (categoryFilter) categoryFilter.value = 'all';
                addMarkersToMap();
                renderLocationsList();
            });
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                // Only apply smooth scroll for anchor links (starting with #)
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Location card click to focus on map
        document.addEventListener('click', function(e) {
            const card = e.target.closest('.location-card');
            if (card && map) {
                const locationName = card.querySelector('h3').textContent;
                const location = locations.find(loc => loc.name === locationName);
                if (location) {
                    map.setView([location.lat, location.lng], 16);
                    // Find and open the corresponding marker
                    const marker = markers.find(m => 
                        Math.abs(m.getLatLng().lat - location.lat) < 0.001 && 
                        Math.abs(m.getLatLng().lng - location.lng) < 0.001
                    );
                    if (marker) {
                        marker.openPopup();
                    }
                }
            }
        });

        // Language switchers
        const globeBtn = document.getElementById('globeBtn');
        const langDropdown = document.getElementById('langDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        // Toggle dropdown
        globeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langDropdown.classList.contains('show');
            if (isOpen) {
                closeLangDropdown();
            } else {
                openLangDropdown();
            }
        });

        // Open dropdown
        function openLangDropdown() {
            langDropdown.classList.add('show');
            globeBtn.setAttribute('aria-expanded', 'true');
        }

        // Close dropdown
        function closeLangDropdown() {
            langDropdown.classList.remove('show');
            globeBtn.setAttribute('aria-expanded', 'false');
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-switcher')) {
                closeLangDropdown();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && langDropdown.classList.contains('show')) {
                closeLangDropdown();
                globeBtn.focus();
            }
        });

        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', async () => {
                const lang = option.dataset.lang;
                if (currentLanguage === lang) return;
                
                applyLanguage(lang);
                await loadGeoJSONData();
                clearMarkers();
                addMarkersToMap();
                renderLocationsList();
                updateActiveLang(lang);
                closeLangDropdown();
            });

            // Keyboard navigation
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
                // Arrow keys
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const options = Array.from(langOptions);
                    const idx = options.indexOf(option);
                    const nextIdx = e.key === 'ArrowDown' 
                        ? (idx + 1) % options.length 
                        : (idx - 1 + options.length) % options.length;
                    options[nextIdx].focus();
                }
            });
        });

        // Update active language indicator
        function updateActiveLang(lang) {
            langOptions.forEach(opt => {
                if (opt.dataset.lang === lang) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
        }

        // Initialize active language
        updateActiveLang(currentLanguage);

        // Nav dropdown toggle for Games
        const navDropdown = document.querySelector('.nav-item.dropdown');
        const navGameTrigger = navDropdown ? navDropdown.querySelector('#i18n-nav-game') : null;
        const navDropdownMenu = navDropdown ? navDropdown.querySelector('.dropdown-menu') : null;
        if (navGameTrigger && navDropdownMenu) {
            navGameTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = navDropdownMenu.classList.contains('show');
                if (isOpen) {
                    navDropdownMenu.classList.remove('show');
                } else {
                    navDropdownMenu.classList.add('show');
                }
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-item.dropdown')) {
                    navDropdownMenu.classList.remove('show');
                }
            });
        }
    
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function clearMarkers() {
    try {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    } catch (e) {
        console.warn('clearMarkers warning:', e);
    }
}

// Add some interactive features when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll animations for location cards
    setTimeout(() => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe location cards
        document.querySelectorAll('.location-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 1000);
});
