#!/usr/bin/env python3
"""
Script to fix modal functions in index.html
This replaces the broken showModal and hideModal functions
"""

import re

# Read the file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the old broken functions
old_show_modal = r'''        // Modal Management
        function showModal\(modalId\) \{
            const modal = document\.getElementById\(modalId\);
            if \(modal\) \{
                modal\.classList\.remove\('modal-hidden'\);
            \}
        \}'''

old_hide_modal = r'''        function hideModal\(modalId\) \{
            const modal = document\.getElementById\(modalId\);
            if \(modal\) \{
                modal\.classList\.add\('modal-hidden'\);
            \}
        \}'''

# Define the new fixed functions
new_show_modal = '''        // Modal Management - FIXED
        function showModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('modal-hidden');
                modal.style.display = 'flex';
            }
        }'''

new_hide_modal = '''        function hideModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('modal-hidden');
                modal.style.display = 'none';
                
                // Reset form if exists
                const form = modal.querySelector('form');
                if (form) form.reset();
            }
        }'''

# Replace the functions
content = re.sub(old_show_modal, new_show_modal, content)
content = re.sub(old_hide_modal, new_hide_modal, content)

# Add event listeners before the init() call
init_pattern = r'(        // Initialize app\n        init\(\);)'
event_listeners = '''        // Add modal event listeners
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('[id$="Modal"]');
                modals.forEach(modal => {
                    if (!modal.classList.contains('modal-hidden')) {
                        hideModal(modal.id);
                    }
                });
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.id && e.target.id.endsWith('Modal')) {
                hideModal(e.target.id);
            }
        });

\\1'''

content = re.sub(init_pattern, event_listeners, content)

# Write the fixed file
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Modal functions fixed in index.html!")
print("✅ Added ESC key and click-outside listeners")
print("🎉 Modal should now close properly!")
