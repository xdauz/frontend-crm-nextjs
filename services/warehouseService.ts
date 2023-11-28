import { WarehouseItem, Supplier } from "@/components/pages/warehouse/schema";

// const API_ENDPOINT = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_ENDPOINT = 'https://991ab464-a434-4220-bb4c-330b652ba070.mock.pstmn.io';

export const warehouseService = {

  async getWarehouseItems(query?: string): Promise<WarehouseItem[]> {
    let url = API_ENDPOINT + '/warehouse'
    if (query) {
      url += '?query=' + query
    }

    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      return [

        {
          "id": 12,
          "name": "TP-Link 840N",
          "serial_number": "1000054282",
          "status_key": "in_stock",
          "purchase_price": 15,
          "purchase_date": "05.11.2023",
          "purchase_currency": "USD",
          "supplier": {
            "id": 1,
            "name": "Женя TP-Link"
          }
        },
        {
          "id": 11,
          "name": "TP-Link 840N",
          "serial_number": "1000054182",
          "status_key": "in_stock",
          "purchase_price": 15,
          "purchase_date": "05.11.2023",
          "purchase_currency": "USD",
          "supplier": {
            "id": 1,
            "name": "Женя TP-Link"
          }
        }
      ]
    }

    const items = await response.json();
    // Here you would validate the structure of `items` to match `WarehouseItem[]`
    return items;
  },

  async getSuppliers(query?: string): Promise<Supplier[]> {
    let url = API_ENDPOINT + '/suppliers'
    if (query) {
      url += '?query=' + query
    }

    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      return [
        {
          "id": 2,
          "name": "Asus A16"
        },
        {
          "id": 1,
          "name": "Женя TP-Link"
        }
      ]
    }

    const suppliers = await response.json();
    // Here you would validate the structure of `suppliers` to match `Supplier[]`
    return suppliers;
  }
};