# API for creating and managing stock

## Description
This API allows you to manage stock by adding products with an ID, allowing you to modify, create, delete and list products

## Endpoints
- **POST /products**: Creates a new product
- **GET /products**: Lists ALL products
- **GET /products/:id**: Searches a product using its ID
- **PUT /products/:id**: Modifies a product using its ID
- **DELETE /products/:id**: Deletes a product using its ID

## JSON STRUCTURE
```json
{
    "id": 1,
    "title": "Produto Exemplo",
    "description": "Descrição do produto",
    "quantity": 10
}