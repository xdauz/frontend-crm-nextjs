import { WarehouseItem, Supplier } from "@/components/pages/warehouse/schema";

const API_ENDPOINT = 'http://api.crm.cyber.local';

// Mocked responses for cases where the API request fails
const MOCKED_WAREHOUSE_ITEM: WarehouseItem = {
  "id": 12,
  "name": "TP-Link 840N",
  "serial_number": "1000054282",
  "status_key": "in_stock",
  "price": 15,
  "date": "05.11.2023",
  "currency": "USD",
  "supplier": {
    "id": 1,
    "name": "Женя TP-Link"
  }
};

const MOCKED_WAREHOUSE_ITEMS: WarehouseItem[] = [MOCKED_WAREHOUSE_ITEM];

const MOCKED_SUPPLIERS: Supplier[] = [
  {
    "id": 2,
    "name": "Asus A16"
  },
  {
    "id": 1,
    "name": "Женя TP-Link"
  }
];

export const warehouseService = {
  async getWarehouseItem(id: string): Promise<WarehouseItem> {
    try {
      const url = `${API_ENDPOINT}/warehouse/items/${id}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch warehouse item with id ${id}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching warehouse item:", error);
      return MOCKED_WAREHOUSE_ITEM; // Return mocked response on error
    }
  },

  async getWarehouseItems(query?: string): Promise<WarehouseItem[]> {
    try {
      let url = `${API_ENDPOINT}/warehouse/items`;
      if (query) {
        url += `?query=${query}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch warehouse items");
      }

      const items = await response.json();
      // Validate the structure of `items` to match `WarehouseItem[]` if necessary

      return items;
    } catch (error) {
      console.error("Error fetching warehouse items:", error);
      return MOCKED_WAREHOUSE_ITEMS; // Return mocked response on error
    }
  },

  async getSuppliers(query?: string): Promise<Supplier[]> {
    try {
      let url = `${API_ENDPOINT}/suppliers`;
      if (query) {
        url += `?query=${query}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }

      const suppliers = await response.json();
      // Validate the structure of `suppliers` to match `Supplier[]` if necessary

      return suppliers;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return MOCKED_SUPPLIERS; // Return mocked response on error
    }
  },
  
  async updateWarehouseItem(id: string, data: Object): Promise<any> {
    try {
      const url = `${API_ENDPOINT}/warehouse/items/${id}`;
      const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch warehouse item with id ${data.id}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching warehouse item:", error);
      return true;
    }
  },
};