// EMERGENCY FIX - Copy this entire code and paste it into browser console
// This will immediately fix the modal close issue

(function() {
    console.log('🔧 Applying modal fix...');
    
    // Override the broken functions
    window.showModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal-hidden');
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            console.log('✅ Modal opened:', modalId);
        }
    };
    
    window.hideModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('modal-hidden');
            modal.classList.add('hidden');
            modal.style.display = 'none';
            
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) form.reset();
            
            console.log('✅ Modal closed:', modalId);
        }
    };
    
    // Add ESC key listener
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('[id$="Modal"]');
            modals.forEach(modal => {
                if (!modal.classList.contains('modal-hidden') && !modal.classList.contains('hidden')) {
                    window.hideModal(modal.id);
                }
            });
        }
    });
    
    // Add click outside listener
    document.addEventListener('click', function(e) {
        if (e.target.id && e.target.id.endsWith('Modal')) {
            window.hideModal(e.target.id);
        }
    });
    
    console.log('✅ Modal fix applied! Try closing the modal now.');
    console.log('📝 Functions overridden: showModal(), hideModal()');
    console.log('⌨️  ESC key and click-outside listeners added');
})();
