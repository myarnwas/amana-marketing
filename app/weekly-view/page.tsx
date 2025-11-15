"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { SearchFilter } from "../../src/components/ui/search-filter";
import { DropdownFilter } from "../../src/components/ui/dropdown-filter";
import { LineChart } from "../../src/components/ui/charts/LineChart";
import { fetchMarketingDataClient } from "../../src/lib/api";
import { MarketingData, Campaign } from "../../src/types/marketing";

type WeekAgg = { revenue: number; spend: number };

export default function WeeklyView() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);

  // Fetch marketing data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMarketingDataClient();
        setData(res);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load weekly data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Aggregate weekly revenue and spend
  const {
    allWeekLabels,
    chartLabels,
    totalRevenue,
    totalSpend,
    chartData,
  } = useMemo(() => {
    const weekMap: Record<string, WeekAgg> = {};
    const campaigns: Campaign[] = data?.campaigns ?? [];

    // Filter campaigns by search query
    const filteredCampaigns =
      searchQuery.trim().length > 0
        ? campaigns.filter((c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : campaigns;

    // Collect weekly data
    for (const c of filteredCampaigns) {
      for (const w of c.weekly_performance ?? []) {
        const label = `${w.week_start} → ${w.week_end}`;
        if (!weekMap[label]) weekMap[label] = { revenue: 0, spend: 0 };
        weekMap[label].revenue += w.revenue ?? 0;
        weekMap[label].spend += w.spend ?? 0;
      }
    }

    // Sort weeks by date
    const allLabels = Object.keys(weekMap).sort(
      (a, b) =>
        new Date(a.split(" → ")[0]).getTime() -
        new Date(b.split(" → ")[0]).getTime()
    );

    // Apply selected week filter
    const effectiveLabels =
      selectedWeeks.length > 0
        ? allLabels.filter((l) => selectedWeeks.includes(l))
        : allLabels;

    const revenueValues = effectiveLabels.map((l) => weekMap[l].revenue);
    const spendValues = effectiveLabels.map((l) => weekMap[l].spend);

    const totalRevenue = revenueValues.reduce((s, v) => s + v, 0);
    const totalSpend = spendValues.reduce((s, v) => s + v, 0);

    // Chart data (single Y-axis version)
    const chartData = {
      labels: effectiveLabels,
      datasets: [
        {
          label: "Revenue",
          data: revenueValues,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Spend",
          data: spendValues,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    return {
      allWeekLabels: allLabels,
      chartLabels: effectiveLabels,
      totalRevenue,
      totalSpend,
      chartData,
    };
  }, [data, searchQuery, selectedWeeks]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center text-white">
        Loading weekly data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center text-red-400">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-12 text-center">
          <h1 className="text-4xl font-bold">Weekly View</h1>
          <p className="text-gray-400 mt-2">
            Weekly trends of Revenue and Spend across campaigns
          </p>
        </section>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <SearchFilter
              title="Search Campaigns"
              placeholder="Search by campaign name..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <DropdownFilter
              title="Filter by Week"
              options={allWeekLabels}
              selectedValues={selectedWeeks}
              onChange={setSelectedWeeks}
            />
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <CardMetric
              title="Total Weekly Revenue"
              value={`$${totalRevenue.toFixed(2)}`}
            />
            <CardMetric
              title="Total Weekly Spend"
              value={`$${totalSpend.toFixed(2)}`}
            />
            <CardMetric title="Weeks Displayed" value={chartLabels.length} />
          </div>

          {/* Line Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">
              Weekly Revenue and Spend
            </h2>
            <div style={{ height: "420px" }}>
              <LineChart data={chartData} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
