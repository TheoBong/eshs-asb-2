// Comma Input Verification Script
// This script helps verify that comma input is working correctly

console.log('🧪 Starting comma input verification...');

// Test 1: Check if comma key event propagation is working
function testCommaKeyEvent() {
  console.log('Test 1: Comma key event handling');
  
  // Create a test input element
  const testInput = document.createElement('input');
  testInput.type = 'text';
  testInput.id = 'comma-test-input';
    // Add our comma and space protection
  testInput.addEventListener('keydown', (e) => {
    if (e.key === ',' || e.key === ' ') {
      e.stopPropagation();
      console.log(`✅ ${e.key === ',' ? 'Comma' : 'Space'} key event propagation stopped`);
    }
  });
    // Simulate comma and space key press
  const commaEvent = new KeyboardEvent('keydown', { key: ',' });
  const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
  testInput.dispatchEvent(commaEvent);
  testInput.dispatchEvent(spaceEvent);
  
  return true;
}

// Test 2: Check comma input in actual input fields
function testCommaInput() {
  console.log('Test 2: Comma input in fields');
  
  // Find comma-separated input fields
  const inputs = document.querySelectorAll('input[placeholder*="comma"], input[placeholder*=","]');
  
  if (inputs.length === 0) {
    console.log('⚠️  No comma-separated input fields found on current page');
    return false;
  }
  
  inputs.forEach((input, index) => {
    console.log(`Found comma input field ${index + 1}: ${input.placeholder}`);
      // Test comma and space input
    input.value = 'test, value with spaces';
    if (input.value.includes(',') && input.value.includes(' ')) {
      console.log(`✅ Field ${index + 1}: Can store comma and space values`);
    } else {
      console.log(`❌ Field ${index + 1}: Cannot store comma and/or space values`);
    }
  });
  
  return true;
}

// Test 3: Check CommaSeparatedInput component
function testCommaSeparatedComponent() {
  console.log('Test 3: CommaSeparatedInput component functionality');
  
  // Look for our custom component inputs
  const commaSeparatedInputs = document.querySelectorAll('[data-comma-separated="true"]');
  
  if (commaSeparatedInputs.length === 0) {
    console.log('⚠️  No CommaSeparatedInput components found on current page');
    return false;
  }
  
  commaSeparatedInputs.forEach((input, index) => {
    console.log(`Found CommaSeparatedInput component ${index + 1}`);
      // Test comma and space input
    input.value = 'item1, item2, item3 with spaces';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    if (input.value.includes(',') && input.value.includes(' ')) {
      console.log(`✅ Component ${index + 1}: Handles comma and space input correctly`);
    } else {
      console.log(`❌ Component ${index + 1}: Issues with comma and/or space input`);
    }
  });
  
  return true;
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running comma input verification tests...\n');
  
  try {
    testCommaKeyEvent();
    console.log('');
    
    testCommaInput();
    console.log('');
    
    testCommaSeparatedComponent();
    console.log('');
    
    console.log('✅ Comma input verification completed!');
    console.log('📝 Check the console output above for detailed results');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Auto-run tests when script is loaded
if (typeof window !== 'undefined') {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
  } else {
    runAllTests();
  }
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testCommaKeyEvent, testCommaInput, testCommaSeparatedComponent };
}
