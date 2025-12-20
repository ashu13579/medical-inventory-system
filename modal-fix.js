// Modal Fix - Ensures modals close properly
(function() {
    // Override hideModal to ensure display:none is set
    const originalHideModal = window.hideModal;
    window.hideModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('modal-hidden');
            modal.style.display = 'none';
        }
    };
    
    // Override showModal to ensure display:flex is set
    const originalShowModal = window.showModal;
    window.showModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal-hidden');
            modal.style.display = 'flex';
        }
    };
    
    // Add click outside to close functionality
    document.addEventListener('click', function(e) {
        if (e.target.id === 'productModal') {
            window.hideModal('productModal');
        }
    });
    
    // Add ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('productModal');
            if (modal && !modal.classList.contains('modal-hidden')) {
                window.hideModal('productModal');
            }
        }
    });
})();
