import { WarehouseItem, Supplier } from "@/components/pages/warehouse/schema";

// const API_ENDPOINT = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_ENDPOINT = 'https://991ab464-a434-4220-bb4c-330b652ba070.mock.pstmn.io';

export const warehouseService = {

  async getWarehouseItems(query?: string): Promise<WarehouseItem[]> {
    let url = API_ENDPOINT  + '/warehouse'
    if (query) {
      url += '?query=' + query
    }

    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      return []
    }
    
    const items = await response.json();
    // Here you would validate the structure of `items` to match `WarehouseItem[]`
    return items;
  },

  async getSuppliers(query?: string): Promise<Supplier[]> {
    let url = API_ENDPOINT  + '/suppliers'
    if (query) {
      url += '?query=' + query
    }

    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      return []
    }
    
    const suppliers = await response.json();
    // Here you would validate the structure of `suppliers` to match `Supplier[]`
    return suppliers;
  }
};