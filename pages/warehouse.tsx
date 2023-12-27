import { useState, useEffect } from 'react';
import Layout from "@/components/layout/layout";
import { columns } from "@/components/pages/warehouse/columns";
import { DataTable } from "@/components/pages/warehouse/data-table";
import { warehouseService } from '@/services/warehouseService';
import { WarehouseItem } from '@/components/pages/warehouse/schema';

export default function WarehousePage() {
  const [data, setData] = useState<WarehouseItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    warehouseService.getWarehouseItems()
      .then(function (response) {
        if (response.success) {
          setData(response.data || []);
        } else {
          console.error('Error fetching warehouse items:', response.error);
          setError('Failed to load data');
        }
      })
      .catch(error => {
        console.error('Error fetching warehouse items:', error);
        setError('Failed to load data');
      });
  }, []);

  return (
    <Layout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Склад</h2>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </Layout>
  )
}