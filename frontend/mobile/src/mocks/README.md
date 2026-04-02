# Mock Service Documentation

## Overview

The mock service replaces `json-server` with an **in-memory, type-safe API** service. This eliminates external dependencies while maintaining realistic development experience.

## Architecture

### Files

- **`data.ts`** — TypeScript types and data constants
  - All mock data exported as constants
  - 100% type-safe (no JSON parsing)
  - Easy to extend with new products, orders, etc.

- **`mockService.ts`** — In-memory API service
  - Exposes endpoints compatible with the HTTP client
  - Simulates network delays (~200ms) for realistic UI testing
  - Includes cloning to prevent mutations

### How It Works

1. **Auto-Detection**: `httpClient.ts` detects localhost and routes to mock service
2. **Mock Resolution**: Requests are mapped to mock endpoints
3. **Network Simulation**: Adds realistic delay before responding
4. **In-Memory**: All mutations are lost on app restart (intentional for dev)

## Usage

### Starting the App

```bash
cd frontend/mobile
npm install          # Install dependencies
npm start            # Starts Expo with mock service active
```

That's it. No additional terminals needed.

### Viewing Debug Logs

Open Expo DevTools to see mock service logs:

```
[api:mock] /api/v1/products
[api:mock] /api/v1/home/categories
```

## Available Endpoints

### Products

- `GET /api/v1/products` — List all products
- `GET /api/v1/products/:id` — Get product details

### Catalog

- `GET /api/v1/catalog/categories` — List catalog categories

### Home

- `GET /api/v1/home/categories` — List home categories with icons
- `GET /api/v1/home/promos` — List home promotions

### Cart (Mutations)

- `GET /api/v1/cart` — List cart items
- `GET /api/v1/cart/add/:productId/:quantity` — Add product to cart (or increment quantity)
- `GET /api/v1/cart/update/:productId/:quantity` — Set an item quantity
- `GET /api/v1/cart/remove/:productId` — Remove a product from cart

### Orders (Mutations)

- `GET /api/v1/orders` — List orders
- `POST /api/v1/orders` — Create new order

### Notifications

- `GET /api/v1/notifications` — List in-app notifications
- `GET /api/v1/notifications/:id/read` — Mark one notification as read
- `GET /api/v1/notifications/mark-all-read` — Mark all notifications as read

### Auth

- `GET /api/v1/auth/defaults` — Get default country, region

## Extending the Mock Data

### Adding a New Product

Edit `src/mocks/data.ts`:

```typescript
export const PRODUCTS: ProductModel[] = [
  // ... existing products
  {
    id: 'prod-9',
    name: 'New Product',
    price: 50000,
    currency: 'FCFA',
    description: 'A new product',
    imageUrl: 'https://...',
    stockStatus: 'in_stock',
    categoryId: 'outillage',
  },
];
```

Then restart the app. No recompilation needed — data will load automatically.

### Adding a New Endpoint

Edit `src/mocks/mockService.ts`:

```typescript
export const mockServiceApi = {
  // ... existing methods
  
  async getMyNewEndpoint(): Promise<MyData[]> {
    await sleep(NETWORK_DELAY_MS);
    return clone(MY_DATA);
  },
};
```

Then map it in `httpClient.ts`:

```typescript
const getMockResponse = async <T>(path: string): Promise<T> => {
  // ... existing mappings
  
  if (normalizedPath === 'api/v1/my-endpoint') {
    return (await mockServiceApi.getMyNewEndpoint()) as T;
  }
};
```

## Persistence (Future)

Currently, mutations (add to cart, create order) are **lost on app restart**. This is intentional for dev.

To add persistence, you can enhance `mockService.ts` to use:
- `localStorage` (web)
- `MMKV` React Native storage (mobile)
- `AsyncStorage` (mobile)

## Performance Tips

- **Network delay**: Adjust `NETWORK_DELAY_MS` in `mockService.ts` to test slow networks
- **Large datasets**: The mock service handles arrays efficiently; add test data as needed
- **No limits**: Unlike json-server pagination, mock service returns all data

## Troubleshooting

### "API endpoint not found" error

Check that the request path matches a mapped endpoint in `getMockResponse()` in `httpClient.ts`.

### Mutations not persisting

This is expected. Mock data is in-memory only. Restart the app: mutations are reset.

### Still seeing json-server references

- Delete `./mock-server/` folder
- Run `npm install` to sync node_modules
- Clear Expo cache: `npm start --clear`

## Migration from json-server

✅ **Completed**:
- ✓ Removed json-server dependency
- ✓ Removed ngrok tunnel setup
- ✓ Replaced db.json with TypeScript data
- ✓ Auto-detect localhost in httpClient
- ✓ Network delay simulation

❌ **Removed**:
- ✗ `npm run mock:server`
- ✗ `npm run mock:server:tunnel`
- ✗ `EXPO_PUBLIC_API_TUNNEL_BASE_URL` (no longer needed)

## Next Steps

1. **Run the app** — `npm start`
2. **Test screens** — HomeScreen, CatalogScreen, ProductDetailScreen
3. **Add more data** — Edit `src/mocks/data.ts`
4. **Build features** — Use the mock service while backend is in development
