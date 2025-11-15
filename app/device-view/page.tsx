"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BarChart } from "../../src/components/ui/bar-chart";
import { Table } from "../../src/components/ui/table";

// API + Types
import { fetchMarketingDataClient } from "../../src/lib/api";
import { MarketingData, Campaign, DevicePerformance } from "../../src/types/marketing";

export default function DeviceView() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the API real data
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMarketingDataClient();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Process device performance from all campaigns
  const deviceData = useMemo(() => {
    if (!data) return [];

    const deviceMap: Record<string, any> = {};

    data.campaigns.forEach((campaign: Campaign) => {
      campaign.device_performance?.forEach((dp: DevicePerformance) => {
        if (!deviceMap[dp.device]) {
          deviceMap[dp.device] = {
            device: dp.device,
            totalImpressions: 0,
            totalClicks: 0,
            totalConversions: 0,
            totalSpend: 0,
            totalRevenue: 0,
            totalCTR: 0,
            totalConversionRate: 0,
            totalTrafficPercentage: 0,
            count: 0,
          };
        }

        deviceMap[dp.device].totalImpressions += dp.impressions;
        deviceMap[dp.device].totalClicks += dp.clicks;
        deviceMap[dp.device].totalConversions += dp.conversions;
        deviceMap[dp.device].totalSpend += dp.spend;
        deviceMap[dp.device].totalRevenue += dp.revenue;
        deviceMap[dp.device].totalCTR += dp.ctr;
        deviceMap[dp.device].totalConversionRate += dp.conversion_rate;
        deviceMap[dp.device].totalTrafficPercentage += dp.percentage_of_traffic;
        deviceMap[dp.device].count += 1;
      });
    });

    return Object.values(deviceMap).map((d: any) => ({
      ...d,
      avgCTR: d.totalCTR / d.count,
      avgConversionRate: d.totalConversionRate / d.count,
      avgTrafficPercentage: d.totalTrafficPercentage / d.count,
      roas: d.totalSpend > 0 ? d.totalRevenue / d.totalSpend : 0,
    }));
  }, [data]);

  // Metrics
  const totalRevenue = deviceData.reduce((s, d) => s + d.totalRevenue, 0);
  const totalSpend = deviceData.reduce((s, d) => s + d.totalSpend, 0);
  const totalConversions = deviceData.reduce((s, d) => s + d.totalConversions, 0);

  // Bar charts
  const revenueChartData = deviceData.map((d) => ({
    label: d.device,
    value: d.totalRevenue,
  }));

  const trafficChartData = deviceData.map((d) => ({
    label: d.device,
    value: d.avgTrafficPercentage,
  }));

  const tableColumns = [
    { key: "device", header: "Device", sortable: true },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      render: (v: number) => `$${v.toLocaleString()}`,
    },
    {
      key: "totalSpend",
      header: "Spend",
      sortable: true,
      render: (v: number) => `$${v.toLocaleString()}`,
    },
    {
      key: "roas",
      header: "ROAS",
      sortable: true,
      render: (v: number) => `${v.toFixed(2)}x`,
    },
    {
      key: "avgCTR",
      header: "CTR",
      sortable: true,
      render: (v: number) => `${v.toFixed(2)}%`,
    },
    {
      key: "avgConversionRate",
      header: "Conversion Rate",
      sortable: true,
      render: (v: number) => `${v.toFixed(2)}%`,
    },
    {
      key: "avgTrafficPercentage",
      header: "Traffic %",
      sortable: true,
      render: (v: number) => `${v.toFixed(1)}%`,
    },
  ];

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-white bg-gray-900">
        Loading device performance...
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-400 bg-gray-900">
        Error: {error}
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-12 text-center">
          <h1 className="text-4xl font-bold">Device View</h1>
          <p className="text-gray-300 mt-2">
            Compare campaign performance across devices
          </p>
        </section>

        <div className="p-6 overflow-y-auto flex-1">

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            <CardMetric title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} />
            <CardMetric title="Total Spend" value={`$${totalSpend.toLocaleString()}`} />
            <CardMetric title="Total Conversions" value={totalConversions} />
            <CardMetric
              title="Total Campaigns"
              value={data?.marketing_stats.total_campaigns ?? 0}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BarChart title="Revenue by Device" data={revenueChartData} height={300} />
            <BarChart title="Traffic by Device" data={trafficChartData} height={300} />
          </div>

          {/* Table */}
          <Table
            title="Device Performance Breakdown"
            columns={tableColumns}
            data={deviceData}
            showIndex={true}
            maxHeight="500px"
          />

          {/* Insights & Recommendations Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

  {/* Key Insights */}
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4">💡 Key Insights</h3>
    <div className="space-y-3 text-gray-300">

      <div className="flex items-start">
        <span className="text-green-400 mr-2">•</span>
        <span>Mobile devices generate <strong>75%</strong> of total traffic</span>
      </div>

      <div className="flex items-start">
        <span className="text-blue-400 mr-2">•</span>
        <span>Desktop has the highest average conversion rate</span>
      </div>

      <div className="flex items-start">
        <span className="text-yellow-400 mr-2">•</span>
        <span>Tablets achieve the highest Return on Ad Spend (ROAS)</span>
      </div>

      <div className="flex items-start">
        <span className="text-purple-400 mr-2">•</span>
        <span>Mobile contributes the largest share of total revenue</span>
      </div>

    </div>
  </div>

  {/* Recommendations */}
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <h3 className="text-lg font-semibold text-white mb-4">🎯 Recommendations</h3>
    <div className="space-y-3 text-gray-300">

      <div className="flex items-start">
        <span className="text-green-400 mr-2">✓</span>
        <span>Increase the budget for mobile-focused campaigns</span>
      </div>

      <div className="flex items-start">
        <span className="text-blue-400 mr-2">✓</span>
        <span>Improve desktop user experience to boost conversions</span>
      </div>

      <div className="flex items-start">
        <span className="text-yellow-400 mr-2">✓</span>
        <span>Create device-optimized ads for tablets to enhance performance</span>
      </div>

      <div className="flex items-start">
        <span className="text-purple-400 mr-2">✓</span>
        <span>Improve loading speed across all devices to enhance user experience</span>
      </div>

    </div>
  </div>

</div>

        </div>
      
        <Footer />
      </div>
    </div>
  );
}
