class LegendManager {
    constructor() {
      this.legendItems = {};
      this.uploadedIcon = null;
    }

    createNewLegend() {
      const name = document.getElementById('new-legend-name').value.trim();
      const shape = document.getElementById('shape-select').value;
      const color = document.getElementById('color-picker').value;

      if (!this.validateInput(name, shape, color)) return;
      if (this.legendItems[name]) {
        uiManager.showMessage("Legend with this name already exists!", 'error');
        return;
      }

      const legendData = { color, shape };
      
      // Add custom icon data if it's a custom shape
      if (shape === 'custom' && this.uploadedIcon) {
        legendData.customIcon = this.uploadedIcon;
      }

      this.legendItems[name] = legendData;
      this.updateLegendUI();
      this.clearForm();
      uiManager.showMessage(`Legend "${name}" created successfully!`, 'success');
    }

    validateInput(name, shape, color) {
      if (!name || !shape) {
        uiManager.showMessage("Please fill in name and shape fields.", 'error');
        return false;
      }
      
      if (shape === 'custom' && !this.uploadedIcon) {
        uiManager.showMessage("Please upload a custom icon.", 'error');
        return false;
      }
      
      return true;
    }

    toggleCustomIconUpload(show) {
      const customGroup = document.getElementById('custom-icon-group');
      const colorGroup = document.getElementById('color-picker').parentElement;
      
      if (show) {
        customGroup.style.display = 'block';
        colorGroup.style.display = 'none';
      } else {
        customGroup.style.display = 'none';
        colorGroup.style.display = 'block';
        this.uploadedIcon = null;
        document.getElementById('icon-preview').innerHTML = '';
      }
    }

    handleIconUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        uiManager.showMessage("Please upload a valid image file.", 'error');
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        uiManager.showMessage("Image file must be smaller than 2MB.", 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedIcon = e.target.result;
        this.showIconPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    showIconPreview(iconData) {
      const preview = document.getElementById('icon-preview');
      preview.innerHTML = `
        <div class="icon-preview-container">
          <img src="${iconData}" class="icon-preview" alt="Icon preview" />
          <span style="font-size: 12px; color: #666;">Preview</span>
        </div>
      `;
    }

    updateLegendUI() {
      this.updateLegendDisplay();
      this.updateLegendSelect();
    }

    updateLegendDisplay() {
      const container = document.getElementById('legend-items');
      container.innerHTML = '';

      if (Object.keys(this.legendItems).length === 0) {
        container.innerHTML = '<div class="empty-state">No legend items yet. Create some legends to get started!</div>';
        return;
      }

      for (const [name, item] of Object.entries(this.legendItems)) {
        const div = document.createElement('div');
        div.className = 'legend-item';
        
        const shapeDiv = document.createElement('span');
        
        if (item.shape === 'custom' && item.customIcon) {
          shapeDiv.className = 'legend-shape';
          shapeDiv.innerHTML = `<img src="${item.customIcon}" class="shape-custom" alt="${name}" />`;
        } else {
          shapeDiv.className = `legend-shape shape-${item.shape}`;
          shapeDiv.style.color = item.color;
        }

        const textSpan = document.createElement('span');
        textSpan.textContent = name;

        div.appendChild(shapeDiv);
        div.appendChild(textSpan);
        container.appendChild(div);
      }
    }

    updateLegendSelect() {
      const select = document.getElementById('legend-select');
      select.innerHTML = '<option value="">-- Select legend to place markers --</option>';

      for (const name of Object.keys(this.legendItems)) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      }
    }

    clearForm() {
      document.getElementById('new-legend-name').value = '';
      document.getElementById('shape-select').value = '';
      document.getElementById('color-picker').value = '#4CAF50';
      document.getElementById('icon-upload').value = '';
      document.getElementById('icon-preview').innerHTML = '';
      this.uploadedIcon = null;
      this.toggleCustomIconUpload(false);
    }

    resetAllLegends() {
    if (Object.keys(this.legendItems).length === 0) {
        uiManager.showMessage("No legends to reset.", 'error');
        return;
    }
    
    if (confirm("Are you sure you want to delete all legends? This will also clear all markers.")) {
        markerManager.clearAllMarkers();
        
        this.legendItems = {};
        this.uploadedIcon = null;
        
        this.updateLegendUI();
        this.clearForm();
        
        uiManager.showMessage("All legends reset successfully!", 'success');
    }
    }
  }