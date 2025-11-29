let currentTheme = localStorage.getItem('theme') || 'dark';

function setTheme(theme, rerender = false) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    const logo = document.getElementById('header-logo');

    if (icon && label) {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
        label.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }

    if (logo) {
        logo.src = theme === 'dark' ? 'assets/logo-dark.svg' : 'assets/logo-light.svg';
    }

    if (rerender && typeof renderAllCharts === 'function') {
        renderAllCharts();
    }
}

function toggleTheme() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
}

function getThemeConfig() {
    const isDark = currentTheme === 'dark';
    return {
        backgroundColor: 'transparent',
        textStyle: {
            color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
            fontFamily: 'Inter'
        },
        title: {
            textStyle: { color: isDark ? '#fff' : '#1a1f2e', fontWeight: 600 },
            subtextStyle: { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }
        },
        legend: {
            textStyle: { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }
        },
        tooltip: {
            backgroundColor: isDark ? 'rgba(26, 31, 46, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: 'rgba(0, 188, 212, 0.3)',
            borderWidth: 1,
            textStyle: { color: isDark ? '#fff' : '#1a1f2e', fontSize: 12 },
            extraCssText: 'box-shadow: 0 8px 32px ' + (isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)') + '; border-radius: 10px; padding: 10px 14px;'
        },
        axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } },
        axisLabel: { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' },
        splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } }
    };
}

const colors = {
    primary: '#00bcd4',
    success: '#00c853',
    danger: '#ff1744',
    warning: '#ffab00',
    purple: '#7c4dff',
    regions: {
        'Asia': '#2196f3',
        'Europe': '#4caf50',
        'North America': '#ff9800',
        'Latin America': '#9c27b0',
        'Oceania': '#00bcd4',
        'Africa': '#e91e63'
    }
};

function adjustColor(hex, amount) {
    const clamp = (num) => Math.min(255, Math.max(0, num));
    hex = hex.replace('#', '');
    const num = parseInt(hex, 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00FF) + amount);
    const b = clamp((num & 0x0000FF) + amount);
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function formatNumber(num, decimals = 1) {
    if (num >= 1000) return (num / 1000).toFixed(decimals) + 'T';
    return num.toFixed(decimals) + 'B';
}

function getRegionClass(region) {
    return 'tag-' + region.toLowerCase().replace(/\s+/g, '-');
}

function navigateTo(url, params = {}) {
    const queryString = Object.keys(params).length
        ? '?' + new URLSearchParams(params).toString()
        : '';
    window.location.href = url + queryString;
}

function getUrlParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

const tradeData = {
    countries: [
        { name: 'United States', code: 'USA', export: 44.8, import: 13.9, region: 'North America', bloc: 'USMCA', yoyChange: 5.2, momChange: 2.1, lat: 37.09, lng: -95.71 },
        { name: 'Japan', code: 'JPN', export: 14.2, import: 14.2, region: 'Asia', bloc: 'RCEP', yoyChange: -1.5, momChange: 0.8, lat: 36.20, lng: 138.25 },
        { name: 'South Korea', code: 'KOR', export: 12.8, import: 14.8, region: 'Asia', bloc: 'RCEP', yoyChange: 3.2, momChange: -0.5, lat: 35.91, lng: 127.77 },
        { name: 'Vietnam', code: 'VNM', export: 8.9, import: 5.9, region: 'Asia', bloc: 'ASEAN', yoyChange: 8.5, momChange: 1.2, lat: 14.06, lng: 108.28 },
        { name: 'Germany', code: 'DEU', export: 8.5, import: 13.6, region: 'Europe', bloc: 'EU', yoyChange: -2.1, momChange: -0.3, lat: 51.17, lng: 10.45 },
        { name: 'Australia', code: 'AUS', export: 5.8, import: 13.1, region: 'Oceania', bloc: 'RCEP', yoyChange: 4.8, momChange: 1.5, lat: -25.27, lng: 133.78 },
        { name: 'Taiwan', code: 'TWN', export: 6.2, import: 18.1, region: 'Asia', bloc: 'Other', yoyChange: 2.3, momChange: 0.9, lat: 23.69, lng: 121.0 },
        { name: 'Malaysia', code: 'MYS', export: 6.5, import: 5.9, region: 'Asia', bloc: 'ASEAN', yoyChange: 6.1, momChange: 0.4, lat: 4.21, lng: 101.98 },
        { name: 'Russia', code: 'RUS', export: 8.4, import: 9.8, region: 'Europe', bloc: 'BRICS', yoyChange: 12.3, momChange: 2.8, lat: 61.52, lng: 105.32 },
        { name: 'Brazil', code: 'BRA', export: 4.2, import: 11.4, region: 'Latin America', bloc: 'BRICS', yoyChange: 7.5, momChange: 1.1, lat: -14.24, lng: -51.93 },
        { name: 'Thailand', code: 'THA', export: 6.1, import: 5.1, region: 'Asia', bloc: 'ASEAN', yoyChange: 4.2, momChange: 0.6, lat: 15.87, lng: 100.99 },
        { name: 'India', code: 'IND', export: 7.5, import: 4.3, region: 'Asia', bloc: 'BRICS', yoyChange: 9.8, momChange: 1.8, lat: 20.59, lng: 78.96 },
        { name: 'Netherlands', code: 'NLD', export: 8.2, import: 2.0, region: 'Europe', bloc: 'EU', yoyChange: 1.5, momChange: 0.2, lat: 52.13, lng: 5.29 },
        { name: 'Singapore', code: 'SGP', export: 5.2, import: 4.6, region: 'Asia', bloc: 'ASEAN', yoyChange: 3.8, momChange: 0.7, lat: 1.35, lng: 103.82 },
        { name: 'United Kingdom', code: 'GBR', export: 6.8, import: 2.1, region: 'Europe', bloc: 'Other', yoyChange: -0.8, momChange: -0.2, lat: 55.38, lng: -3.44 },
        { name: 'South Africa', code: 'ZAF', export: 3.2, import: 2.8, region: 'Africa', bloc: 'BRICS', yoyChange: 2.1, momChange: 0.3, lat: -30.56, lng: 22.94 },
        { name: 'Indonesia', code: 'IDN', export: 7.2, import: 6.8, region: 'Asia', bloc: 'ASEAN', yoyChange: 5.4, momChange: 0.9, lat: -0.79, lng: 113.92 },
        { name: 'Mexico', code: 'MEX', export: 5.1, import: 4.2, region: 'North America', bloc: 'USMCA', yoyChange: 3.8, momChange: 0.5, lat: 23.63, lng: -102.55 },
        { name: 'Canada', code: 'CAN', export: 4.8, import: 3.9, region: 'North America', bloc: 'USMCA', yoyChange: 2.1, momChange: 0.3, lat: 56.13, lng: -106.35 },
        { name: 'France', code: 'FRA', export: 5.6, import: 4.8, region: 'Europe', bloc: 'EU', yoyChange: 1.2, momChange: 0.4, lat: 46.23, lng: 2.21 },
        { name: 'Italy', code: 'ITA', export: 4.9, import: 4.1, region: 'Europe', bloc: 'EU', yoyChange: 0.8, momChange: 0.2, lat: 41.87, lng: 12.57 },
        { name: 'Philippines', code: 'PHL', export: 4.5, import: 3.2, region: 'Asia', bloc: 'ASEAN', yoyChange: 6.2, momChange: 0.8, lat: 12.88, lng: 121.77 }
    ],
    blocs: [
        { name: 'ASEAN', fullName: 'Association of Southeast Asian Nations', export: 45.2, import: 32.8 },
        { name: 'EU', fullName: 'European Union', export: 35.8, import: 38.5 },
        { name: 'RCEP', fullName: 'Regional Comprehensive Economic Partnership', export: 38.5, import: 46.2 },
        { name: 'BRICS', fullName: 'Brazil, Russia, India, China, South Africa', export: 23.3, import: 28.3 },
        { name: 'USMCA', fullName: 'United States-Mexico-Canada Agreement', export: 54.7, import: 22.0 },
        { name: 'Other', fullName: 'Other Countries', export: 13.0, import: 20.2 }
    ],
    regions: [
        { name: 'Asia', export: 145.2, import: 140.2 },
        { name: 'Europe', export: 52.4, import: 46.2 },
        { name: 'North America', export: 52.1, import: 20.2 },
        { name: 'Latin America', export: 15.8, import: 22.7 },
        { name: 'Oceania', export: 8.5, import: 14.3 },
        { name: 'Africa', export: 9.2, import: 6.0 }
    ],
    monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        exports: [298.5, 252.4, 315.6, 292.5, 302.4, 308.2, 296.8, 308.6, 303.7, 309.1],
        imports: [218.6, 179.3, 222.8, 205.4, 219.7, 208.9, 201.3, 217.8, 215.5, 213.7],
        balance: [79.9, 73.1, 92.8, 87.1, 82.7, 99.3, 95.5, 90.8, 88.2, 95.4]
    },
    commodities: {
        exports: [
            { name: 'Machinery & Equipment', value: 89.5, code: '84' },
            { name: 'Electronics', value: 72.3, code: '85' },
            { name: 'Textiles & Apparel', value: 42.3, code: '61-62' },
            { name: 'Chemicals', value: 35.8, code: '28-38' },
            { name: 'Metals', value: 28.4, code: '72-83' },
            { name: 'Furniture & Toys', value: 22.1, code: '94-95' },
            { name: 'Plastics', value: 18.5, code: '39' },
            { name: 'Vehicles', value: 15.2, code: '87' }
        ],
        imports: [
            { name: 'Electronics & Semiconductors', value: 68.5, code: '85' },
            { name: 'Minerals & Energy', value: 52.4, code: '27' },
            { name: 'Agricultural Products', value: 28.6, code: '01-24' },
            { name: 'Chemicals', value: 22.3, code: '28-38' },
            { name: 'Machinery', value: 18.9, code: '84' },
            { name: 'Ores & Metals', value: 16.2, code: '26' },
            { name: 'Plastics', value: 12.8, code: '39' },
            { name: 'Medical Equipment', value: 8.5, code: '90' }
        ]
    }
};

function getCountryByCode(code) {
    return tradeData.countries.find(c => c.code === code);
}

function getCountriesByRegion(region) {
    return tradeData.countries.filter(c => c.region === region);
}

document.addEventListener('DOMContentLoaded', function() {
    setTheme(currentTheme, false);

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
