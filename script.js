// Bac Ninh Locations Data (loaded from GeoJSON)
let locations = [];
let currentLanguage = 'vi';

// Global variables
let map;
let markers = [];
let currentCategory = 'all';

// Initialize once when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing map...');
  loadHeader().then(() => {
    applyLanguage(currentLanguage);
    loadGeoJSONData().then(() => {
      if (document.getElementById('map-container')) {
        initializeMap();
      }
      renderLocationsList();
      setupEventListeners();
      setupCardObserver(); // scroll animations
      AOS.init();
    });
  });
});

async function loadHeader() {
  const headerPlaceholder = document.getElementById('global-header-placeholder');
  if (headerPlaceholder) {
    try {
      const response = await fetch('/header.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const headerHtml = await response.text();
      headerPlaceholder.innerHTML = headerHtml;
    } catch (error) {
      console.error('Error loading header:', error);
    }
  }
}

// Load GeoJSON data from file
function getPlacesUrl(lang) {
  return lang === 'vi' ? '/places.vi.geojson' : '/places.en.geojson';
}

async function loadGeoJSONData() {
  console.log('Attempting to load GeoJSON data...');
  try {
    const response = await fetch(getPlacesUrl(currentLanguage));
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    console.warn('Primary GeoJSON load failed, trying fallback places.geojson:', error);
    try {
      const resp2 = await fetch('/places.geojson');
      if (!resp2.ok) throw new Error(`HTTP error! status: ${resp2.status}`);
      const data2 = await resp2.json();
      console.log('Fallback GeoJSON data loaded:', data2);

      if (!data2.features || data2.features.length === 0) {
        console.warn('Fallback GeoJSON is empty. Using fallback locations.');
        locations = getFallbackLocations();
        return;
      }

      locations = data2.features.map(feature => {
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
        console.log(`Processing location (fallback): ${loc.name}, Image: ${loc.image}`);
        return loc;
      });

      console.log('Locations populated from fallback GeoJSON:', locations);
    } catch (error2) {
      console.error('Error loading or parsing GeoJSON file:', error2);
      console.log('Using fallback locations due to error.');
      locations = getFallbackLocations();
    }
  }
}

// Simple i18n dictionary for UI strings (fixed structure)
const I18N = {
  vi: {
    logo: 'Bắc Ninh',
    nav_intro: 'Giới Thiệu',
    nav_map: 'Bản Đồ',
    nav_locations: 'Địa Điểm',
    nav_game: 'Trò chơi',
    nav_memory: 'Ghép hình',
    nav_printing: 'In tranh',
    nav_phuthe: 'Bánh Phu Thê',
    nav_dongho: 'Đoán Tranh Đông Hồ',
    intro_title: 'Khám Phá Bắc Ninh',
    intro_p1: 'Khám phá vùng đất cổ kính nơi lưu giữ tinh hoa văn hóa Việt - từ dân ca Quan họ được UNESCO công nhận đến tranh Đông Hồ tinh xảo và những ngôi chùa nghìn năm tuổi.',
    intro_p2: 'Tỉnh này còn được biết đến với nhiều di tích lịch sử, chùa chiền cổ kính và đặc biệt là dân ca Quan họ - được UNESCO công nhận là di sản văn hóa phi vật thể của nhân loại. Với vị trí cách Hà Nội chỉ khoảng 30km, Bắc Ninh là điểm đến lý tưởng cho những ai yêu thích khám phá văn hóa và lịch sử Việt Nam.',
    highlights_title: 'Điểm Nổi Bật',
    hl1: '🏛️ Hơn 10 di tích lịch sử và danh thắng nổi tiếng',
    hl2: '🎵 Làng dân ca Quan họ gốc',
    hl3: '🏮 Nhiều lễ hội truyền thống đặc sắc',
    hl4: '🎨 Làng nghề truyền thống như Đông Hồ',
    hl5: '📚 Truyền thống hiếu học nổi tiếng',
    map_title: 'Bản Đồ Du Lịch Bắc Ninh',
    map_subtitle: 'Khám phá các địa điểm du lịch nổi tiếng trên bản đồ tương tác',
    show_all: 'Hiện Tất Cả',
    filter_all: 'Tất Cả Danh Mục',
    filter_religious: 'Di Tích Tôn Giáo',
    filter_historical: 'Di Tích Lịch Sử',
    filter_cultural: 'Địa Điểm Văn Hóa',
    filter_craft: 'Làng Nghề',
    filter_museum: 'Bảo Tàng',
    filter_nature: 'Thiên Nhiên & Giải Trí',
    locations_title: 'Danh Sách Địa Điểm',
    footer: '© 2025 Connect Bac Ninh. Website thông tin du lịch tỉnh Bắc Ninh.',
    lbl_address: '📍 Địa chỉ:',
    lbl_hours: '🕐 Giờ mở cửa:',
    lbl_ticket: '🎫 Vé vào cửa:',
    lbl_access: '♿ Tiếp cận:',
    hero_subtitle: 'Di sản sống • Văn hóa • Lịch sử',
    hero_btn_map: 'Khám phá bản đồ',
    hero_btn_game: 'Trò chơi',
    features: [
      { title: 'Di tích nổi tiếng', text: 'Hơn 10 di tích lịch sử và danh thắng đặc sắc.' },
      { title: 'Quan họ', text: 'Cội nguồn dân ca Quan họ — Di sản văn hóa phi vật thể.' },
      { title: 'Làng nghề', text: 'Tranh Đông Hồ, gốm Phù Lãng và nhiều làng nghề truyền thống.' }
    ],
    cultural_title: 'Di Sản Văn Hóa Nổi Bật',
    cultural_cards: [
      { title: 'Tranh Đông Hồ', text: 'Biểu tượng nghệ thuật dân gian độc đáo.' },
      { title: 'Chùa Bút Tháp', text: 'Kiến trúc cổ kính, linh thiêng.' },
      { title: 'Chùa Phật Tích', text: 'Tượng Phật cổ nổi tiếng, không gian tĩnh lặng.' },
      { title: 'Dân ca Quan họ Bắc Ninh', text: 'Hòa giọng song ca bất tử, được UNESCO vinh danh.' }
    ],
    video_title: 'Bắc Ninh qua góc nhìn',
    video_subtitle: 'Khám phá văn hóa Quan họ và di sản sống',
    cta_title: 'Sẵn sàng khám phá Bắc Ninh?',
    cta_subtitle: 'Xem bản đồ tương tác hoặc trải nghiệm trò chơi văn hóa.',
    cta_btn_map: 'Mở bản đồ',
    cta_btn_game: 'Trò chơi',
    copyright: 'Hình ảnh sử dụng trên trang web này được thu thập từ các nguồn công khai khác nhau và được sưu tầm cho mục đích giáo dục và bảo tồn văn hóa.',
    gamehub: {
      title: 'Trò chơi Bắc Ninh  – Game Hub',
      phuthe_title: 'Bánh Phu Thê',
      phuthe_desc: 'Trò chơi làm bánh truyền thống Bắc Ninh.',
      play_now: 'Chơi ngay',
      dongho_quiz_title: 'Đoán Tranh Đông Hồ',
      dongho_quiz_desc: 'Đoán tranh Đông Hồ và biểu tượng văn hóa quốc tế.',
      memory_game_title: 'Ghép hình',
      memory_game_desc: 'Trò chơi trí nhớ với hình ảnh Bắc Ninh.',
      printing_game_title: 'In tranh',
      printing_game_desc: 'Trò chơi in tranh Đông Hồ.'
    },
    red_layer: 'Lớp đỏ',
    yellow_layer: 'Lớp vàng',
    blue_layer: 'Lớp xanh',
    black_layer: 'Lớp đen',
    selected: 'Đã chọn',
    click_to_print: 'Nhấp để in',
    all_complete: 'Hoàn thành tất cả các lớp!',
    complete_layer: 'Hoàn thành lớp',
    step: 'Bước',
    of: 'của',
    welcome_msg: 'Chào mừng bạn đến với trò chơi In Tranh Đông Hồ!',
    congrats: 'Chúc mừng!',
    complete_msg: 'Bạn đã hoàn thành bức tranh Đông Hồ của mình!'
  },
  en: {
    logo: 'Bac Ninh',
    nav_intro: 'Introduction',
    nav_map: 'Map',
    nav_locations: 'Locations',
    nav_game: 'Games',
    nav_memory: 'Memory Game',
    nav_printing: 'Painting Print',
    nav_phuthe: 'Phu The Cake',
    nav_dongho: 'Guess Dong Ho Painting',
    intro_title: 'Discover Bac Ninh',
    intro_p1: 'Discover the ancient land that preserves the essence of Vietnamese culture - from UNESCO-recognized Quan ho folk songs to exquisite Dong Ho paintings and thousand-year-old pagodas.',
    intro_p2: 'The province is also known for its many historical relics, ancient pagodas, and especially Quan Ho folk songs—recognized by UNESCO as an intangible cultural heritage of humanity. Located only about 30km from Hanoi, Bac Ninh is ideal for culture and history lovers.',
    highlights_title: 'Highlights',
    hl1: '🏛️ More than 10 famous historical relics and landscapes',
    hl2: '🎵 Original Quan Ho folk song village',
    hl3: '🏮 Many unique traditional festivals',
    hl4: '🎨 Traditional craft villages like Dong Ho',
    hl5: '📚 Famous tradition of studiousness',
    map_title: 'Bac Ninh Tourist Map',
    map_subtitle: 'Explore famous tourist attractions on the interactive map',
    show_all: 'Show All',
    filter_all: 'All Categories',
    filter_religious: 'Religious Site',
    filter_historical: 'Historical Site',
    filter_cultural: 'Cultural Site',
    filter_craft: 'Craft Village',
    filter_museum: 'Museum',
    filter_nature: 'Nature & Leisure',
    locations_title: 'List of Locations',
    footer: '© 2025 Connect Bac Ninh. Bac Ninh provincial tourism information website.',
    lbl_address: '📍 Address:',
    lbl_hours: '🕐 Opening hours:',
    lbl_ticket: '🎫 Tickets:',
    lbl_access: '♿ Accessibility:',
    hero_subtitle: 'Living Heritage • Culture • History',
    hero_btn_map: 'Explore the map',
    hero_btn_game: 'Game',
    features: [
      { title: 'Famous heritage sites', text: '10+ historical and scenic landmarks.' },
      { title: 'Quan ho', text: 'Origin of Quan ho — Intangible Cultural Heritage.' },
      { title: 'Craft villages', text: 'Dong Ho paintings, Phu Lang pottery, and more.' }
    ],
    cultural_title: 'Cultural Highlights',
    cultural_cards: [
      { title: 'Dong Ho Paintings', text: 'An iconic folk art tradition.' },
      { title: 'But Thap Pagoda', text: 'Ancient architecture, a sacred site.' },
      { title: 'Phat Tich Pagoda', text: 'Famous ancient Buddha statue, serene ambiance.' },
      { title: 'Quan Ho Folk Songs of Bac Ninh', text: 'Timeless harmonized duet singing, UNESCO honored.' }
    ],
    video_title: 'Bac Ninh in Focus',
    video_subtitle: 'Explore Quan ho culture and living heritage',
    cta_title: 'Ready to explore Bac Ninh?',
    cta_subtitle: 'Open the interactive map or try the cultural game.',
    cta_btn_map: 'Open map',
    cta_btn_game: 'Game',
    copyright: 'Images used on this website are collected from various public sources and curated for educational and cultural preservation purposes.',
    gamehub: {
      title: 'Bac Ninh Games – Game Hub',
      phuthe_title: 'Phu The Cake',
      phuthe_desc: 'Traditional Bac Ninh cake making game.',
      play_now: 'Play Now',
      dongho_quiz_title: 'Guess Dong Ho Painting',
      dongho_quiz_desc: 'Guess Dong Ho paintings and international cultural symbols.',
      memory_game_title: 'Memory Game',
      memory_game_desc: 'Memory game with Bac Ninh images.',
      printing_game_title: 'Printing Game',
      printing_game_desc: 'Dong Ho painting printing game.'
    },
    red_layer: 'Red Layer',
    yellow_layer: 'Yellow Layer',
    blue_layer: 'Blue Layer',
    black_layer: 'Black Layer',
    selected: 'Selected',
    click_to_print: 'Click to print',
    all_complete: 'All layers complete!',
    complete_layer: 'Completed layer',
    step: 'Step',
    of: 'of',
    welcome_msg: 'Welcome to the Dong Ho Printing Game!',
    congrats: 'Congratulations!',
    complete_msg: 'You have completed your Dong Ho painting!'
  }
};

function applyLanguage(lang) {
  currentLanguage = lang;
  window.currentLanguage = lang; // global for templates
  const t = I18N[lang];
  document.documentElement.lang = lang;
  const el = (id) => document.getElementById(id);
  const logoImg = document.getElementById('i18n-logo');
  if (logoImg && logoImg.tagName === 'IMG') logoImg.setAttribute('alt', t.logo);

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

  // New sections
  el('i18n-hero-subtitle')?.replaceChildren(document.createTextNode(t.hero_subtitle));
  el('i18n-hero-btn-map')?.replaceChildren(document.createTextNode(t.hero_btn_map));
  el('i18n-hero-btn-game')?.replaceChildren(document.createTextNode(t.hero_btn_game));

  const f = t.features || [];
  el('i18n-feature-1-title')?.replaceChildren(document.createTextNode(f[0]?.title || ''));
  el('i18n-feature-1-text')?.replaceChildren(document.createTextNode(f[0]?.text || ''));
  el('i18n-feature-2-title')?.replaceChildren(document.createTextNode(f[1]?.title || ''));
  el('i18n-feature-2-text')?.replaceChildren(document.createTextNode(f[1]?.text || ''));
  el('i18n-feature-3-title')?.replaceChildren(document.createTextNode(f[2]?.title || ''));
  el('i18n-feature-3-text')?.replaceChildren(document.createTextNode(f[2]?.text || ''));

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

  el('i18n-video-title')?.replaceChildren(document.createTextNode(t.video_title));
  el('i18n-video-subtitle')?.replaceChildren(document.createTextNode(t.video_subtitle));
  el('i18n-cta-title')?.replaceChildren(document.createTextNode(t.cta_title));
  el('i18n-cta-subtitle')?.replaceChildren(document.createTextNode(t.cta_subtitle));
  el('i18n-cta-btn-map')?.replaceChildren(document.createTextNode(t.cta_btn_map));
  el('i18n-cta-btn-game')?.replaceChildren(document.createTextNode(t.cta_btn_game));
  el('i18n-copyright')?.replaceChildren(document.createTextNode(t.copyright));
}

// Fallback locations data
function getFallbackLocations() {
  return [
    {
      name: "Dau Pagoda (Chua Dau)",
      category: "Religious Site",
      address: "Thanh Khuong, Thuan Thanh",
      description: "Oldest Buddhist pagoda in Vietnam, built in the 2nd century.",
      image: "Exterior.png",
      openingHours: "7:00–18:00",
      ticketInfo: "Free",
      accessibility: "Wheelchair accessible",
      lat: 21.0276,
      lng: 106.0823
    }
  ];
}

function initializeMap() {
  try {
    // Create map centered on Bac Ninh
    map = L.map('map-container').setView([21.08, 106.05], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      crossOrigin: 'anonymous'
    }).addTo(map);

    console.log('Map initialized successfully');

    addMarkersToMap();
  } catch (error) {
    console.error('Error initializing map:', error);
    const mc = document.getElementById('map-container');
    if (mc) {
      mc.innerHTML =
        '<div style="display:flex;justify-content:center;align-items:center;height:500px;color:red;font-size:18px;">Lỗi tải bản đồ. Vui lòng làm mới trang.</div>';
    }
  }
}

