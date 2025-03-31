INSERT INTO product 
    (id, sku, name, brand, model, category, color, price, currency, stock, "isDeleted", "createdAt", "updatedAt")
SELECT '210tCQ54kvlhH3plIBhlUf', '1U31YZWN', 'LG AirPods Max', 'LG', 'AirPods Max', 'Headphones', 'Rose Gold', 1311.92, 'USD', 161, false, '2025-03-30T16:44:53.708Z', '2025-03-30T16:44:53.708Z'
WHERE NOT EXISTS (SELECT 1 FROM product);