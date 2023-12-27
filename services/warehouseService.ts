import { WarehouseItem, Supplier, Product } from "@/components/pages/warehouse/schema";

const API_ENDPOINT = 'http://api.crm.cyber.local/api';

// Define a union type for the service response
type ServiceResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: any;
};

const handleResponse = async <T>(response: Response): Promise<ServiceResponse<T>> => {
  try {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const warehouseService = {
  async getProducts(query?: string): Promise<ServiceResponse<Product[]>> {
    let url = `${API_ENDPOINT}/products`;
    if (query) {
      url += `?q=${query}`;
    }

    const response = await fetch(url);

    return handleResponse<Product[]>(response);
  },

  async getWarehouseItem(id: string): Promise<ServiceResponse<WarehouseItem>> {
    const url = `${API_ENDPOINT}/warehouse/items/${id}`;
    const response = await fetch(url);
    return handleResponse<WarehouseItem>(response);
  },

  async getWarehouseItems(query?: string): Promise<ServiceResponse<WarehouseItem[]>> {
    let url = `${API_ENDPOINT}/warehouse/items`;
    if (query) {
      url += `?q=${query}`;
    }

    const response = await fetch(url);
    return handleResponse<WarehouseItem[]>(response);
  },

  async getSuppliers(query?: string): Promise<ServiceResponse<Supplier[]>> {
    let url = `${API_ENDPOINT}/suppliers`;
    if (query) {
      url += `?q=${query}`;
    }

    const response = await fetch(url);
    return handleResponse<Supplier[]>(response);
  },
  
  async storeWarehouseItem(data: object): Promise<ServiceResponse<any>> {
    const url = `${API_ENDPOINT}/warehouse/items`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return handleResponse<any>(response);
  },
  
  async updateWarehouseItem(id: string, data: object): Promise<ServiceResponse<any>> {
    const url = `${API_ENDPOINT}/warehouse/items/${id}`;
    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return handleResponse<any>(response);
  },

  async deleteWarehouseItem(id: string): Promise<ServiceResponse<any>> {
    const url = `${API_ENDPOINT}/warehouse/items/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return handleResponse<any>(response);
  },
};