// Smart Bắc Ninh - Main JavaScript
class SmartBacNinh {
    constructor() {
        this.currentLanguage = 'vi';
        this.map = null;
        this.markers = [];
        this.init();
    }

    init() {
        this.initNavigation();
        this.initLanguageSwitcher();
        this.initScrollAnimations();
        this.initMap();
        this.initTimelineAnimations();
        this.initGalleryInteractions();
        this.initSmoothScrolling();
    }

    // Navigation functionality
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        // Scroll effect for navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                
                // Animate toggle lines
                const lines = mobileToggle.querySelectorAll('.toggle-line');
                if (mobileToggle.classList.contains('active')) {
                    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navMenu.classList.contains('active')) {
                if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    const lines = mobileToggle.querySelectorAll('.toggle-line');
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            }
        });

        // Active navigation link highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Language switcher functionality
    initLanguageSwitcher() {
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropdown.classList.toggle('active');
                langBtn.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                langDropdown.classList.remove('active');
                langBtn.classList.remove('active');
            });

            // Language selection
            langOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedLang = option.getAttribute('data-lang');
                    this.switchLanguage(selectedLang);
                    langDropdown.classList.remove('active');
                    langBtn.classList.remove('active');
                });
            });
        }
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Update language button text
        const langBtn = document.getElementById('langBtn');
        const langCurrent = langBtn.querySelector('.lang-current');
        if (langCurrent) {
            langCurrent.textContent = lang.toUpperCase();
        }

        // Update active language option
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-lang') === lang);
        });

        // Update page content
        this.updatePageContent(lang);
    }

    updatePageContent(lang) {
        const translations = {
            vi: {
                'nav.home': 'Trang Chủ',
                'nav.heritage': 'Di Sản',
                'nav.culture': 'Văn Hóa',
                'nav.sites': 'Địa Danh',
                'nav.map': 'Bản Đồ',
                'hero.title': 'Bắc Ninh',
                'hero.subtitle': 'Cội Nguồn Di Sản',
                'hero.description': 'Khám phá vùng đất cổ kính nơi lưu giữ tinh hoa văn hóa Việt - từ dân ca Quan họ được UNESCO công nhận đến tranh Đông Hồ tinh xảo và những ngôi chùa nghìn năm tuổi.',
                'hero.explore': 'Khám Phá Di Sản',
                'hero.map': 'Xem Bản Đồ',
                'hero.scroll': 'Cuộn xuống',
                'heritage.title': 'Di Sản Văn Hóa',
                'heritage.subtitle': 'Những viên ngọc quý của Bắc Ninh được UNESCO vinh danh',
                'heritage.quanho.title': 'Dân Ca Quan Họ',
                'heritage.quanho.description': 'Di sản văn hóa phi vật thể được UNESCO công nhận năm 2009, biểu tượng của tình yêu và nghệ thuật hát đối đặc sắc.',
                'heritage.dongho.title': 'Tranh Đông Hồ',
                'heritage.dongho.description': 'Nghệ thuật in khắc gỗ truyền thống với hơn 500 năm lịch sử, phản ánh đợi sống và tín ngưỡng của ngườ Việt.',
                'heritage.pagodas.title': 'Chùa Cổ Bắc Ninh',
                'heritage.pagodas.description': 'Hệ thống chùa cổ với kiến trúc độc đáo: chùa Dâu, chùa Bút Tháp, chùa Phật Tích - những viên ngọc Phật giáo.',
                'heritage.learnmore': 'Tìm hiểu thêm',
                'heritage.craft': 'Làng Nghề',
                'heritage.religious': 'Tôn Giáo',
                'culture.title': 'Hành Trình Văn Hóa',
                'culture.subtitle': 'Dấu ấn thờ gian qua các triều đại',
                'culture.ly.title': 'Thờ kỳ Lý Dynasty',
                'culture.ly.description': 'Chùa Phật Tích được xây dựng, đánh dấu sự phát triển của Phật giáo tại Bắc Ninh.',
                'culture.quanho.origin.title': 'Sơ kỳ Quan Họ',
                'culture.quanho.origin.description': 'Dân ca Quan họ bắt đầu hình thành và phát triển trong các làng xã Bắc Ninh.',
                'culture.dongho.origin.title': 'Kỳ nguyên Đông Hồ',
                'culture.dongho.origin.description': 'Tranh Đông Hồ ra đờ tại làng Đông Hồ, trở thành nghề in khắc gỗ nổi tiếng.',
                'culture.unesco.title': 'UNESCO Vinh Danh',
                'culture.unesco.description': 'Quan họ Bắc Ninh được UNESCO công nhận là Di sản Văn hóa Phi vật thể của Nhân loại.',
                'sites.title': 'Địa Danh Nổi Tiếng',
                'sites.subtitle': 'Những điểm đến không thể bỏ lỡ tại Bắc Ninh',
                'sites.butthap.title': 'Chùa Bút Tháp',
                'sites.butthap.description': 'Kiệt tác kiến trúc Phật giáo với tháp Bảo Nghiêm',
                'sites.architecture.title': 'Kiến Trúc Cổ',
                'sites.architecture.description': 'Nghệ thuật chạm khắc gỗ tinh xảo',
                'sites.quanho.title': 'Quan Họ',
                'sites.quanho.description': 'Nghệ thuật hát đối truyền thống',
                'sites.dongho.title': 'Làng Tranh',
                'sites.dongho.description': 'Nghệ thuật in khắc truyền thống',
                'map.title': 'Bản Đồ Văn Hóa',
                'map.subtitle': 'Khám phá các điểm di sản trên bản đồ tương tác',
                'map.filter.all': 'Tất Cả',
                'map.filter.pagoda': 'Chùa',
                'map.filter.village': 'Làng Nghề',
                'map.filter.heritage': 'Di Sản',
                'footer.description': 'Khám phá và bảo tồn di sản văn hóa Bắc Ninh trong kỷ nguyên số.',
                'footer.explore': 'Khám Phá',
                'footer.heritage': 'Di Sản',
                'footer.culture': 'Văn Hóa',
                'footer.sites': 'Địa Danh',
                'footer.learn': 'Tìm Hiểu',
                'footer.history': 'Lịch Sử',
                'footer.traditions': 'Phong Tục',
                'footer.arts': 'Nghệ Thuật',
                'footer.connect': 'Kết Nối',
                'footer.copyright': '© 2024 Smart Bắc Ninh. Bảo lưu mọi quyền.',
                'footer.note': 'Website được phát triển nhằm mục đích giáo dục và bảo tồn di sản văn hóa.'
            },
            en: {
                'nav.home': 'Home',
                'nav.heritage': 'Heritage',
                'nav.culture': 'Culture',
                'nav.sites': 'Sites',
                'nav.map': 'Map',
                'hero.title': 'Bac Ninh',
                'hero.subtitle': 'Heritage Origins',
                'hero.description': 'Discover the ancient land that preserves the essence of Vietnamese culture - from UNESCO-recognized Quan ho folk songs to exquisite Dong Ho paintings and thousand-year-old pagodas.',
                'hero.explore': 'Explore Heritage',
                'hero.map': 'View Map',
                'hero.scroll': 'Scroll Down',
                'heritage.title': 'Cultural Heritage',
                'heritage.subtitle': 'The treasured gems of Bac Ninh honored by UNESCO',
                'heritage.quanho.title': 'Quan Ho Folk Songs',
                'heritage.quanho.description': 'Intangible Cultural Heritage recognized by UNESCO in 2009, a symbol of love and distinctive call-and-response singing art.',
                'heritage.dongho.title': 'Dong Ho Paintings',
                'heritage.dongho.description': 'Traditional woodblock printing art with over 500 years of history, reflecting Vietnamese life and beliefs.',
                'heritage.pagodas.title': 'Ancient Bac Ninh Pagodas',
                'heritage.pagodas.description': 'System of ancient pagodas with unique architecture: Dau Pagoda, But Thap Pagoda, Phat Tich Pagoda - Buddhist gems.',
                'heritage.learnmore': 'Learn More',
                'heritage.craft': 'Craft Village',
                'heritage.religious': 'Religious',
                'culture.title': 'Cultural Journey',
                'culture.subtitle': 'Time marks through dynasties',
                'culture.ly.title': 'Ly Dynasty Period',
                'culture.ly.description': 'Phat Tich Pagoda was built, marking the development of Buddhism in Bac Ninh.',
                'culture.quanho.origin.title': 'Early Quan Ho Period',
                'culture.quanho.origin.description': 'Quan ho folk songs began to form and develop in Bac Ninh villages.',
                'culture.dongho.origin.title': 'Dong Ho Era',
                'culture.dongho.origin.description': 'Dong Ho paintings originated in Dong Ho village, becoming famous woodblock printing craft.',
                'culture.unesco.title': 'UNESCO Recognition',
                'culture.unesco.description': 'Bac Ninh Quan ho was recognized by UNESCO as Intangible Cultural Heritage of Humanity.',
                'sites.title': 'Famous Sites',
                'sites.subtitle': 'Must-visit destinations in Bac Ninh',
                'sites.butthap.title': 'But Thap Pagoda',
                'sites.butthap.description': 'Buddhist architectural masterpiece with Bao Nghiem Tower',
                'sites.architecture.title': 'Ancient Architecture',
                'sites.architecture.description': 'Exquisite wood carving art',
                'sites.quanho.title': 'Quan Ho',
                'sites.quanho.description': 'Traditional call-and-response singing art',
                'sites.dongho.title': 'Painting Village',
                'sites.dongho.description': 'Traditional woodblock printing art',
                'map.title': 'Cultural Map',
                'map.subtitle': 'Explore heritage sites on interactive map',
                'map.filter.all': 'All',
                'map.filter.pagoda': 'Pagoda',
                'map.filter.village': 'Craft Village',
                'map.filter.heritage': 'Heritage',
                'footer.description': 'Discover and preserve Bac Ninh cultural heritage in the digital age.',
                'footer.explore': 'Explore',
                'footer.heritage': 'Heritage',
                'footer.culture': 'Culture',
                'footer.sites': 'Sites',
                'footer.learn': 'Learn',
                'footer.history': 'History',
                'footer.traditions': 'Traditions',
                'footer.arts': 'Arts',
                'footer.connect': 'Connect',
                'footer.copyright': '© 2024 Smart Bac Ninh. All rights reserved.',
                'footer.note': 'Website developed for educational and cultural heritage preservation purposes.'
            }
        };

        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    // Scroll animations
    initScrollAnimations() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }

        // Custom scroll animations for elements not using AOS
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Observe elements with custom animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize map
    initMap() {
        if (typeof L !== 'undefined') {
            // Initialize Leaflet map centered on Bac Ninh
            this.map = L.map('cultural-map').setView([21.0530, 106.0668], 11);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            // Cultural sites data
            const sites = [
                {
                    name: 'Chùa Bút Tháp',
                    nameEn: 'But Thap Pagoda',
                    lat: 21.0094,
                    lng: 105.9983,
                    type: 'pagoda',
                    description: 'Kiệt tác kiến trúc Phật giáo với tháp Bảo Nghiêm',
                    descriptionEn: 'Buddhist architectural masterpiece with Bao Nghiem Tower'
                },
                {
                    name: 'Chùa Phật Tích',
                    nameEn: 'Phat Tich Pagoda',
                    lat: 21.0833,
                    lng: 106.1000,
                    type: 'pagoda',
                    description: 'Ngôi chùa cổ với tượng Phật bằng đá xanh',
                    descriptionEn: 'Ancient pagoda with green stone Buddha statue'
                },
                {
                    name: 'Làng Tranh Đông Hồ',
                    nameEn: 'Dong Ho Painting Village',
                    lat: 21.0167,
                    lng: 106.0667,
                    type: 'village',
                    description: 'Làng nghề in tranh khắc gỗ truyền thống',
                    descriptionEn: 'Traditional woodblock painting craft village'
                },
                {
                    name: 'Làng Hồ Quan Họ',
                    nameEn: 'Quan Ho Folk Village',
                    lat: 21.0667,
                    lng: 106.0333,
                    type: 'heritage',
                    description: 'Cội nguồn dân ca Quan họ Bắc Ninh',
                    descriptionEn: 'Origin of Bac Ninh Quan ho folk songs'
                },
                {
                    name: 'Chùa Dâu',
                    nameEn: 'Dau Pagoda',
                    lat: 21.0167,
                    lng: 106.0333,
                    type: 'pagoda',
                    description: 'Ngôi chùa cổ nhất Việt Nam',
                    descriptionEn: 'The oldest pagoda in Vietnam'
                },
                {
                    name: 'Làng Gốm Phù Lãng',
                    nameEn: 'Phu Lang Pottery Village',
                    lat: 21.1000,
                    lng: 106.0667,
                    type: 'village',
                    description: 'Làng nghề gốm truyền thống nổi tiếng',
                    descriptionEn: 'Famous traditional pottery village'
                }
            ];

            // Add markers to map
            sites.forEach(site => {
                const marker = L.marker([site.lat, site.lng]).addTo(this.map);
                
                const popupContent = `
                    <div class="map-popup">
                        <h3>${this.currentLanguage === 'vi' ? site.name : site.nameEn}</h3>
                        <p>${this.currentLanguage === 'vi' ? site.description : site.descriptionEn}</p>
                        <span class="popup-type">${site.type}</span>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                marker.siteType = site.type;
                this.markers.push(marker);
            });

            // Map filter functionality
            const filterButtons = document.querySelectorAll('.map-control-btn');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active button
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filter = btn.getAttribute('data-filter');
                    this.filterMapMarkers(filter);
                });
            });
        }
    }

    filterMapMarkers(filter) {
        this.markers.forEach(marker => {
            if (filter === 'all' || marker.siteType === filter) {
                marker.addTo(this.map);
            } else {
                this.map.removeLayer(marker);
            }
        });
    }

    // Timeline animations
    initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = item.classList.contains('fade-left') ? 'translateX(-50px)' : 'translateX(50px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }

    // Gallery interactions
    initGalleryInteractions() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Add click animation
                item.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);

                // Show detailed information (placeholder)
                const title = item.querySelector('.gallery-title').textContent;
                const description = item.querySelector('.gallery-description').textContent;
                
                // Create modal or detailed view (simplified version)
                this.showGalleryDetail(title, description);
            });
        });
    }

    showGalleryDetail(title, description) {
        // Simple alert for now - in a full implementation, this would be a modal
        alert(`${title}\n\n${description}\n\nChi tiết hơn sẽ được hiển thị trong cửa sổ modal.`);
    }

    // Smooth scrolling
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance optimization
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                if (img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SmartBacNinh();
    
    // Add loading animation
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartBacNinh;
}