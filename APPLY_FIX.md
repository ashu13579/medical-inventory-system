# ✅ How to Fix index.html (ONE LINE CHANGE)

## The Fix

Add ONE line to `index.html` to load the patch script that fixes all issues.

## Steps:

### Option 1: GitHub Web Editor (Easiest)

1. Go to: https://github.com/ashu13579/medical-inventory-system/edit/main/index.html

2. Scroll to the **very bottom** (line 995-997):
```html
        // Initialize app
        init();
    </script>
</body>
</html>
```

3. Change it to (add ONE line):
```html
        // Initialize app
        init();
    </script>
    <script src="patch.js"></script>
</body>
</html>
```

4. Click "Commit changes"

5. Done! Visit: https://ashu13579.github.io/medical-inventory-system/

---

### Option 2: Local Edit

1. Clone the repository
2. Open `index.html`
3. Find line 995 (before `</body>`)
4. Add: `<script src="patch.js"></script>`
5. Commit and push

---

## What This Does

The `patch.js` script automatically fixes:

✅ **loadProducts()** - Uses correct API fields (id, name, unit_price, quantity)  
✅ **loadCategories()** - Uses correct API fields (id, name)  
✅ **addProduct()** - Sends correct fields + includes quantity  
✅ **Product Modal** - Adds missing quantity field  

---

## Result

After adding this ONE line:

- ✅ Products load correctly (no more "undefined")
- ✅ Categories dropdown populates
- ✅ Product modal has quantity field
- ✅ Adding products works perfectly
- ✅ Everything in ONE professional application

---

## Test It

1. Visit: https://ashu13579.github.io/medical-inventory-system/
2. Login: admin / admin123
3. Go to Products tab
4. Click "+ Add Product"
5. Fill form (notice the quantity field!)
6. Submit
7. ✅ Product appears with correct name and price!

---

**ONE LINE = EVERYTHING FIXED!** 🎉
