import { test, expect } from '@playwright/test';

test.describe('Ludo Nexus - Console Error Check', () => {
  test('home page should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for any async errors
    
    // Filter out known harmless errors
    const filteredErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('manifest') &&
      !e.includes('serviceWorker') &&
      !e.includes('Extension')
    );
    
    if (filteredErrors.length > 0) {
      console.log('Console errors found:', filteredErrors);
    }
    
    expect(filteredErrors).toHaveLength(0);
  });

  test('login page should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const filteredErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('manifest') &&
      !e.includes('serviceWorker') &&
      !e.includes('Extension')
    );
    
    if (filteredErrors.length > 0) {
      console.log('Login page console errors:', filteredErrors);
    }
    
    expect(filteredErrors).toHaveLength(0);
  });

  test('game modes page should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('http://localhost:3000/game-modes');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const filteredErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('manifest') &&
      !e.includes('serviceWorker') &&
      !e.includes('Extension')
    );
    
    if (filteredErrors.length > 0) {
      console.log('Game modes page console errors:', filteredErrors);
    }
    
    expect(filteredErrors).toHaveLength(0);
  });

  test('dashboard profile page should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const filteredErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('manifest') &&
      !e.includes('serviceWorker') &&
      !e.includes('Extension')
    );
    
    if (filteredErrors.length > 0) {
      console.log('Profile page console errors:', filteredErrors);
    }
    
    expect(filteredErrors).toHaveLength(0);
  });
});