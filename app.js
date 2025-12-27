// Product Modal HTML - inject this into the page
const productModalHTML = `
<div id="productModal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 animate-slide-in">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Add New Product</h2>
            <button onclick="hideModal('productModal')" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times text-2xl"></i>
            </button>
        </div>
        
        <form id="productForm" onsubmit="handleProductSubmit(event)">
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="block text-gray-700 mb-2">Product Name *</label>
                    <input type="text" name="name" required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-gray-700 mb-2">SKU *</label>
                    <input type="text" name="sku" required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-gray-700 mb-2">Category</label>
                    <select name="category_id" 
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Category</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-gray-700 mb-2">Cost Price *</label>
                    <input type="number" name="cost_price" step="0.01" required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-gray-700 mb-2">Selling Price *</label>
                    <input type="number" name="selling_price" step="0.01" required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-gray-700 mb-2">Initial Stock Quantity *</label>
                    <input type="number" name="quantity" value="0" required
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-gray-700 mb-2">Reorder Level</label>
                    <input type="number" name="reorder_level" value="10"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="col-span-2">
                    <label class="block text-gray-700 mb-2">Description</label>
                    <textarea name="description" rows="3"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
            </div>
            
            <div class="flex gap-4 mt-6">
                <button type="button" onclick="hideModal('productModal')"
                    class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                    Cancel
                </button>
                <button type="submit"
                    class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    Add Product
                </button>
            </div>
        </form>
    </div>
</div>
`;

// Show modal function - FIXED
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.display = 'flex';
        
        // Populate categories dropdown if it's the product modal
        if (modalId === 'productModal') {
            populateCategoriesDropdown();
        }
    }
}

// Hide modal function - FIXED
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.style.display = 'none';
        
        // Reset form if it exists
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// Populate categories dropdown - FIXED TYPO
function populateCategoriesDropdown() {
    const select = document.querySelector('#productModal select[name="category_id"]');
    if (!select) return;
    
    // Clear existing options except first
    select.innerHTML = '<option value="">Select Category</option>';
    
    // Add categories from state
    if (window.state && window.state.categories) {
        window.state.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    }
}

// Handle product form submission
async function handleProductSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        sku: formData.get('sku'),
        category_id: formData.get('category_id') || null,
        cost_price: formData.get('cost_price'),
        selling_price: formData.get('selling_price'),
        quantity: formData.get('quantity'),
        reorder_level: formData.get('reorder_level'),
        description: formData.get('description')
    };
    
    try {
        const response = await fetch(`${window.API_CONFIG.baseURL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.state.token}`
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to add product');
        }
        
        // Reload products
        await window.loadProducts();
        
        // Close modal
        hideModal('productModal');
        
        // Show success message
        window.showNotification('Product added successfully!', 'success');
        
        // Re-render
        window.render();
        
    } catch (error) {
        console.error('Error adding product:', error);
        window.showNotification(error.message, 'error');
    }
}

// Inject modal into page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', productModalHTML);
    
    // Add ESC key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('productModal');
            if (modal && !modal.classList.contains('hidden')) {
                hideModal('productModal');
            }
        }
    });
    
    // Add click outside to close
    document.addEventListener('click', (e) => {
        if (e.target.id === 'productModal') {
            hideModal('productModal');
        }
    });
});

// Export functions to window for onclick handlers
window.showModal = showModal;
window.hideModal = hideModal;
window.handleProductSubmit = handleProductSubmit;
