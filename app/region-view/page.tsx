"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BarChart } from "../../src/components/ui/bar-chart";
import { LineChart } from "../../src/components/ui/charts/LineChart";
import { Table } from "../../src/components/ui/table";
import { BubbleMap } from "../../src/components/ui/charts/BubbleMap";

import {
  MarketingData,
  Campaign,
  RegionalPerformance,
  WeeklyPerformance
} from "../../src/types/marketing";

import { fetchMarketingDataClient } from "../../src/lib/api";


// ========== PROCESS WEEKLY DATA ==========
const processWeeklyData = (campaigns: Campaign[]) => {
  const weekMap: Record<
    string,
    {
      week: string;
      revenue: number;
      spend: number;
      impressions: number;
      clicks: number;
      conversions: number;
    }
  > = {};

  campaigns.forEach((campaign) => {
    campaign.weekly_performance.forEach((week: WeeklyPerformance) => {
      const key = week.week_start;

      if (!weekMap[key]) {
        weekMap[key] = {
          week: key,
          revenue: week.revenue,
          spend: week.spend,
          impressions: week.impressions,
          clicks: week.clicks,
          conversions: week.conversions,
        };
      } else {
        weekMap[key].revenue += week.revenue;
        weekMap[key].spend += week.spend;
        weekMap[key].impressions += week.impressions;
        weekMap[key].clicks += week.clicks;
        weekMap[key].conversions += week.conversions;
      }
    });
  });

  return Object.values(weekMap).sort(
    (a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()
  );
};


// ========== PROCESS REGIONAL DATA ==========
const processRegionalData = (campaigns: Campaign[]) => {
  const regionMap: Record<
    string,
    {
      region: string;
      country: string;
      totalRevenue: number;
      totalSpend: number;
      totalImpressions: number;
      totalClicks: number;
      totalConversions: number;
      roas: number;
    }
  > = {};

  campaigns.forEach((campaign) => {
    campaign.regional_performance.forEach((region: RegionalPerformance) => {
      if (!regionMap[region.region]) {
        regionMap[region.region] = {
          region: region.region,
          country: region.country,
          totalRevenue: region.revenue,
          totalSpend: region.spend,
          totalImpressions: region.impressions,
          totalClicks: region.clicks,
          totalConversions: region.conversions,
          roas: region.spend ? region.revenue / region.spend : 0,
        };
      } else {
        regionMap[region.region].totalRevenue += region.revenue;
        regionMap[region.region].totalSpend += region.spend;
        regionMap[region.region].totalImpressions += region.impressions;
        regionMap[region.region].totalClicks += region.clicks;
        regionMap[region.region].totalConversions += region.conversions;
      }
    });
  });

  return Object.values(regionMap);
};


// ========== MAIN COMPONENT ==========
export default function RegionView() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch API data
  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchMarketingDataClient();
        setData(result);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center text-white">
        Loading region data...
      </div>
    );
  }


  // Extract processed data
  const regionalData = processRegionalData(data.campaigns);
  const weeklyData = processWeeklyData(data.campaigns);

  const topRegion =
    (regionalData.sort((a, b) => b.totalRevenue - a.totalRevenue)[0] ||
      null) as {
      region: string;
      totalRevenue: number;
    } | null;

  const totalROAS =
    data.marketing_stats.total_spend > 0
      ? data.marketing_stats.total_revenue / data.marketing_stats.total_spend
      : 0;

  // -------- Line Chart --------
  const lineChartData = {
    labels: weeklyData.map((w) =>
      new Date(w.week).toLocaleDateString("en-US")
    ),
    datasets: [
      {
        label: "Weekly Revenue",
        data: weeklyData.map((w) => w.revenue),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Weekly Spend",
        data: weeklyData.map((w) => w.spend),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // -------- Bar Chart --------
  const barChartData = regionalData
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 7)
    .map((region) => ({
      label: region.region,
      value: region.totalRevenue,
    }));

  // -------- Bubble Map --------
  const bubbleMapData = regionalData.map((r) => ({
    id: r.region,
    name: r.region,
    country: r.country,
    value: r.totalRevenue,
    spend: r.totalSpend,
    revenue: r.totalRevenue,
    impressions: r.totalImpressions,
    clicks: r.totalClicks,
    conversions: r.totalConversions,
    roas: r.roas,
  }));

  // -------- Table --------
  const tableColumns = [
    { key: "region", header: "Region", sortable: true },
    { key: "country", header: "Country", sortable: true },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      render: (v: number) => (
        <span className="text-green-400 font-medium">
          {v.toLocaleString()} SAR
        </span>
      ),
    },
    {
      key: "totalSpend",
      header: "Spend",
      sortable: true,
      render: (v: number) => (
        <span className="text-red-400 font-medium">
          {v.toLocaleString()} SAR
        </span>
      ),
    },
    {
      key: "roas",
      header: "ROAS",
      sortable: true,
      render: (v: number) => (
        <span className="font-bold text-blue-400">{v.toFixed(1)}x</span>
      ),
    },
    { key: "totalConversions", header: "Conversions", sortable: true },
    { key: "totalClicks", header: "Clicks", sortable: true },
  ];


  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HERO */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-12 text-center text-white">
          <h1 className="text-4xl font-bold">Region View</h1>
          <p className="text-gray-400 mt-2">
            Marketing campaign performance by region
          </p>
        </section>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <CardMetric
              title="Total Revenue"
              value={data.marketing_stats.total_revenue.toLocaleString()}
            />
            <CardMetric
              title="Total Spend"
              value={data.marketing_stats.total_spend.toLocaleString()}
            />
            <CardMetric title="Average ROAS" value={`${totalROAS.toFixed(1)}x`} />

            <CardMetric
              title="Top Region"
              value={topRegion?.region || "N/A"}
            />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">
                Weekly Revenue vs Spend
              </h2>
              <div className="h-80">
                <LineChart data={lineChartData} />
              </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">
                Top Regions
              </h2>

              <div className="space-y-3">
                {regionalData
                  .sort((a, b) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 5)
                  .map((region) => (
                    <div
                      key={region.region}
                      className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                    >
                      <span className="text-white font-medium">
                        {region.region}
                      </span>
                      <span className="text-green-400 font-semibold">
                        {(region.totalRevenue / 1000).toFixed(1)}K
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* BUBBLE MAP */}
          <div className="bg-gray-800 p-5 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Campaign Distribution by Region
            </h2>
            <div className="h-96">
              <BubbleMap data={bubbleMapData} />
            </div>
          </div>

          {/* BAR CHART */}
          <div className="bg-gray-800 p-5 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Revenue by Region
            </h2>
            <BarChart title="" data={barChartData} />
          </div>

          {/* TABLE */}
          <Table
            title="Regional Breakdown"
            columns={tableColumns}
            data={regionalData}
            showIndex={true}
            maxHeight="500px"
          />

        </div>

        <Footer />
      </div>
    </div>
  );
}
