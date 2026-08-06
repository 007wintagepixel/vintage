const { chromium } = require('playwright');
const fs = require('fs');

async function testVisuals() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to local dev server
  await page.goto('http://localhost:3000/game/test-match', { waitUntil: 'networkidle' });
  
  // Wait for game board to load
  await page.waitForSelector('canvas, .game-board, .board', { timeout: 10000 });
  
  // Take screenshot
  await page.screenshot({ path: 'game-board-initial.png', fullPage: true });
  console.log('✅ Initial board screenshot saved');
  
  // Test dice roll
  const diceButton = await page.$('button:has-text("ROLL")');
  if (diceButton) {
    await diceButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'game-board-after-roll.png', fullPage: true });
    console.log('✅ After roll screenshot saved');
  }
  
  // Test token click
  const token = await page.$('.token');
  if (token) {
    await token.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'game-board-token-click.png', fullPage: true });
    console.log('✅ Token click screenshot saved');
  }
  
  // Test responsive
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'game-board-mobile.png', fullPage: true });
  console.log('✅ Mobile screenshot saved');
  
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: 'game-board-tablet.png', fullPage: true });
  console.log('✅ Tablet screenshot saved');
  
  await browser.close();
  console.log('✅ Visual testing complete!');
}

testVisuals().catch(console.error);
