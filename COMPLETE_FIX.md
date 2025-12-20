# Complete Fix for index.html

## Summary
The standalone `products-fixed.html` works perfectly! Now we need to apply the same fixes to the main `index.html`.

## Critical Issues to Fix:

### 1. API Field Mapping (Line ~150)
**Current (WRONG):**
```javascript
state.products = data.map(p => ({
    id: p.product_id,
    name: p.product_name,
    sku: p.sku,
    price: parseFloat(p.selling_price),
    cost_price: parseFloat(p.cost_price),
    category: p.category_id,
    stock: p.total_stock || 0,
    reorder_level: p.reorder_level
}));
```

**Fixed (CORRECT):**
```javascript
state.products = data.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: parseFloat(p.unit_price),
    cost_price: parseFloat(p.cost_price),
    category: p.category_id,
    stock: p.quantity || 0,
    reorder_level: p.reorder_level
}));
```

### 2. Categories Mapping (Line ~200)
**Current (WRONG):**
```javascript
state.categories = data.map(c => ({
    id: c.category_id,
    name: c.category_name
}));
```

**Fixed (CORRECT):**
```javascript
state.categories = data.map(c => ({
    id: c.id,
    name: c.name
}));
```

### 3. Add Product Modal HTML (Add before closing `</body>` tag)
```html
<!-- Product Modal -->
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
```

### 4. Add Product Form Handler (Add to JavaScript section)
```javascript
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
        state.loading = true;
        render();
        
        await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        await loadProducts();
        hideModal('productModal');
        showNotification('Product added successfully!', 'success');
    } catch (error) {
        showNotification(error.message || 'Failed to add product', 'error');
    } finally {
        state.loading = false;
        render();
    }
}

// Populate categories when modal opens
function populateCategoriesDropdown() {
    const select = document.getElementById('categorySelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Category</option>';
    state.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}
```

### 5. Update showModal function
```javascript
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('modal-hidden');
        
        // Populate categories if product modal
        if (modalId === 'productModal') {
            populateCategoriesDropdown();
        }
    }
}
```

## Backend API Returns:
```json
{
  "id": 1,
  "name": "Product Name",
  "sku": "SKU123",
  "unit_price": "100.00",
  "cost_price": "50.00",
  "quantity": 100,
  "category_id": 1,
  "reorder_level": 10
}
```

## What Was Wrong:
- ❌ Frontend expected `product_id`, backend returns `id`
- ❌ Frontend expected `product_name`, backend returns `name`
- ❌ Frontend expected `selling_price`, backend returns `unit_price`
- ❌ Frontend expected `total_stock`, backend returns `quantity`
- ❌ No product modal HTML existed
- ❌ No quantity field in form

## What's Fixed:
- ✅ Correct field mapping
- ✅ Product modal with close button
- ✅ Categories dropdown populated
- ✅ Quantity field added
- ✅ Form submits to backend correctly
