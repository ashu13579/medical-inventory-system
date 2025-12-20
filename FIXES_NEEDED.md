# Critical Frontend Fixes Needed

## Issues Found:

1. **Product Modal Missing** - No HTML for the product modal exists
2. **API Field Mapping Wrong** - Frontend expects old field names
3. **Categories Not Loading** - Dropdown is empty
4. **No Quantity Field** - Can't set initial stock

## Quick Fixes:

### 1. Add this script tag to index.html (before closing </body>):

```html
<script src="app.js"></script>
```

### 2. Fix loadProducts() function (around line 150):

**REPLACE:**
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

**WITH:**
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

### 3. Fix loadCategories() function (around line 200):

**REPLACE:**
```javascript
state.categories = data.map(c => ({
    id: c.category_id,
    name: c.category_name
}));
```

**WITH:**
```javascript
state.categories = data.map(c => ({
    id: c.id,
    name: c.name
}));
```

### 4. Fix renderProducts() table (around line 550):

**REPLACE:**
```javascript
const category = state.categories.find(c => c.id === product.category);
```

**WITH:**
```javascript
const category = state.categories.find(c => c.id === product.category) || {name: 'Uncategorized'};
```

## Backend is Working!

The backend API is fully functional and returns:
- `id` (not `product_id`)
- `name` (not `product_name`)  
- `unit_price` (not `selling_price`)
- `quantity` (not `total_stock`)

Frontend just needs to use the correct field names!
