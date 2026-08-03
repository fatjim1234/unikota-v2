const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('\n=== PRODUCTS PAGE INSPECTION ===\n');

    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });

    // Hero heading
    const heading = await page.$('h1');
    if (heading) {
      const text = await heading.textContent();
      console.log('✓ Hero heading:', text.trim());
    }

    // Brands section
    const brandsSection = await page.$('#brands');
    if (brandsSection) {
      console.log('✓ Brands section (#brands) exists');

      const images = await page.$$('#brands img');
      console.log(`✓ Brand images found: ${images.length}`);

      for (let i = 0; i < Math.min(images.length, 5); i++) {
        const src = await images[i].getAttribute('src');
        const alt = await images[i].getAttribute('alt');
        console.log(`  ${i + 1}. ${alt} -> ${src}`);
      }
    } else {
      console.log('✗ Brands section NOT found');
    }

    // Brand names
    const brands = ['Cili', 'Wasabi', 'Unisoft', 'Aimishu'];
    console.log('\nBrand sections:');
    for (const brand of brands) {
      const element = await page.locator(`text=${brand}`).count();
      console.log(`  ${brand}: ${element > 0 ? '✓' : '✗'}`);
    }

    // Care section
    const careSection = await page.$('text=Personal care');
    console.log(`\nCare section: ${careSection ? '✓' : '✗'}`);
    if (careSection) {
      const babylike = await page.locator('text=BabyLike').count();
      const sumo = await page.locator('text=SUMO').count();
      console.log(`  - BabyLike: ${babylike > 0 ? '✓' : '✗'}`);
      console.log(`  - SUMO: ${sumo > 0 ? '✓' : '✗'}`);
    }

    // Product families
    const families = await page.$('text=Product families');
    console.log(`Product families section: ${families ? '✓' : '✗'}`);

    // CTA
    const cta = await page.$('text=BUILT FOR MALAYSIA');
    console.log(`CTA section: ${cta ? '✓' : '✗'}`);

    // Navigation
    const navLinks = await page.$$('nav a');
    console.log(`\nNavigation links: ${navLinks.length} found`);
    for (let i = 0; i < navLinks.length; i++) {
      const text = await navLinks[i].textContent();
      const href = await navLinks[i].getAttribute('href');
      console.log(`  ${i + 1}. ${text?.trim()} -> ${href}`);
    }

    // Test a link click
    console.log('\nTesting navigation...');
    const aboutLink = await page.$('a[href="/about"]');
    if (aboutLink) {
      console.log('✓ About link found at /about');
    }

    const productsLink = await page.$('a[href="/products"]');
    if (productsLink) {
      console.log('✓ Products link found at /products');
    }

    // All images
    const allImages = await page.$$('img');
    console.log(`\nTotal images on page: ${allImages.length}`);

    // Product brand images specifically
    const productImages = await page.$$('img[src*="/images/unikota/brands/"]');
    console.log(`Product brand images: ${productImages.length}`);

    console.log('\n=== END INSPECTION ===\n');

    await page.screenshot({ path: 'products-inspection.png' });
    console.log('Screenshot saved: products-inspection.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