function addMarkersToMap() {
  try {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    const filteredLocations = currentCategory === 'all'
      ? locations
      : currentCategory === 'Nature & Leisure'
        ? locations.filter(loc => loc.category === 'Nature Reserve' || loc.category === 'Ecotourism Site')
        : locations.filter(loc => loc.category === currentCategory);

    console.log('Adding markers for', filteredLocations.length, 'locations');

    filteredLocations.forEach(location => {
      const marker = L.marker([location.lat, location.lng])
        .addTo(map)
        .bindPopup(createPopupContent(location));

      marker.bindTooltip(createTooltipContent(location), {
        direction: 'top',
        permanent: false,
        offset: [0, -10]
      });

      markers.push(marker);
    });

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
  const imagePath = location.image ? encodeURI(`../image list png/places png/${location.image}`) : '';
  console.log(`Creating popup for ${location.name}, image path: ${imagePath}`);

  const imageHtml = location.image
    ? `
      <div style="margin-bottom: 10px; text-align: center;">
        <img src="${imagePath}"
             alt="${location.name}"
             style="max-width: 100%; max-height: 150px; border-radius: 8px; object-fit: cover;"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block'; console.log('Image failed to load:', '${imagePath}');">
        <div style="display: none; color: #888; font-size: 11px; margin-top: 5px;">Ảnh không khả dụng</div>
      </div>`
    : '';

  const isDongHo = location.name === 'Làng tranh Đông Hồ' || location.name === 'Dong Ho Village';
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
        🗺️ ${location.lat}°N, ${location.lng}°E
      </div>
    </div>
  `;
}

function createTooltipContent(location) {
  return `
    <div style="font-weight: bold; color: #2c3e50; font-size: 13px;">${location.name}</div>
    <div style="font-size: 11px; color: #7f8c8d; margin-top: 2px;">${getCategoryName(location.category)}</div>
    <div style="font-size: 10px; margin-top: 3px; color: #555;">📍 ${location.address}</div>
  `;
}

function getCategoryName(category) {
  if (currentLanguage === 'vi') {
    const categoryNamesVi = {
      'Religious Site': 'Di Tích Tôn Giáo',
      'Historical Site': 'Di Tích Lịch Sử',
      'Cultural Site': 'Địa Điểm Văn Hóa',
      'Craft Village': 'Làng Nghề',
      'Cultural Venue': 'Trung Tâm Văn Hóa',
      'Museum': 'Bảo Tàng',
      'Archaeological Site': 'Di Tích Khảo Cổ',
      'Nature & Leisure': 'Thiên Nhiên & Giải Trí',
      'Nature Reserve': 'Khu bảo tồn thiên nhiên',
      'Ecotourism Site': 'Khu du lịch sinh thái'
    };
    return categoryNamesVi[category] || category;
  }
  return category;
}

function renderLocationsList() {
  try {
    const grid = document.getElementById('locations-grid');
    if (!grid) return;

    const filteredLocations = currentCategory === 'all'
      ? locations
      : currentCategory === 'Nature & Leisure'
        ? locations.filter(loc => loc.category === 'Nature Reserve' || loc.category === 'Ecotourism Site')
        : locations.filter(loc => loc.category === currentCategory);

    grid.innerHTML = filteredLocations.map(location => {
      const imagePath = location.image ? encodeURI(`../image list png/places png/${location.image}`) : '';
      const imageHtml = location.image
        ? `
          <div style="margin-bottom: 12px; text-align: center;">
            <img src="${imagePath}"
                 alt="${location.name}"
                 style="width: 100%; max-height: 120px; border-radius: 8px; object-fit: cover;"
                 onerror="this.style.display='none';">
          </div>`
        : '';

      const isDongHo = location.name === 'Làng tranh Đông Hồ' || location.name === 'Dong Ho Village';
      const externalUrl = 'http://localhost:8000/Giaodien/tranhdongho/dongho-village.html';
      const titleHtml = isDongHo
        ? `<a href="${externalUrl}" style="color: inherit; text-decoration: none;">${location.name}</a>`
        : `${location.name}`;

      return `
        <div class="location-card" data-category="${location.category}">
          ${imageHtml}
          <h3>${titleHtml}</h3>
          <div class="location-category">${getCategoryName(location.category)}</div>
          <div class="location-address">📍 ${location.address}</div>
          <div class="location-description">${location.description}</div>
          <div class="location-details">
            <div class="location-detail"><span>🕐</span><span>${location.openingHours}</span></div>
            <div class="location-detail"><span>🎫</span><span>${location.ticketInfo}</span></div>
            <div class="location-detail"><span>♿</span><span>${location.accessibility}</span></div>
          </div>
          <div class="location-coordinates">🗺️ ${location.lat}°N, ${location.lng}°E</div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error rendering locations list:', error);
  }
}

