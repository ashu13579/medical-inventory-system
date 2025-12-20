/**
 * Patch Script for Medical Inventory System
 * This script fixes API field mapping issues and adds missing quantity field
 * 
 * Include this script in index.html by adding before </body>:
 * <script src="patch.js"></script>
 */

(function() {
    'use strict';
    
    console.log('🔧 Applying Medical Inventory System Patches...');

    // Wait for the page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPatches);
    } else {
        applyPatches();
    }

    function applyPatches() {
        // Patch 1: Fix loadProducts function
        if (typeof window.loadProducts === 'function') {
            window.loadProducts = async function() {
                try {
                    const data = await apiCall('/products');
                    state.products = data.map(p => ({
                        id: p.id,                           // FIXED: was p.product_id
                        name: p.name,                       // FIXED: was p.product_name
                        sku: p.sku,
                        price: parseFloat(p.unit_price),    // FIXED: was p.selling_price
                        cost_price: parseFloat(p.cost_price),
                        category: p.category_id,
                        stock: p.quantity || 0,             // FIXED: was p.total_stock
                        reorder_level: p.reorder_level
                    }));
                    render();
                    console.log('✅ Products loaded with correct field mapping');
                } catch (error) {
                    showNotification('Failed to load products', 'error');
                }
            };
        }

        // Patch 2: Fix loadCategories function
        if (typeof window.loadCategories === 'function') {
            window.loadCategories = async function() {
                try {
                    const data = await apiCall('/categories');
                    state.categories = data.map(c => ({
                        id: c.id,          // FIXED: was c.category_id
                        name: c.name       // FIXED: was c.category_name
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

        // Patch 3: Fix addProduct function
        if (typeof window.addProduct === 'function') {
            window.addProduct = async function(data) {
                try {
                    state.loading = true;
                    render();
                    
                    await apiCall('/products', {
                        method: 'POST',
                        body: JSON.stringify({
                            name: data.name,                              // FIXED: was product_name
                            sku: data.sku,
                            category_id: parseInt(data.category) || null,
                            unit_price: parseFloat(data.price),           // FIXED: was selling_price
                            cost_price: parseFloat(data.cost_price || data.price),
                            quantity: parseInt(data.quantity) || 0,       // ADDED: quantity field
                            reorder_level: parseInt(data.reorder_level) || 10,
                            description: data.description || ''
                        })
                    });
                    
                    await loadProducts();
                    hideModal('productModal');
                    showNotification('Product added successfully!', 'success');
                    console.log('✅ Product added with correct field mapping');
                } catch (error) {
                    showNotification(error.message || 'Failed to add product', 'error');
                } finally {
                    state.loading = false;
                    render();
                }
            };
        }

        // Patch 4: Fix renderProductModal to include quantity field
        if (typeof window.renderProductModal === 'function') {
            window.renderProductModal = function() {
                return `
                    <div id="productModal" class="modal-hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 animate-slide-in">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-2xl font-bold">Add New Product</h3>
                                <button onclick="hideModal('productModal')" class="text-gray-500 hover:text-gray-700">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            
                            <form onsubmit="event.preventDefault(); addProduct(Object.fromEntries(new FormData(event.target)));">
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
                                        <select name="category"
                                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">Select Category</option>
                                            ${state.categories.map(cat => `
                                                <option value="${cat.id}">${cat.name}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-gray-700 mb-2">Cost Price *</label>
                                        <input type="number" name="cost_price" step="0.01" required
                                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-gray-700 mb-2">Selling Price *</label>
                                        <input type="number" name="price" step="0.01" required
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
                                        <textarea name="description" rows="2"
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
            };
            console.log('✅ Product modal patched with quantity field');
        }

        // Reload data if logged in
        if (state && state.token) {
            loadCategories().then(() => {
                loadProducts().then(() => {
                    console.log('🎉 All patches applied successfully!');
                });
            });
        }
    }
})();
