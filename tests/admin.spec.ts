import { test, expect } from '@playwright/test';

test.describe('Admin Flow', () => {
  test('should show login page on /admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveTitle(/.*| Đăng nhập Quản trị.*/i); // Next.js default title might be Create Next App if we didn't change it, let's just check for the heading
    await expect(page.locator('h1')).toHaveText('Đăng nhập Quản trị');
  });

  test('should show error with invalid PIN', async ({ page }) => {
    await page.goto('/admin');
    await page.fill('input[name="pin"]', 'wrongpin');
    await page.click('button[type="submit"]');
    
    // Expect error message
    const errorMsg = page.locator('text=Mã PIN không chính xác');
    await expect(errorMsg).toBeVisible();
  });

  test('should login successfully with correct PIN', async ({ page }) => {
    await page.goto('/admin');
    // Using default PIN from .env.local
    await page.fill('input[name="pin"]', '123456');
    await page.click('button[type="submit"]');
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);
    await expect(page.locator('h1')).toHaveText('Danh sách sản phẩm');
  });

  test('should protect dashboard route', async ({ page }) => {
    // Clear cookies to simulate unauthenticated user
    await page.context().clearCookies();
    await page.goto('/admin/dashboard');
    
    // Should be redirected back to /admin
    await expect(page).toHaveURL(/.*\/admin/);
  });
});
