#!/bin/bash
# Script to patch index.html modal functions

# This script updates the showModal and hideModal functions in index.html
# to properly close modals by adding display: none/flex styles

echo "Patching index.html modal functions..."

# Find and replace the modal functions
sed -i.bak '/function showModal(modalId) {/,/}/c\
        function showModal(modalId) {\
            const modal = document.getElementById(modalId);\
            if (modal) {\
                modal.classList.remove('\''modal-hidden'\'');\
                modal.style.display = '\''flex'\'';\
            }\
        }' index.html

sed -i.bak '/function hideModal(modalId) {/,/}/c\
        function hideModal(modalId) {\
            const modal = document.getElementById(modalId);\
            if (modal) {\
                modal.classList.add('\''modal-hidden'\'');\
                modal.style.display = '\''none'\'';\
            }\
        }' index.html

echo "Patch complete! Modal functions updated."
echo "The modal should now close properly when clicking X or Cancel buttons."
