export default async function handler(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&page_size=10&fields=code,product_name,brands,image_small_url,nutriscore_grade`;


    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenFoodFacts error:", text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("SEARCH API CRASH:", error);
    return res.status(500).json({ error: error.message });
  }
}