class InteractiveMap {
  constructor() {
    this.map = null;
    this.legendManager = null;
    this.markerManager = null;
    this.uiManager = null;
    this.currentTileLayer = null; // Track current tile layer
    this.init();
  }

  init() {
    this.initializeMap();
    this.legendManager = new LegendManager();
    this.markerManager = new MarkerManager(this.map, this.legendManager);
    this.uiManager = new UIManager();
    this.bindEvents();
  }

  initializeMap() {
    this.map = L.map('map').setView([-6.2, 106.8], 10);
    
    // Store the initial tile layer
    this.currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  // Fixed changeMapStyle method
  changeMapStyle(styleType) {
    // Remove current tile layer
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }
    
    // Map style configurations
    const mapStyles = {
      topographic: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA'
      },
      openstreetmap: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
      },
      satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      },
      dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      },
    };
    
    // Add new tile layer and store reference
    const selectedStyle = mapStyles[styleType];
    if (selectedStyle) {
      this.currentTileLayer = L.tileLayer(selectedStyle.url, {
        attribution: selectedStyle.attribution,
        maxZoom: 19
      }).addTo(this.map);
      
      this.uiManager.showMessage(`Map style changed to ${styleType}`, 'success');
    } else {
      this.uiManager.showMessage(`Unknown map style: ${styleType}`, 'error');
    }
  }

  bindEvents() {
    this.map.on('click', (e) => {
      const selectedType = document.getElementById('legend-select').value;
      if (!selectedType || !this.legendManager.legendItems[selectedType]) {
        this.uiManager.showMessage("Please select a legend type first.", 'error');
        return;
      }
      this.markerManager.createMarker(e.latlng, selectedType);
    });

    // Hide context menu on click
    document.addEventListener('click', () => {
      document.getElementById('marker-menu').style.display = 'none';
    });

    // Shape selection change handler
    document.getElementById('shape-select').addEventListener('change', (e) => {
      this.legendManager.toggleCustomIconUpload(e.target.value === 'custom');
    });

    // Icon upload handler
    document.getElementById('icon-upload').addEventListener('change', (e) => {
      this.legendManager.handleIconUpload(e);
    });

    // Map style change handler (add this if you have a select element for map styles)
    const mapStyleSelect = document.getElementById('map-style-select');
    if (mapStyleSelect) {
      mapStyleSelect.addEventListener('change', (e) => {
        this.changeMapStyle(e.target.value);
      });
    }
  }
}