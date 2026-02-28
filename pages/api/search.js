export default async function handler(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    const isBarcode = /^\d{8,14}$/.test(query);
    let response;

    // ------------------------
    // BARCODE SEARCH
    // ------------------------
    if (isBarcode) {
      response = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${query}.json`
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("OpenFoodFacts error:", text);
        return res.status(response.status).json({ error: text });
      }

      const data = await response.json();

      if (!data.product) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json({
        products: [data.product], // normalized response
      });
    }

    // ------------------------
    // NAME SEARCH
    // ------------------------
    response = await fetch(
      `https://world.openfoodfacts.net/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=30&fields=code,product_name,brands,image_small_url,nutriscore_grade`
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenFoodFacts error:", text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    return res.status(200).json({
      products: data.products || [],
    });

  } catch (error) {
    console.error("SEARCH API CRASH:", error);
    return res.status(500).json({ error: error.message });
  }
}