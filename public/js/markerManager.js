class MarkerManager {
    constructor(map, legendManager) {
      this.map = map;
      this.legendManager = legendManager;
      this.markers = [];
      this.rightClickedMarker = null;
    }

    createMarker(latlng, type) {
      const legendData = this.legendManager.legendItems[type];
      const { color, shape } = legendData;
      let marker;

      switch (shape) {
        case 'circle':
          marker = this.createCircleMarker(latlng, color);
          break;
        case 'square':
          marker = this.createSquareMarker(latlng, color);
          break;
        case 'triangle':
          marker = this.createTriangleMarker(latlng, color);
          break;
        case 'xmark':
          marker = this.createXMarkMarker(latlng, color);
          break;
        case 'custom':
          marker = this.createCustomIconMarker(latlng, legendData.customIcon);
          break;
        default:
          return;
      }

      marker.addTo(this.map).bindPopup(`<strong>${type}</strong><br>Click for options`);
      
      marker.on('contextmenu', (e) => {
        e.originalEvent.preventDefault();
        this.showContextMenu(e.originalEvent, marker, type);
      });

      this.markers.push({ leafletObj: marker, type });
    }

    createCircleMarker(latlng, color) {
    return L.circleMarker(latlng, {
        color,
        fillColor: color,
        fillOpacity: 1,
        radius: 8,
        weight: 2
    });
    }

    createSquareMarker(latlng, color) {
    const size = 12; // 12px square
    const icon = L.divIcon({
        className: '',
        html: `<div style="width: ${size}px; height: ${size}px; background: ${color};
                    box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
    return L.marker(latlng, { icon });
    }

    createTriangleMarker(latlng, color) {
    const icon = L.divIcon({
        className: '',
        html: `<div style="width: 0; height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 17px solid ${color};
                    filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));"></div>`,
        iconSize: [20, 17],
        iconAnchor: [10, 8.5]
    });
    return L.marker(latlng, { icon });
    }

    createCustomIconMarker(latlng, iconData) {
      const icon = L.icon({
        iconUrl: iconData,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
        className: 'custom-marker-icon'
      });
      return L.marker(latlng, { icon });
    }

    createXMarkMarker(latlng, color) {
    const icon = L.divIcon({
        className: '',
        html: `<div style="position: relative; width: 18px; height: 18px;
                        filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));">
                <div style="position: absolute; width: 18px; height: 2px; background: ${color};
                            transform: rotate(45deg); top: 8px; left: 0; border-radius: 1px;"></div>
                <div style="position: absolute; width: 18px; height: 2px; background: ${color};
                            transform: rotate(-45deg); top: 8px; left: 0; border-radius: 1px;"></div>
            </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });
    return L.marker(latlng, { icon });
    }

    showContextMenu(event, markerObj, type) {
      this.rightClickedMarker = { markerObj, type };
      const menu = document.getElementById('marker-menu');
      menu.style.top = event.clientY + "px";
      menu.style.left = event.clientX + "px";
      menu.style.display = 'block';
    }

    deleteSingleMarker() {
      if (this.rightClickedMarker) {
        const { markerObj } = this.rightClickedMarker;
        this.map.removeLayer(markerObj);
        const index = this.markers.findIndex(m => m.leafletObj === markerObj);
        if (index !== -1) {
          this.markers.splice(index, 1);
          uiManager.showMessage("Marker deleted successfully!", 'success');
        }
      }
      this.rightClickedMarker = null;
    }

    deleteAllMarkersOfType() {
      if (this.rightClickedMarker) {
        const type = this.rightClickedMarker.type;
        const markersOfType = this.markers.filter(m => m.type === type);
        
        markersOfType.forEach(m => this.map.removeLayer(m.leafletObj));
        
        for (let i = this.markers.length - 1; i >= 0; i--) {
          if (this.markers[i].type === type) {
            this.markers.splice(i, 1);
          }
        }
        
        uiManager.showMessage(`All "${type}" markers deleted successfully!`, 'success');
      }
      this.rightClickedMarker = null;
    }

    clearAllMarkers() {
    this.markers.forEach(marker => {
        this.map.removeLayer(marker.leafletObj);
    });
    
    this.markers = [];
    
    uiManager.showMessage("All markers cleared successfully!", 'success');
    }
  }