function setupEventListeners() {
  try {
    const navbarEl = document.getElementById('navbar') || document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenuEl = document.getElementById('navMenu');
    const mapLink = document.getElementById('i18n-nav-map');
    const gameLink = document.getElementById('i18n-nav-game');



    if (navbarEl) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          navbarEl.classList.add('scrolled');
        } else {
          navbarEl.classList.remove('scrolled');
        }
      });
    }

    if (mobileToggle && navMenuEl) {
      mobileToggle.addEventListener('click', () => {
        navMenuEl.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        const lines = mobileToggle.querySelectorAll('.toggle-line');
        if (mobileToggle.classList.contains('active')) {
          if (lines[0]) lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (lines[1]) lines[1].style.opacity = '0';
          if (lines[2]) lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          if (lines[0]) lines[0].style.transform = 'none';
          if (lines[1]) lines[1].style.opacity = '1';
          if (lines[2]) lines[2].style.transform = 'none';
        }
      });

      document.addEventListener('click', (e) => {
        if (navMenuEl.classList.contains('active')) {
          const insideMenu = navMenuEl.contains(e.target);
          const insideToggle = mobileToggle.contains(e.target);
          if (!insideMenu && !insideToggle) {
            navMenuEl.classList.remove('active');
            mobileToggle.classList.remove('active');
            const lines = mobileToggle.querySelectorAll('.toggle-line');
            if (lines[0]) lines[0].style.transform = 'none';
            if (lines[1]) lines[1].style.opacity = '1';
            if (lines[2]) lines[2].style.transform = 'none';
          }
        }
      });
    }
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

    // Smooth scrolling for anchor links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Location card click -> focus on map
    document.addEventListener('click', function(e) {
      const card = e.target.closest('.location-card');
      if (card && map) {
        const locationName = card.querySelector('h3').textContent;
        const location = locations.find(loc => loc.name === locationName);
        if (location) {
          map.setView([location.lat, location.lng], 16);
          const marker = markers.find(m =>
            Math.abs(m.getLatLng().lat - location.lat) < 0.001 &&
            Math.abs(m.getLatLng().lng - location.lng) < 0.001
          );
          marker?.openPopup();
        }
      }
    });

    // Language switchers
    const globeBtn = document.getElementById('globeBtn');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    globeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdown.classList.contains('show');
      if (isOpen) closeLangDropdown(); else openLangDropdown();
    });

    function openLangDropdown() {
      langDropdown.classList.add('show');
      globeBtn.setAttribute('aria-expanded', 'true');
    }
    function closeLangDropdown() {
      langDropdown.classList.remove('show');
      globeBtn.setAttribute('aria-expanded', 'false');
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-switcher')) closeLangDropdown();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langDropdown.classList.contains('show')) {
        closeLangDropdown();
        globeBtn.focus();
      }
    });

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

      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); option.click(); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const options = Array.from(langOptions);
          const idx = options.indexOf(option);
          const nextIdx = e.key === 'ArrowDown' ? (idx + 1) % options.length : (idx - 1 + options.length) % options.length;
          options[nextIdx].focus();
        }
      });
    });

    function updateActiveLang(lang) {
      langOptions.forEach(opt => opt.classList.toggle('active', opt.dataset.lang === lang));
    }
    updateActiveLang(currentLanguage);

    const navDropdown = document.querySelector('.nav-item.dropdown');
    const navGameTrigger = navDropdown ? navDropdown.querySelector('#i18n-nav-game') : null;
    const navDropdownMenu = navDropdown ? navDropdown.querySelector('.dropdown-menu') : null;
    if (navGameTrigger && navDropdownMenu) {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.dropdown')) navDropdownMenu.classList.remove('show');
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

// Scroll animations
function setupCardObserver() {
  setTimeout(() => {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.location-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }, 1000);
}
