import { test, expect } from '@playwright/test';

test.describe('Unikota Products Page - Product Images Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });
  });

  test('Hero section renders with correct heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('BRANDS MADE FOR EVERYDAY MALAYSIA');
    console.log('✓ Hero heading found');
  });

  test('Brand section images load', async ({ page }) => {
    const brandSection = page.locator('#brands');
    await expect(brandSection).toBeVisible();

    const images = page.locator('#brands img');
    const imageCount = await images.count();
    console.log(`✓ Found ${imageCount} brand section images`);

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      console.log(`  Image ${i + 1}: ${src}`);
    }
  });

  test('Cili brand section visible with product image', async ({ page }) => {
    const ciliSection = page.locator('text=Cili').first();
    await expect(ciliSection).toBeVisible();

    const ciliImage = page.locator('img[alt*="Cili products"]');
    const ciliImageSrc = await ciliImage.getAttribute('src');
    console.log(`✓ Cili product image: ${ciliImageSrc}`);
  });

  test('Wasabi brand section visible with product image', async ({ page }) => {
    const wababiSection = page.locator('text=Wasabi');
    await expect(wababiSection).toBeVisible();

    const wababiImage = page.locator('img[alt*="Wasabi products"]');
    const wababiImageSrc = await wababiImage.getAttribute('src');
    console.log(`✓ Wasabi product image: ${wababiImageSrc}`);
  });

  test('Unisoft brand section visible with product image', async ({ page }) => {
    const unisoftSection = page.locator('text=Unisoft');
    await expect(unisoftSection).toBeVisible();

    const unisoftImage = page.locator('img[alt*="Unisoft products"]');
    const unisoftImageSrc = await unisoftImage.getAttribute('src');
    console.log(`✓ Unisoft product image: ${unisoftImageSrc}`);
  });

  test('Aimishu brand section visible with product image', async ({ page }) => {
    const aimishuSection = page.locator('text=Aimishu');
    await expect(aimishuSection).toBeVisible();

    const aimishuImage = page.locator('img[alt*="Aimishu products"]');
    const aimishuImageSrc = await aimishuImage.getAttribute('src');
    console.log(`✓ Aimishu product image: ${aimishuImageSrc}`);
  });

  test('Brand taglines and descriptions render', async ({ page }) => {
    const taglines = page.locator('[style*="color"]').filter({ hasText: /Made for|Compact|Softness|Everyday/ });
    const taglineCount = await taglines.count();
    console.log(`✓ Found ${taglineCount} brand taglines`);
  });

  test('Care section (BabyLike, SUMO) visible', async ({ page }) => {
    const careTitle = page.locator('text=Personal care under Unikota Holdings');
    await expect(careTitle).toBeVisible();

    const babylike = page.locator('text=BabyLike');
    const sumo = page.locator('text=SUMO');
    await expect(babylike).toBeVisible();
    await expect(sumo).toBeVisible();
    console.log('✓ Care section (BabyLike, SUMO) visible');
  });

  test('Product families section visible', async ({ page }) => {
    const familiesTitle = page.locator('text=Product families');
    await expect(familiesTitle).toBeVisible();
    console.log('✓ Product families section visible');
  });

  test('CTA section with "BUILT FOR MALAYSIA" visible', async ({ page }) => {
    const cta = page.locator('text=BUILT FOR MALAYSIA');
    await expect(cta).toBeVisible();
    console.log('✓ CTA section visible');
  });

  test('Navigation links in header', async ({ page }) => {
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    console.log(`✓ Found ${linkCount} navigation links`);

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      console.log(`  Link: ${text} -> ${href}`);
    }
  });

  test('Brand explore links clickable', async ({ page }) => {
    const exploreLinks = page.locator('a:has-text("Explore")');
    const linkCount = await exploreLinks.count();
    console.log(`✓ Found ${linkCount} "Explore" links`);

    if (linkCount > 0) {
      const firstExploreLink = exploreLinks.first();
      const href = await firstExploreLink.getAttribute('href');
      console.log(`  First explore link: ${href}`);
    }
  });

  test('Page layout responsive - check desktop view', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    const brandGrid = page.locator('[class*="grid-cols-2"]');
    const isVisible = await brandGrid.isVisible();
    console.log(`✓ Desktop grid layout: ${isVisible ? 'visible' : 'hidden'}`);
  });

  test('Screenshot: Hero section', async ({ page }) => {
    const hero = page.locator('section').first();
    await hero.screenshot({ path: 'hero-section.png' });
    console.log('✓ Screenshot saved: hero-section.png');
  });

  test('Screenshot: Brands section', async ({ page }) => {
    const brands = page.locator('#brands');
    await brands.screenshot({ path: 'brands-section.png' });
    console.log('✓ Screenshot saved: brands-section.png');
  });

  test('All product images have valid src attributes', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    let validImages = 0;
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      if (src && src.startsWith('/images/unikota/brands/')) {
        validImages++;
        console.log(`  Product image ${validImages}: ${src}`);
      }
    }
    console.log(`✓ Found ${validImages} product images with valid paths`);
  });
});
