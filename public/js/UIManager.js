class UIManager {
    showMessage(message, type = 'success') {
      const messageEl = document.getElementById('status-message');
      messageEl.textContent = message;
      messageEl.className = `status-message status-${type}`;
      messageEl.style.display = 'block';

      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 3000);
    }
  }

    async function takeMapScreenshot() {
    try {
        document.querySelector('.legend-controls').style.display = 'none';
        
        const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: false,
        scale: 2
        });
        
        document.querySelector('.legend-controls').style.display = 'block';
        
        const link = document.createElement('a');
        link.download = `map-screenshot-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
    } catch (error) {
        uiManager.showMessage("Screenshot failed. Please try again.", 'error');
    }
    }

  let app, legendManager, markerManager, uiManager;

  document.addEventListener('DOMContentLoaded', () => {
    app = new InteractiveMap();
    legendManager = app.legendManager;
    markerManager = app.markerManager;
    uiManager = app.uiManager;
  });