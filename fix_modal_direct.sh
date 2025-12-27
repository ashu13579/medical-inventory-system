#!/bin/bash
# Direct fix for index.html modal functions
# Run this in your project directory: bash fix_modal_direct.sh

echo "🔧 Fixing modal functions in index.html..."

# Create backup
cp index.html index.html.backup
echo "✅ Backup created: index.html.backup"

# Fix showModal function - add display: flex
sed -i '' '/function showModal(modalId) {/,/^        }$/ {
    /modal\.classList\.remove/a\
                modal.style.display = '\''flex'\'';
}' index.html

# Fix hideModal function - add display: none and form reset
sed -i '' '/function hideModal(modalId) {/,/^        }$/ {
    /modal\.classList\.add/a\
                modal.style.display = '\''none'\'';\
                \
                const form = modal.querySelector('\''form'\'');\
                if (form) form.reset();
}' index.html

# Add event listeners before init()
sed -i '' '/\/\/ Initialize app/i\
        // Modal event listeners\
        document.addEventListener('\''keydown'\'', (e) => {\
            if (e.key === '\''Escape'\'') {\
                const modals = document.querySelectorAll('\''[id$="Modal"]'\'');\
                modals.forEach(modal => {\
                    if (!modal.classList.contains('\''modal-hidden'\'')) {\
                        hideModal(modal.id);\
                    }\
                });\
            }\
        });\
        \
        document.addEventListener('\''click'\'', (e) => {\
            if (e.target.id && e.target.id.endsWith('\''Modal'\'')) {\
                hideModal(e.target.id);\
            }\
        });\
\
' index.html

echo "✅ Modal functions fixed!"
echo "✅ ESC key listener added"
echo "✅ Click-outside listener added"
echo ""
echo "🎉 Done! Test your modal now."
echo "📝 If something breaks, restore with: cp index.html.backup index.html"
