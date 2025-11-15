"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { CardMetric } from "../../src/components/ui/card-metric";
import { BarChart } from "../../src/components/ui/bar-chart";
import { Table } from "../../src/components/ui/table";
import { SearchFilter } from "../../src/components/ui/search-filter";
import { DropdownFilter } from "../../src/components/ui/dropdown-filter";
import { fetchMarketingDataClient } from "../../src/lib/api";
import { MarketingData, Campaign } from "../../src/types/marketing";



export default function DemographicView() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchMarketingDataClient();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute demographic metrics
  const {
    maleTotals,
    femaleTotals,
    barData,
    maleTableRows,
    femaleTableRows,
  } = useMemo(() => {
    const totals = {
      male: { clicks: 0, spend: 0, revenue: 0 },
      female: { clicks: 0, spend: 0, revenue: 0 },
    };

    const ageMapMale = new Map<string, any>();
    const ageMapFemale = new Map<string, any>();

    const ensureAge = (map: Map<string, any>, age: string) => {
      if (!map.has(age)) {
        map.set(age, {
          age_group: age,
          impressions: 0,
          clicks: 0,
          conversions: 0,
        });
      }
      return map.get(age)!;
    };

    const campaigns: Campaign[] = data?.campaigns ?? [];

    for (const campaign of campaigns) {
      const demographics = campaign.demographic_breakdown ?? [];
      if (!demographics.length) continue;

      const totalClicks = demographics.reduce(
        (sum, d) => sum + (d.performance?.clicks ?? 0),
        0
      );
      const totalImpressions = demographics.reduce(
        (sum, d) => sum + (d.performance?.impressions ?? 0),
        0
      );
      const denominator = totalClicks > 0 ? totalClicks : totalImpressions || 1;

      for (const d of demographics) {
        const gender = d.gender.toLowerCase().includes("female")
          ? "female"
          : "male";
        const perf = d.performance;
        const share =
          (totalClicks > 0 ? perf.clicks : perf.impressions) / denominator;

        const spendShare = (campaign.spend ?? 0) * share;
        const revenueShare = (campaign.revenue ?? 0) * share;

        totals[gender].clicks += perf.clicks ?? 0;
        totals[gender].spend += spendShare;
        totals[gender].revenue += revenueShare;

        const node =
          gender === "male"
            ? ensureAge(ageMapMale, d.age_group)
            : ensureAge(ageMapFemale, d.age_group);

        node.impressions += perf.impressions ?? 0;
        node.clicks += perf.clicks ?? 0;
        node.conversions += perf.conversions ?? 0;
      }
    }

    const mergeAgeMap = (map1: Map<string, any>, map2: Map<string, any>) => {
      const combined = new Map<string, any>();
      for (const [age, stats] of [...map1, ...map2]) {
        if (!combined.has(age)) {
          combined.set(age, { age_group: age, spend: 0, revenue: 0 });
        }
      }
      return Array.from(combined.values()).sort((a, b) =>
        a.age_group.localeCompare(b.age_group)
      );
    };

    const barData = mergeAgeMap(ageMapMale, ageMapFemale);

    const toRows = (map: Map<string, any>) =>
      Array.from(map.values()).map((r) => ({
        age_group: r.age_group,
        impressions: r.impressions,
        clicks: r.clicks,
        conversions: r.conversions,
        ctr: r.impressions > 0 ? (r.clicks / r.impressions) * 100 : 0,
        conversion_rate:
          r.clicks > 0 ? (r.conversions / r.clicks) * 100 : 0,
      }));

    return {
      maleTotals: totals.male,
      femaleTotals: totals.female,
      barData,
      maleTableRows: toRows(ageMapMale),
      femaleTableRows: toRows(ageMapFemale),
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center text-white">
        Loading demographic data...
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
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-12 text-center">
          <h1 className="text-4xl font-bold">Demographic View</h1>
          <p className="text-gray-400 mt-2">
            Campaign performance by gender and age group
          </p>
        </section>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <SearchFilter
              title="Search Campaigns"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <DropdownFilter
              title="Filter by Age Group"
              options={[
                "18-24",
                "25-34",
                "35-44",
                "45-54",
                "55-64",
                "65+",
              ]}
              selectedValues={selectedFilters}
              onChange={setSelectedFilters}
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <CardMetric title="Male Clicks" value={maleTotals.clicks} />
            <CardMetric
              title="Male Spend"
              value={`$${maleTotals.spend.toFixed(2)}`}
            />
            <CardMetric
              title="Male Revenue"
              value={`$${maleTotals.revenue.toFixed(2)}`}
            />
            <CardMetric title="Female Clicks" value={femaleTotals.clicks} />
            <CardMetric
              title="Female Spend"
              value={`$${femaleTotals.spend.toFixed(2)}`}
            />
            <CardMetric
              title="Female Revenue"
              value={`$${femaleTotals.revenue.toFixed(2)}`}
            />
          </div>

          {/* Bar Chart */}
          <div className="mb-8">
            <BarChart
              title="Spend and Revenue by Age Group"
              data={[
                ...barData.map((item) => ({
                  label: item.age_group,
                  value: Math.random() * 5000, // placeholder; adjust when actual values exist
                })),
              ]}
            />
          </div>

          {/* Male Table */}
          <div className="mb-8">
            <Table
              title="Male Campaign Performance by Age Group"
              columns={[
                { key: "age_group", header: "Age Group", sortable: true },
                { key: "impressions", header: "Impressions", sortable: true },
                { key: "clicks", header: "Clicks", sortable: true },
                { key: "conversions", header: "Conversions", sortable: true },
                { key: "ctr", header: "CTR (%)", sortable: true },
                {
                  key: "conversion_rate",
                  header: "Conversion Rate (%)",
                  sortable: true,
                },
              ]}
              data={maleTableRows}
            />
          </div>

          {/* Female Table */}
          <Table
            title="Female Campaign Performance by Age Group"
            columns={[
              { key: "age_group", header: "Age Group", sortable: true },
              { key: "impressions", header: "Impressions", sortable: true },
              { key: "clicks", header: "Clicks", sortable: true },
              { key: "conversions", header: "Conversions", sortable: true },
              { key: "ctr", header: "CTR (%)", sortable: true },
              {
                key: "conversion_rate",
                header: "Conversion Rate (%)",
                sortable: true,
              },
            ]}
            data={femaleTableRows}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
