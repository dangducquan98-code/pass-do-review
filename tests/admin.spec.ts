import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

function getAdminPin(): string {
  if (process.env.ADMIN_PIN) {
    return process.env.ADMIN_PIN
  }

  const envPath = resolve(process.cwd(), '.env.local')
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf8')
    const match = content.match(/^ADMIN_PIN=(.*)$/m)
    if (match?.[1]) {
      return match[1].trim().replace(/^["']|["']$/g, '')
    }
  }

  throw new Error(
    'ADMIN_PIN chưa được cấu hình (process.env hoặc .env.local)'
  )
}

test.describe('Admin Flow', () => {
  test('should show login page on /admin', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.locator('h1')).toHaveText('Đăng nhập Quản trị')
  })

  test('should show error with invalid PIN', async ({ page }) => {
    await page.goto('/admin')
    await page.fill('input[name="pin"]', 'wrongpin')
    await page.click('button[type="submit"]')

    const errorMsg = page.locator('text=Mã PIN không chính xác')
    await expect(errorMsg).toBeVisible()
  })

  test('should login successfully with correct PIN', async ({ page }) => {
    const pin = getAdminPin()
    await page.goto('/admin')
    await page.fill('input[name="pin"]', pin)
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/.*\/admin\/dashboard/)
    await expect(page.locator('h1')).toHaveText('Quản lý kho')
  })

  test('should protect dashboard route', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/admin/dashboard')

    await expect(page).toHaveURL(/.*\/admin/)
  })
})
