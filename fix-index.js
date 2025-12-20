/**
 * Automated Fix Script for index.html
 * Fixes API field mapping and adds product modal
 */

(function() {
    'use strict';
    
    console.log('🔧 Medical Inventory System - Applying Fixes...');

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFixes);
    } else {
        applyFixes();
    }

    function applyFixes() {
        // Fix 1: Update loadProducts function
        if (typeof window.loadProducts === 'function') {
            window.loadProducts = async function() {
                try {
                    const data = await apiCall('/products');
                    state.products = data.map(p => ({
                        id: p.id,  // FIXED
                        name: p.name,  // FIXED
                        sku: p.sku,
                        price: parseFloat(p.unit_price),  // FIXED
                        cost_price: parseFloat(p.cost_price),
                        category: p.category_id,
                        stock: p.quantity || 0,  // FIXED
                        reorder_level: p.reorder_level
                    }));
                    console.log('✅ Products loaded with correct field mapping');
                    render();
                } catch (error) {
                    showNotification('Failed to load products', 'error');
                }
            };
        }

        // Fix 2: Update loadCategories function
        if (typeof window.loadCategories === 'function') {
            window.loadCategories = async function() {
                try {
                    const data = await apiCall('/categories');
                    state.categories = data.map(c => ({
                        id: c.id,  // FIXED
                        name: c.name  // FIXED
                    }));
                    console.log('✅ Categories loaded with correct field mapping');
                } catch (error) {
                    console.error('Failed to load categories:', error);
                    state.categories = [
                        {id: 1, name: 'Tablets'},
                        {id: 2, name: 'Syrups'},
                        {id: 3, name: 'Injections'}
                    ];
                }
            };
        }

        // Fix 3: Add product form handler
        window.handleProductSubmit = async function(event) {
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
                state.loading = true;
                render();
                
                await apiCall('/products', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                
                await loadProducts();
                hideModal('productModal');
                showNotification('Product added successfully!', 'success');
                console.log('✅ Product added successfully');
            } catch (error) {
                showNotification(error.message || 'Failed to add product', 'error');
            } finally {
                state.loading = false;
                render();
            }
        };

        // Fix 4: Update showModal to populate categories
        const originalShowModal = window.showModal;
        window.showModal = function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('modal-hidden');
                
                if (modalId === 'productModal') {
                    // Populate categories dropdown
                    setTimeout(() => {
                        const select = document.getElementById('categorySelect');
                        if (select && state.categories) {
                            select.innerHTML = '<option value="">Select Category</option>';
                            state.categories.forEach(cat => {
                                const option = document.createElement('option');
                                option.value = cat.id;
                                option.textContent = cat.name;
                                select.appendChild(option);
                            });
                            console.log('✅ Categories dropdown populated');
                        }
                    }, 100);
                }
            }
        };

        // Fix 5: Inject product modal HTML if it doesn't exist
        if (!document.getElementById('productModal')) {
            const modalHTML = `
            <div id="productModal" class="fixed inset-0 bg-black bg-opacity-50 modal-hidden flex items-center justify-center z-50">
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
                                <select name="category_id" id="categorySelect"
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
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            console.log('✅ Product modal HTML injected');
        }

        // Reload data with fixed functions if logged in
        if (state && state.token) {
            loadCategories().then(() => {
                loadProducts().then(() => {
                    console.log('✅ All fixes applied successfully!');
                    console.log('📝 Product management now works in main app!');
                    
                    // Show success notification
                    if (sessionStorage.getItem('applyFixes') === 'true') {
                        sessionStorage.removeItem('applyFixes');
                        setTimeout(() => {
                            showNotification('✅ All fixes applied! Product management ready.', 'success');
                        }, 1000);
                    }
                });
            });
        }

        console.log('🎉 Fix script loaded and ready!');
    }
})();
