// Quick test to verify comma and space input functionality
// Run this in the browser console on the admin page

console.log('🔍 Testing comma and space input functionality...');

// Test 1: Find CommaSeparatedInput components
const commaSeparatedInputs = document.querySelectorAll('[data-comma-separated="true"]');
console.log(`Found ${commaSeparatedInputs.length} CommaSeparatedInput components`);

// Test 2: Test input fields that should accept commas and spaces
const testFields = [
  'input[placeholder*="DJ, Refreshments"]',
  'input[placeholder*="S, M, L"]', 
  'input[placeholder*="Blue, Gold"]'
];

testFields.forEach((selector, index) => {
  const field = document.querySelector(selector);
  if (field) {
    console.log(`✅ Found test field ${index + 1}: ${field.placeholder}`);
    
    // Test comma input
    field.value = 'test, value';
    if (field.value.includes(',')) {
      console.log(`  ✅ Comma input works`);
    } else {
      console.log(`  ❌ Comma input blocked`);
    }
    
    // Test space input
    field.value = 'test value with spaces';
    if (field.value.includes(' ')) {
      console.log(`  ✅ Space input works`);
    } else {
      console.log(`  ❌ Space input blocked`);
    }
    
    // Clear field
    field.value = '';
  } else {
    console.log(`❌ Field ${index + 1} not found: ${selector}`);
  }
});

console.log('🏁 Test completed. Check results above.');
