import { test, expect } from '@playwright/test';

test.describe('Chart App End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test for isolation
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Chart Generation Verification', async ({ page }) => {
    await page.getByRole('link', { name: 'Line' }).click();
    // Fill in chart title, labels, color, and data
    await page.getByLabel('Chart title').fill('Test Line Chart');
    await page.getByLabel('X label').fill('Time');
    await page.getByLabel('Y label').fill('Value');
    // Fill in first data row
    await page.locator('.x-value input').first().fill('1');
    await page.locator('.y-value input').first().fill('10');
    // Add a second row
    await page.getByRole('button', { name: '+' }).click();
    await page.locator('.x-value input').nth(1).fill('2');
    await page.locator('.y-value input').nth(1).fill('20');
    // Generate chart
    await page.getByRole('button', { name: 'Generate Chart' }).click();
    // Wait for image to appear
    await expect(page.locator('img[alt="Generated chart"]')).toBeVisible({ timeout: 10000 });
  });

  test('Data Persistence Across Pages', async ({ page }) => {
    await page.getByRole('link', { name: 'Line' }).click();
    await page.getByLabel('Chart title').fill('Persistent Chart');
    await page.getByLabel('X label').fill('X');
    await page.getByLabel('Y label').fill('Y');
    await page.locator('.x-value input').first().fill('5');
    await page.locator('.y-value input').first().fill('15');
    // Navigate to scatter page
    await page.getByRole('link', { name: 'Scatter' }).click();
    // Data should persist
    await expect(page.getByLabel('Chart title')).toHaveValue('Persistent Chart');
    await expect(page.getByLabel('X label')).toHaveValue('X');
    await expect(page.getByLabel('Y label')).toHaveValue('Y');
    await expect(page.locator('.x-value input').first()).toHaveValue('5');
    await expect(page.locator('.y-value input').first()).toHaveValue('15');
  });

  test('Saving Charts to the Gallery', async ({ page }) => {
    await page.getByRole('link', { name: 'Bar' }).click();
    await page.getByLabel('Chart title').fill('Bar Chart Save Test');
    await page.getByLabel('X label').fill('Category');
    await page.getByLabel('Y label').fill('Amount');
    await page.locator('.x-value input').first().fill('A');
    await page.locator('.y-value input').first().fill('100');
    await page.getByRole('button', { name: 'Generate Chart' }).click();
    await expect(page.locator('img[alt="Generated chart"]')).toBeVisible({ timeout: 10000 });
    // Save chart
    await page.getByRole('button', { name: 'Save Chart' }).click();
    // Go to gallery
    await page.getByRole('link', { name: 'Gallery' }).click();
    // Chart should appear in gallery
    await expect(page.getByText('Bar Chart Save Test')).toBeVisible();
    await expect(page.getByText(/Type: bar/i)).toBeVisible();
  });

  test('Re-opening Saved Charts', async ({ page }) => {
    await page.getByRole('link', { name: 'Scatter' }).click();
    // First, create and save a chart
    await page.getByLabel('Chart title').fill('Scatter Reopen Test');
    await page.getByLabel('X label').fill('Alpha');
    await page.getByLabel('Y label').fill('Beta');
    await page.locator('.x-value input').first().fill('10');
    await page.locator('.y-value input').first().fill('20');
    await page.getByRole('button', { name: 'Generate Chart' }).click();
    await expect(page.locator('img[alt="Generated chart"]')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Save Chart' }).click();
    // Go to gallery
    await page.getByRole('link', { name: 'Gallery' }).click();
    // Click "Open" on the saved chart
    const openButton = page.getByRole('button', { name: 'Open' }).first();
    await openButton.click();
    // Should be redirected to scatter builder with data pre-filled and image visible
    await expect(page.getByLabel('Chart title')).toHaveValue('Scatter Reopen Test');
    await expect(page.getByLabel('X label')).toHaveValue('Alpha');
    await expect(page.getByLabel('Y label')).toHaveValue('Beta');
    await expect(page.locator('.x-value input').first()).toHaveValue('10');
    await expect(page.locator('.y-value input').first()).toHaveValue('20');
    await expect(page.locator('img[alt="Generated chart"]')).toBeVisible({ timeout: 10000 });
  });
});