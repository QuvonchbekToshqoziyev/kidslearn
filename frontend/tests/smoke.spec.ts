import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => route.fulfill({ json: { accessToken: 'test-token', user: { id: 'p1', name: 'Ota-ona', email: 'parent@test.local', role: 'PARENT' } } }));
  await page.route('**/api/v1/parent/children', async (route) => route.fulfill({ json: [{ id: 'c1', name: 'Ali', birthDate: '2022-01-01' }] }));
  await page.route('**/api/v1/activities', async (route) => route.fulfill({ json: [{ id: 'a1', title: 'Rangni top', description: 'To‘g‘ri rangni tanlang.', type: 'TEST', subject: 'Ranglar', ageMin: 1, ageMax: 4, content: {} }] }));
  await page.route('**/api/v1/activities/a1/complete', async (route) => route.fulfill({ json: { score: 100, stars: 3, medal: 'GOLD' } }));
});

test('parent can log in and complete an activity', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email').fill('parent@test.local');
  await page.getByLabel('Parol').fill('password123');
  await page.getByRole('button', { name: 'Kirish' }).click();
  await expect(page.getByText('Salom, Ali!')).toBeVisible();
  await page.getByRole('button', { name: 'Boshlash' }).click();
  await expect(page.getByText(/mukofot oldi/)).toBeVisible();
});

test('mobile landscape does not overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await expect(page.locator('body')).toHaveCSS('overflow-x', 'visible');
});
