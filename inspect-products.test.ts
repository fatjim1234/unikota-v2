import { test } from '@playwright/test';

test('Inspect products page with actual images', async ({ page }) => {
  await page.goto('http://localhost:3000/products', { timeout: 30000 });

  console.log('\n=== PRODUCTS PAGE INSPECTION ===\n');

  // Check hero section
  try {
    const heading = await page.$('h1');
    if (heading) {
      const text = await heading.textContent();
      console.log('✓ Hero heading:', text);
    }
  } catch (e) {
    console.log('✗ Hero heading not found');
  }

  // Check brands section
  try {
    const brandsSection = await page.$('#brands');
    if (brandsSection) {
      console.log('✓ Brands section (#brands) found');

      // Get all images in brands section
      const images = await page.$$('#brands img');
      console.log(`✓ Found ${images.length} images in brands section`);

      for (let i = 0; i < images.length; i++) {
        const src = await images[i].getAttribute('src');
        const alt = await images[i].getAttribute('alt');
        console.log(`  Image ${i + 1}: ${alt} -> ${src}`);
      }
    }
  } catch (e) {
    console.log('✗ Brands section not found');
  }

  // Check for brand names
  const brands = ['Cili', 'Wasabi', 'Unisoft', 'Aimishu'];
  for (const brand of brands) {
    const element = await page.$(`text=${brand}`);
    if (element) {
      console.log(`✓ Brand "${brand}" text found`);
    } else {
      console.log(`✗ Brand "${brand}" text NOT found`);
    }
  }

  // Check care section
  try {
    const careSection = await page.$('text=Personal care');
    if (careSection) {
      console.log('✓ Care section found');

      const babylike = await page.$('text=BabyLike');
      const sumo = await page.$('text=SUMO');
      console.log(`  - BabyLike: ${babylike ? '✓' : '✗'}`);
      console.log(`  - SUMO: ${sumo ? '✓' : '✗'}`);
    }
  } catch (e) {
    console.log('✗ Care section not found');
  }

  // Check product families
  try {
    const familiesSection = await page.$('text=Product families');
    if (familiesSection) {
      console.log('✓ Product families section found');
    }
  } catch (e) {
    console.log('✗ Product families section not found');
  }

  // Check CTA
  try {
    const cta = await page.$('text=BUILT FOR MALAYSIA');
    if (cta) {
      console.log('✓ CTA section found (BUILT FOR MALAYSIA)');
    }
  } catch (e) {
    console.log('✗ CTA section not found');
  }

  // Navigation test
  try {
    const navLinks = await page.$$('nav a');
    console.log(`\n✓ Found ${navLinks.length} navigation links:`);

    for (let i = 0; i < navLinks.length; i++) {
      const text = await navLinks[i].textContent();
      const href = await navLinks[i].getAttribute('href');
      console.log(`  ${i + 1}. ${text?.trim()} -> ${href}`);
    }
  } catch (e) {
    console.log('✗ Navigation links not found');
  }

  // Check page structure
  const images = await page.$$('img');
  console.log(`\n✓ Total images on page: ${images.length}`);

  // Save screenshot
  await page.screenshot({ path: 'products-page-inspect.png' });
  console.log('\n✓ Screenshot saved: products-page-inspect.png');

  console.log('\n=== END INSPECTION ===\n');
});
