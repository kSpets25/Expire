export default async function handler(req, res) {
    const { code } = req.query;
  
    if (!code) {
      return res.status(400).json({ error: "Missing barcode" });
    }
  
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${code}.json`
      );
  
      const data = await response.json();
      res.status(200).json(data);
  
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }