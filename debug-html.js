const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });

    const html = await page.content();

    // Extract just the main element
    const mainMatch = html.match(/<main[^>]*>[\s\S]*?<\/main>/);
    if (mainMatch) {
      const mainContent = mainMatch[0];
      // Show first 2000 chars
      console.log('=== MAIN CONTENT ===\n');
      console.log(mainContent.substring(0, 2000));
      console.log('\n... (truncated)\n');

      // Count sections
      const sections = mainContent.match(/<section/g) || [];
      console.log(`Total sections in main: ${sections.length}`);

      // Look for #brands
      if (mainContent.includes('id="brands"')) {
        console.log('✓ #brands section FOUND in HTML');
      } else {
        console.log('✗ #brands section NOT in HTML');
      }

      // Look for brand names
      const brandMatches = mainContent.match(/Cili|Wasabi|Unisoft|Aimishu/g) || [];
      console.log(`Brand name mentions: ${brandMatches.length}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
