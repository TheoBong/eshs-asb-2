// Debug script to test comma input in admin forms
console.log("Testing comma input in admin forms...");

// Function to test comma input
function testCommaInput() {
  // Find all input elements on the page
  const inputs = document.querySelectorAll('input[type="text"], input:not([type])');
  console.log(`Found ${inputs.length} text inputs`);
  
  inputs.forEach((input, index) => {
    console.log(`Testing input ${index}:`, input);
    
    // Check if input has any event listeners that might block commas
    const listeners = getEventListeners(input);
    if (listeners) {
      console.log(`Input ${index} listeners:`, listeners);
    }
    
    // Check input properties
    console.log(`Input ${index} properties:`, {
      type: input.type,
      value: input.value,
      placeholder: input.placeholder,
      disabled: input.disabled,
      readOnly: input.readOnly,
      maxLength: input.maxLength,
      pattern: input.pattern,
      inputMode: input.inputMode
    });
    
    // Try to simulate typing a comma
    input.focus();
    input.value = 'test,comma';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log(`After comma test, input ${index} value:`, input.value);
  });
}

// Test when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testCommaInput);
} else {
  testCommaInput();
}

// Also test any specific comma-separated fields
function testSpecificFields() {
  // Look for fields that might be comma-separated based on placeholder text
  const commaSeparatedFields = document.querySelectorAll('input[placeholder*="comma"], input[placeholder*=","]');
  console.log("Found comma-separated fields:", commaSeparatedFields);
  
  commaSeparatedFields.forEach((field, index) => {
    console.log(`Testing comma-separated field ${index}:`, field.placeholder);
    field.focus();
    
    // Try typing comma directly
    const event = new KeyboardEvent('keydown', {
      key: ',',
      code: 'Comma',
      keyCode: 188,
      charCode: 44,
      bubbles: true
    });
    
    const prevented = !field.dispatchEvent(event);
    console.log(`Comma keydown prevented for field ${index}:`, prevented);
    
    // Try input event
    field.value = 'S,M,L';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`Final value for field ${index}:`, field.value);
  });
}

setTimeout(testSpecificFields, 1000);
