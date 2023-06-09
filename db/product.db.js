const pool = require("../config");

const getAllProductsDb = async ({ limit, offset }) => {
	const { rows } = await pool.query(
		`select products.*, trunc(avg(reviews.rating)) as avg_rating, count(reviews.*) from products
        LEFT JOIN reviews
        ON products.product_id = reviews.product_id
        group by products.product_id limit $1 offset $2 `,
		[limit, offset]
	);
	const products = [...rows].sort(() => Math.random() - 0.5);
	return products;
};

const createProductDb = async ({
	category,
	name,
	price,
	description,
	image_url,
	inventory,
	store_id,
}) => {
	const { rows: product } = await pool.query(
		"INSERT INTO products(category, name, price, description, image_url, inventory, store_id) VALUES($1, $2, $3, $4, $5, $6, $7) returning *",
		[category, name, price, description, image_url, inventory, store_id]
	);
	return product[0];
};

const getProductDb = async ({ id }) => {
	const { rows: product } = await pool.query(
		`select products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) from products
        LEFT JOIN reviews
        ON products.product_id = reviews.product_id
        where products.product_id = $1
        group by products.product_id`,
		[id]
	);
	return product[0];
};

const getProductByNameDb = async ({ name }) => {
	const { rows: product } = await pool.query(
		`select products.*, trunc(avg(reviews.rating),1) as avg_rating, count(reviews.*) from products
        LEFT JOIN reviews
        ON products.product_id = reviews.product_id
        where products.name = $1
        group by products.product_id`,
		[name]
	);
	return product[0];
};

const updateProductDb = async ({ name, inventory, id }) => {
	const { rows: product } = await pool.query(
		"UPDATE products set name = $1, inventory = $2 where product_id = $3 returning *",
		[name, inventory, id]
	);
	return product[0];
};

const deleteProductDb = async ({ id }) => {
	const { rows } = await pool.query(
		"DELETE FROM products where product_id = $1 returning *",
		[id]
	);
	return rows[0];
};

module.exports = {
	getProductDb,
	getProductByNameDb,
	createProductDb,
	updateProductDb,
	deleteProductDb,
	getAllProductsDb,
};
