// Modal Fix - Ensures modals close properly
// Add this script to index.html before </body>: <script src="modal-fix.js"></script>

(function() {
    console.log('Modal fix loaded');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModalFix);
    } else {
        initModalFix();
    }
    
    function initModalFix() {
        // Override hideModal globally
        window.hideModal = function(modalId) {
            console.log('Hiding modal:', modalId);
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('modal-hidden');
                modal.style.display = 'none';
            }
        };
        
        // Override showModal globally
        window.showModal = function(modalId) {
            console.log('Showing modal:', modalId);
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('modal-hidden');
                modal.style.display = 'flex';
            }
        };
        
        // Add click outside to close functionality
        document.addEventListener('click', function(e) {
            if (e.target.id === 'productModal' && e.target.classList.contains('fixed')) {
                console.log('Clicked outside modal');
                window.hideModal('productModal');
            }
        });
        
        // Add ESC key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('productModal');
                if (modal && !modal.classList.contains('modal-hidden')) {
                    console.log('ESC pressed, closing modal');
                    window.hideModal('productModal');
                }
            }
        });
        
        console.log('Modal fix initialized');
    }
})();
