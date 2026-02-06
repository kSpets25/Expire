

export default async function handler(req, res) {
    const { barcode, name } = req.query;
  
    if (!barcode && !name) {
      return res.status(400).json({ success: false, message: "Provide barcode or name" });
    }
  
    try {
      let url;
  
      if (barcode) {
        // Fetch by barcode
        url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
        const response = await fetch(url);
        const data = await response.json();
  
        if (data.status === 0) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
  
        return res.status(200).json({ success: true, product: data.product });
      } else {
        // Fetch by product name
        // Limit results to 10 products
        url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          name
        )}&search_simple=1&action=process&json=1&page_size=10`;
        const response = await fetch(url);
        const data = await response.json();
  
        if (!data.products || data.products.length === 0) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
  
        return res.status(200).json({ success: true, product: data.products });
      }
    } catch (error) {
      console.error("API ERROR:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  