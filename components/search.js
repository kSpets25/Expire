
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import styles from "./search.module.css";

export default function Search() {
    const router = useRouter();
    const { barcode: queryBarcode, name: queryName } = router.query;
  
    const [barcode, setBarcode] = useState(queryBarcode || "");
    const [name, setName] = useState(queryName || "");
  const [products, setProducts] = useState([]);
  const [expirationDates, setExpirationDates] = useState({});
  const [quantities, setQuantities] = useState({});
  const [unitsType, setUnitsType] = useState({}); // "item" or "case"
  const [itemsPerCase, setItemsPerCase] = useState({}); // number of items per case
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryBarcode || queryName) {
      fetchProduct(); // automatically fetch previous search results
    }
  }, [queryBarcode, queryName]);

  const fetchProduct = async () => {
    if (!barcode && !name) return alert("Enter barcode or product name");

    setLoading(true);
    const query = barcode ? `barcode=${barcode}` : `name=${name}`;

    try {
      const res = await fetch(`/api/product?${query}`);
      const data = await res.json();

      if (data.success) {
        const result = Array.isArray(data.product) ? data.product : [data.product];
        setProducts(result);

        router.replace(`search-products?${barcode ? `barcode=${barcode}` : `name=${name}`}`, undefined, {
            shallow: true,
          });
      } else {
        setProducts([]);
        alert(data.message || "Product not found");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error fetching product");
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = (product) => {
    const expirationDate = expirationDates[product.code] || "";
    const type = unitsType[product.code] || "item";
    const quantityInput = quantities[product.code];
    const perCase = itemsPerCase[product.code] || 1;

    if (!expirationDate) return alert("Please enter an expiration date");
    if (!quantityInput || quantityInput <= 0) return alert("Enter a valid quantity");

    const totalQuantity = type === "case" ? quantityInput * perCase : quantityInput;

    const saved = JSON.parse(localStorage.getItem("savedProducts")) || [];
    const exists = saved.some((p) => p.code === product.code);

    if (exists) return alert("Product already saved");

    const productToSave = {
      ...product,
      expirationDate,
      quantity: totalQuantity,
      unitType: type,
      itemsPerCase: type === "case" ? perCase : 1,
      savedAt: new Date().toISOString(),
    };

    saved.push(productToSave);
    localStorage.setItem("savedProducts", JSON.stringify(saved));

    // Clear inputs
    setExpirationDates((prev) => ({ ...prev, [product.code]: "" }));
    setQuantities((prev) => ({ ...prev, [product.code]: "" }));
    setUnitsType((prev) => ({ ...prev, [product.code]: "item" }));
    setItemsPerCase((prev) => ({ ...prev, [product.code]: "" }));

    alert("Product saved!");
  };

  return (
   
    <div className={styles.searchContainer}>
      <div className={styles.searchInputs}>
        <input
          type="text"
          placeholder="Enter barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Or enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <button onClick={fetchProduct} className={styles.button}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.code || product.id} className={styles.productCard}>
            {product.image_small_url && (
              <img src={product.image_small_url} alt={product.product_name} />
            )}
            <h3>{product.product_name}</h3>
            <p>Brand: {product.brands || "Unknown"}</p>
            <p>Barcode: {product.code || "N/A"}</p>
            {product.nutriscore_grade && (
              <span
                className={`${styles.nutriscore} ${
                  styles[`nutriscore${product.nutriscore_grade.toUpperCase()}`]
                }`}
              >
                Nutri-Score: {product.nutriscore_grade.toUpperCase()}
              </span>
            )}

            {/* Expiration + quantity + unit type */}
            {/* Expiration + quantity + unit type + save button */}

            <div className={styles.cardControls}>
  {/* Expiration date */}
  <input
    type="date"
    value={expirationDates[product.code] || ""}
    onChange={(e) =>
      setExpirationDates({ ...expirationDates, [product.code]: e.target.value })
    }
    className={styles.controlInput}
  />

  {/* Quantity + unit type */}
  <div className={styles.quantityGroup}>
    <input
      type="number"
      min="1"
      placeholder="Qty"
      value={quantities[product.code] || ""}
      onChange={(e) =>
        setQuantities({ ...quantities, [product.code]: e.target.value })
      }
      className={styles.controlInput}
    />

    <select
      value={unitsType[product.code] || "item"}
      onChange={(e) =>
        setUnitsType({ ...unitsType, [product.code]: e.target.value })
      }
      className={styles.controlInput}
    >
      <option value="item">Item(s)</option>
      <option value="case">Case(s)</option>
    </select>

    {unitsType[product.code] === "case" && (
      <input
        type="number"
        min="1"
        placeholder="Items/Case"
        value={itemsPerCase[product.code] || ""}
        onChange={(e) =>
          setItemsPerCase({ ...itemsPerCase, [product.code]: e.target.value })
        }
        className={styles.controlInput}
      />
    )}
  </div>

  {/* Save button */}
  <button
    onClick={() => saveProduct(product)}
    className={styles.button}
  >
    Save
  </button>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}
