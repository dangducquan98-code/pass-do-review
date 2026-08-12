import { test, expect } from '@playwright/test';

test.describe('Storefront Flow', () => {
  test('should load homepage and display products grid', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Săn Đồ Giá Rẻ');
    
    // Check products section
    await expect(page.locator('h2')).toContainText('Đồ Đang Có Sẵn');
  });
});
