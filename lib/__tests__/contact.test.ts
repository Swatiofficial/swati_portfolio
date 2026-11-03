import assert from 'node:assert';
import {
  BUDGET_OPTIONS,
  DEFAULT_BUDGET,
  RECIPIENT_EMAIL,
  validateProjectBrief,
  formatSubmissionDateTime,
  generateEmailHtml,
  generateEmailText,
} from '../contact';

console.log('--- RUNNING CONTACT UTILITY UNIT TESTS ---');

// 1. Budget Options Tests
{
  assert.strictEqual(BUDGET_OPTIONS.length, 6, 'Should have exactly 6 INR budget options');
  assert.strictEqual(BUDGET_OPTIONS[0], '₹800 – ₹2,000');
  assert.strictEqual(BUDGET_OPTIONS[1], '₹2,000 – ₹5,000');
  assert.strictEqual(BUDGET_OPTIONS[2], '₹5,000 – ₹10,000');
  assert.strictEqual(BUDGET_OPTIONS[3], '₹10,000 – ₹15,000');
  assert.strictEqual(BUDGET_OPTIONS[4], '₹15,000 – ₹20,000');
  assert.strictEqual(BUDGET_OPTIONS[5], '₹20,000 – ₹25,000');

  // Verify all options use ₹ symbol and NO USD symbols ($)
  for (const opt of BUDGET_OPTIONS) {
    assert.strictEqual(opt.includes('₹'), true, `Option ${opt} must include ₹`);
    assert.strictEqual(opt.includes('$'), false, `Option ${opt} must NOT include $`);
  }

  assert.strictEqual(DEFAULT_BUDGET, '₹2,000 – ₹5,000');
  assert.strictEqual(RECIPIENT_EMAIL, 'swatiofficial1002@gmail.com');
  console.log('✓ INR Budget options and symbols verified');
}

// 2. Validation Tests
{
  // Valid submission
  const valid = validateProjectBrief({
    name: 'Sarah Connor',
    email: 'sarah@skynet.com',
    description: 'Looking for a cinematic teaser trailer for our sci-fi film.',
  });
  assert.strictEqual(valid.isValid, true);
  assert.strictEqual(valid.error, undefined);

  // Missing name
  const missingName = validateProjectBrief({
    name: '   ',
    email: 'sarah@skynet.com',
    description: 'Valid description',
  });
  assert.strictEqual(missingName.isValid, false);
  assert.strictEqual(missingName.error, 'Please provide your name.');

  // Missing email
  const missingEmail = validateProjectBrief({
    name: 'Sarah',
    email: '',
    description: 'Valid description',
  });
  assert.strictEqual(missingEmail.isValid, false);
  assert.strictEqual(missingEmail.error, 'Please provide your email address.');

  // Invalid email format
  const invalidEmail = validateProjectBrief({
    name: 'Sarah',
    email: 'not-an-email',
    description: 'Valid description',
  });
  assert.strictEqual(invalidEmail.isValid, false);
  assert.strictEqual(invalidEmail.error, 'Please provide a valid email address.');

  // Missing description
  const missingDesc = validateProjectBrief({
    name: 'Sarah',
    email: 'sarah@skynet.com',
    description: '    ',
  });
  assert.strictEqual(missingDesc.isValid, false);
  assert.strictEqual(missingDesc.error, 'Please describe your project scope and vision.');

  console.log('✓ Validation rules verified');
}

// 3. Email Template Generation Tests
{
  const testData = {
    name: 'Alex Rivera',
    email: 'alex@brandco.studio',
    projectType: 'Brand Promotions',
    budgetRange: '₹15,000 – ₹20,000',
    description: 'We have 200GB raw 4K footage that needs high-tempo commercial cutting with sound design.',
    submissionDateTime: 'Sunday, 18 October 2026, 11:20:00 pm IST',
  };

  const html = generateEmailHtml(testData);
  assert.strictEqual(html.includes('Alex Rivera'), true, 'HTML should contain client name');
  assert.strictEqual(html.includes('alex@brandco.studio'), true, 'HTML should contain client email');
  assert.strictEqual(html.includes('Brand Promotions'), true, 'HTML should contain project type');
  assert.strictEqual(html.includes('₹15,000 – ₹20,000'), true, 'HTML should contain INR budget');
  assert.strictEqual(html.includes('200GB raw 4K footage'), true, 'HTML should contain description');
  assert.strictEqual(html.includes('swatiofficial1002@gmail.com'), true, 'HTML should reference recipient email');
  assert.strictEqual(html.includes('$'), false, 'HTML should not contain USD signs');

  const text = generateEmailText(testData);
  assert.strictEqual(text.includes('Client Name:          Alex Rivera'), true);
  assert.strictEqual(text.includes('Client Email:         alex@brandco.studio'), true);
  assert.strictEqual(text.includes('Project Type:         Brand Promotions'), true);
  assert.strictEqual(text.includes('Budget Range (INR):   ₹15,000 – ₹20,000'), true);
  assert.strictEqual(text.includes('swatiofficial1002@gmail.com'), true);
  assert.strictEqual(text.includes('$'), false, 'Text should not contain USD signs');

  console.log('✓ Email HTML and Text templates verified');
}

// 4. Date Formatting Tests
{
  const dateStr = formatSubmissionDateTime(new Date('2026-10-18T18:00:00Z'));
  assert.strictEqual(typeof dateStr, 'string');
  assert.strictEqual(dateStr.length > 10, true);
  console.log('✓ Submission timestamp formatting verified');
}

console.log('🎉 ALL CONTACT TESTS PASSED SUCCESSFULLY!');
