// INLINE FIX - Add this script tag to index.html before </body>
// <script src="fix-inline.js"></script>

console.log('🔧 Applying inline fixes...');

// Override loadProducts with correct field mapping
const originalLoadProducts = window.loadProducts;
window.loadProducts = async function() {
    try {
        const data = await apiCall('/products');
        console.log('Raw product data from API:', data[0]); // Debug
        state.products = data.map(p => ({
            id: p.id,                        // ✅ FIXED
            name: p.name,                    // ✅ FIXED
            sku: p.sku,
            price: parseFloat(p.unit_price), // ✅ FIXED
            cost_price: parseFloat(p.cost_price),
            category: p.category_id,
            stock: p.quantity || 0,          // ✅ FIXED
            reorder_level: p.reorder_level
        }));
        render();
        console.log('✅ Products loaded:', state.products.length);
    } catch (error) {
        console.error('Load products error:', error);
        showNotification('Failed to load products', 'error');
    }
};

// Override loadCategories with correct field mapping
window.loadCategories = async function() {
    try {
        const data = await apiCall('/categories');
        console.log('Raw category data from API:', data[0]); // Debug
        state.categories = data.map(c => ({
            id: c.id,      // ✅ FIXED
            name: c.name   // ✅ FIXED
        }));
        console.log('✅ Categories loaded:', state.categories.length);
    } catch (error) {
        console.error('Failed to load categories:', error);
        state.categories = [
            {id: 1, name: 'Tablets'},
            {id: 2, name: 'Syrups'},
            {id: 3, name: 'Injections'}
        ];
    }
};

// Override addProduct with correct field names
window.addProduct = async function(data) {
    try {
        state.loading = true;
        render();
        
        console.log('Adding product with data:', data);
        
        await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify({
                name: data.name,                              // ✅ FIXED
                sku: data.sku,
                category_id: parseInt(data.category) || null,
                unit_price: parseFloat(data.price),           // ✅ FIXED
                cost_price: parseFloat(data.cost_price || data.price),
                quantity: parseInt(data.quantity) || 0,       // ✅ ADDED
                reorder_level: parseInt(data.reorder_level) || 10,
                description: data.description || ''
            })
        });
        
        await loadProducts();
        hideModal('productModal');
        showNotification('Product added successfully!', 'success');
        console.log('✅ Product added successfully');
    } catch (error) {
        console.error('Add product error:', error);
        showNotification(error.message || 'Failed to add product', 'error');
    } finally {
        state.loading = false;
        render();
    }
};

// Override renderProductModal to add quantity field
window.renderProductModal = function() {
    return `
        <div id="productModal" class="modal-hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 animate-slide-in">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Add New Product</h3>
                    <button onclick="hideModal('productModal')" class="text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form onsubmit="event.preventDefault(); addProduct(Object.fromEntries(new FormData(event.target)));">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-medium mb-2">Product Name *</label>
                            <input type="text" name="name" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">SKU *</label>
                            <input type="text" name="sku" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Category</label>
                            <select name="category"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Category</option>
                                ${state.categories.map(cat => `
                                    <option value="${cat.id}">${cat.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Cost Price *</label>
                            <input type="number" name="cost_price" step="0.01" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Selling Price *</label>
                            <input type="number" name="price" step="0.01" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Initial Stock Quantity *</label>
                            <input type="number" name="quantity" value="0" required
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 font-medium mb-2">Reorder Level</label>
                            <input type="number" name="reorder_level" value="10"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea name="description" rows="2"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                    </div>
                    
                    <div class="flex gap-4 mt-6">
                        <button type="button" onclick="hideModal('productModal')"
                            class="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium">
                            Cancel
                        </button>
                        <button type="submit"
                            class="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium">
                            <i class="fas fa-plus mr-2"></i>Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
};

console.log('✅ All fixes applied! Reloading data...');

// Reload data if logged in
if (state && state.token) {
    setTimeout(() => {
        loadCategories().then(() => {
            loadProducts();
        });
    }, 100);
}
