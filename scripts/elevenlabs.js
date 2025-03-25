// Function to add toggle button that stays visible
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the widget to load
    setTimeout(function() {
        setupToggleButton();
    }, 1500);
});

function setupToggleButton() {
    const widget = document.querySelector('elevenlabs-convai');
    if (!widget) return;
    
    // Create toggle button if it doesn't exist
    let toggleButton = document.querySelector('.elevenlabs-toggle');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.className = 'elevenlabs-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle ElevenLabs widget');
        toggleButton.innerHTML = '×';
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 30px;
            height: 30px;
            background-color: var(--primary-color, #55aeb7);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            z-index: 1001;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(toggleButton);
        
        // Load initial state
        if (localStorage.getItem('elevenlabsWidgetHidden') === 'true') {
            widget.style.display = 'none';
            toggleButton.innerHTML = '+';
        }
        
        // Toggle functionality
        toggleButton.addEventListener('click', function() {
            const isHidden = widget.style.display === 'none';
            
            if (isHidden) {
                // Show the widget
                widget.style.display = '';
                toggleButton.innerHTML = '×';
                localStorage.setItem('elevenlabsWidgetHidden', 'false');
            } else {
                // Hide the widget
                widget.style.display = 'none';
                toggleButton.innerHTML = '+';
                localStorage.setItem('elevenlabsWidgetHidden', 'true');
            }
        });
    }
}

// Add event listener for widget interactions
document.addEventListener('click', function(e) {
    if (e.target.closest('elevenlabs-convai')) {
        setupToggleButton();
    }
});