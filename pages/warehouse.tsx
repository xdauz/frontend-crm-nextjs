import { useState, useEffect } from 'react';
import Layout from "@/components/layout/layout";
import { columns } from "@/components/pages/warehouse/columns";
import { DataTable } from "@/components/pages/warehouse/data-table";
import { WarehouseItem } from '@/components/pages/warehouse/schema';

async function getData(): Promise<WarehouseItem[]> {
  //fetch data from API here

  return [
    {
      id: 1231231,
      name: "TP-Link 840N",
      serial_number: "1000054878",
      status_key: "in_stock",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
    {
      id: 1231232,
      name: "TP-Link 840N",
      serial_number: "1000054879",
      status_key: "sold",
      purchase_price: 15,
      purchase_currency: "USD",
      purchase_date: "05.11.2023",
      supplier: {
        id: 1,
        name: "Женя TP-Link",
      },
    },
  ]
}

export default function WarehousePage() {
  const [data, setData] = useState<WarehouseItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      // fetch data from API here
      const result = await getData();
      setData(result);
    }

    fetchData();
  }, []); // The empty array ensures this effect runs only once after the initial render
  
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