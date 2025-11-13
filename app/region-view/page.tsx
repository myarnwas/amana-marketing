"use client";
import { useState, useMemo } from 'react';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { Table} from '../../src/components/ui/table'; 
import { CardMetric} from '../../src/components/ui/card-metric'; 
import { BarChart } from '../../src/components/ui/bar-chart'; 
import { LineChart } from '../../src/components/ui/charts/LineChart';
import { BubbleMap } from '../../src/components/ui/charts/BubbleMap';

// دالة لمعالجة البيانات الأسبوعية
interface ProcessedWeek {
  week: string;
  revenue: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

const processWeeklyData = (campaigns: Campaign[]): ProcessedWeek[] => {
  const weekMap: { [key: string]: ProcessedWeek } = {};
  
  campaigns.forEach((campaign: Campaign) => {
    campaign.weekly_performance.forEach((week: any) => {
      if (!weekMap[week.week]) {
        weekMap[week.week] = {
          week: week.week,
          revenue: 0,
          spend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0
        };
      }
      
      weekMap[week.week].revenue += week.revenue || 0;
      weekMap[week.week].spend += week.spend || 0;
      weekMap[week.week].impressions += week.impressions || 0;
      weekMap[week.week].clicks += week.clicks || 0;
      weekMap[week.week].conversions += week.conversions || 0;
    });
  });
  
  return Object.values(weekMap).sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());
};

// تعريف الأنواع
interface RegionalPerformance {
  region: string;
  country: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  conversion_rate: number;
  cpc: number;
  cpa: number;
  roas: number;
}

interface Campaign {
  regional_performance: RegionalPerformance[];
  weekly_performance: any[];
}

interface ProcessedRegion {
  region: string;
  country: string;
  totalRevenue: number;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  roas: number;
}

// بيانات المثال الفعلية
const campaignData = {
  "message": "Amana Marketing campaign data retrieved successfully",
  "company_info": {
    "name": "Amana Marketing",
    "founded": "2019",
    "headquarters": "Abu Dhabi, UAE",
    "industry": "Digital Marketing",
    "description": "Digital marketing agency specializing in traditional Middle Eastern wedding fashion across the GCC region. We help students and families find beautiful traditional clothing at accessible prices, connecting cultural fashion brands with modern audiences through smart, targeted marketing campaigns that honor heritage while reaching today's shoppers."
  },
  "marketing_stats": {
    "total_campaigns": 26,
    "active_campaigns": 21,
    "total_spend": 100360.77,
    "total_revenue": 2266087,
    "total_conversions": 7476,
    "average_roas": 22.58,
    "top_performing_medium": "Instagram",
    "top_performing_region": "Abu Dhabi",
    "total_impressions": 4543345,
    "total_clicks": 119245,
    "average_ctr": 2.62,
    "average_conversion_rate": 6.27
  },
  "campaigns": [
    {
      "id": 1,
      "name": "Takchita Collection - Beautiful Designs",
      "regional_performance": [
        {"region": "Abu Dhabi", "country": "UAE", "impressions": 36400, "clicks": 727, "conversions": 76, "spend": 126.14, "revenue": 16934.4, "ctr": 2, "conversion_rate": 10.45, "cpc": 0.17, "cpa": 1.66, "roas": 134.25},
        {"region": "Dubai", "country": "UAE", "impressions": 31200, "clicks": 623, "conversions": 65, "spend": 108.12, "revenue": 14515.2, "ctr": 2, "conversion_rate": 10.43, "cpc": 0.17, "cpa": 1.66, "roas": 134.25},
        {"region": "Sharjah", "country": "UAE", "impressions": 15600, "clicks": 312, "conversions": 32, "spend": 54.06, "revenue": 7257.6, "ctr": 2, "conversion_rate": 10.26, "cpc": 0.17, "cpa": 1.69, "roas": 134.25},
        {"region": "Riyadh", "country": "Saudi Arabia", "impressions": 8320, "clicks": 166, "conversions": 17, "spend": 28.83, "revenue": 3870.72, "ctr": 2, "conversion_rate": 10.24, "cpc": 0.17, "cpa": 1.7, "roas": 134.26},
        {"region": "Doha", "country": "Qatar", "impressions": 6240, "clicks": 125, "conversions": 13, "spend": 21.62, "revenue": 2903.04, "ctr": 2, "conversion_rate": 10.4, "cpc": 0.17, "cpa": 1.66, "roas": 134.28},
        {"region": "Kuwait City", "country": "Kuwait", "impressions": 4160, "clicks": 83, "conversions": 9, "spend": 14.42, "revenue": 1935.36, "ctr": 2, "conversion_rate": 10.84, "cpc": 0.17, "cpa": 1.6, "roas": 134.21},
        {"region": "Manama", "country": "Bahrain", "impressions": 2080, "clicks": 42, "conversions": 4, "spend": 7.21, "revenue": 967.68, "ctr": 2.02, "conversion_rate": 9.52, "cpc": 0.17, "cpa": 1.8, "roas": 134.21}
      ],
      "weekly_performance": [
        {"week": "2024-01-01", "revenue": 4233.6, "spend": 31.54, "impressions": 9100, "clicks": 182, "conversions": 19},
        {"week": "2024-01-08", "revenue": 4233.6, "spend": 31.54, "impressions": 9100, "clicks": 182, "conversions": 19},
        {"week": "2024-01-15", "revenue": 4233.6, "spend": 31.54, "impressions": 9100, "clicks": 182, "conversions": 19},
        {"week": "2024-01-22", "revenue": 4233.6, "spend": 31.54, "impressions": 9100, "clicks": 182, "conversions": 19}
      ]
    },
    {
      "id": 2,
      "name": "Kaftan Wedding Dresses - Elegant Styles",
      "regional_performance": [
        {"region": "Abu Dhabi", "country": "UAE", "impressions": 74864, "clicks": 1492, "conversions": 12, "spend": 2267.47, "revenue": 2252.25, "ctr": 1.99, "conversion_rate": 0.8, "cpc": 1.52, "cpa": 188.96, "roas": 0.99},
        {"region": "Dubai", "country": "UAE", "impressions": 64169, "clicks": 1279, "conversions": 10, "spend": 1943.54, "revenue": 1930.5, "ctr": 1.99, "conversion_rate": 0.78, "cpc": 1.52, "cpa": 194.35, "roas": 0.99},
        {"region": "Sharjah", "country": "UAE", "impressions": 32084, "clicks": 640, "conversions": 5, "spend": 971.77, "revenue": 965.25, "ctr": 1.99, "conversion_rate": 0.78, "cpc": 1.52, "cpa": 194.35, "roas": 0.99},
        {"region": "Riyadh", "country": "Saudi Arabia", "impressions": 17112, "clicks": 341, "conversions": 3, "spend": 518.28, "revenue": 514.8, "ctr": 1.99, "conversion_rate": 0.88, "cpc": 1.52, "cpa": 172.76, "roas": 0.99},
        {"region": "Doha", "country": "Qatar", "impressions": 12834, "clicks": 256, "conversions": 2, "spend": 388.71, "revenue": 386.1, "ctr": 1.99, "conversion_rate": 0.78, "cpc": 1.52, "cpa": 194.36, "roas": 0.99},
        {"region": "Kuwait City", "country": "Kuwait", "impressions": 8556, "clicks": 171, "conversions": 1, "spend": 259.14, "revenue": 257.4, "ctr": 2, "conversion_rate": 0.58, "cpc": 1.52, "cpa": 259.14, "roas": 0.99},
        {"region": "Manama", "country": "Bahrain", "impressions": 4278, "clicks": 85, "conversions": 1, "spend": 129.57, "revenue": 128.7, "ctr": 1.99, "conversion_rate": 1.18, "cpc": 1.52, "cpa": 129.57, "roas": 0.99}
      ],
      "weekly_performance": [
        {"week": "2024-01-01", "revenue": 563.06, "spend": 566.87, "impressions": 18716, "clicks": 373, "conversions": 3},
        {"week": "2024-01-08", "revenue": 563.06, "spend": 566.87, "impressions": 18716, "clicks": 373, "conversions": 3},
        {"week": "2024-01-15", "revenue": 563.06, "spend": 566.87, "impressions": 18716, "clicks": 373, "conversions": 3},
        {"week": "2024-01-22", "revenue": 563.06, "spend": 566.87, "impressions": 18716, "clicks": 373, "conversions": 3}
      ]
    },
    {
      "id": 3,
      "name": "Cotton Embroidered Abayas - Traditional Style",
      "regional_performance": [
        {"region": "Abu Dhabi", "country": "UAE", "impressions": 31452, "clicks": 894, "conversions": 30, "spend": 621.59, "revenue": 12545.4, "ctr": 2.84, "conversion_rate": 3.36, "cpc": 0.7, "cpa": 20.72, "roas": 20.18},
        {"region": "Dubai", "country": "UAE", "impressions": 26959, "clicks": 766, "conversions": 26, "spend": 532.79, "revenue": 10753.2, "ctr": 2.84, "conversion_rate": 3.39, "cpc": 0.7, "cpa": 20.49, "roas": 20.18},
        {"region": "Sharjah", "country": "UAE", "impressions": 13480, "clicks": 383, "conversions": 13, "spend": 266.39, "revenue": 5376.6, "ctr": 2.84, "conversion_rate": 3.39, "cpc": 0.7, "cpa": 20.49, "roas": 20.18},
        {"region": "Riyadh", "country": "Saudi Arabia", "impressions": 7189, "clicks": 204, "conversions": 7, "spend": 142.08, "revenue": 2867.52, "ctr": 2.84, "conversion_rate": 3.43, "cpc": 0.7, "cpa": 20.3, "roas": 20.18},
        {"region": "Doha", "country": "Qatar", "impressions": 5392, "clicks": 153, "conversions": 5, "spend": 106.56, "revenue": 2150.64, "ctr": 2.84, "conversion_rate": 3.27, "cpc": 0.7, "cpa": 21.31, "roas": 20.18},
        {"region": "Kuwait City", "country": "Kuwait", "impressions": 3595, "clicks": 102, "conversions": 3, "spend": 71.04, "revenue": 1433.76, "ctr": 2.84, "conversion_rate": 2.94, "cpc": 0.7, "cpa": 23.68, "roas": 20.18},
        {"region": "Manama", "country": "Bahrain", "impressions": 1797, "clicks": 51, "conversions": 2, "spend": 35.52, "revenue": 716.88, "ctr": 2.84, "conversion_rate": 3.92, "cpc": 0.7, "cpa": 17.76, "roas": 20.18}
      ],
      "weekly_performance": [
        {"week": "2024-01-01", "revenue": 3136.35, "spend": 155.4, "impressions": 7863, "clicks": 224, "conversions": 8},
        {"week": "2024-01-08", "revenue": 3136.35, "spend": 155.4, "impressions": 7863, "clicks": 224, "conversions": 8},
        {"week": "2024-01-15", "revenue": 3136.35, "spend": 155.4, "impressions": 7863, "clicks": 224, "conversions": 8},
        {"week": "2024-01-22", "revenue": 3136.35, "spend": 155.4, "impressions": 7863, "clicks": 224, "conversions": 8}
      ]
    }
  ]
};

// دالة لمعالجة بيانات المناطق مع تعريفات الأنواع
const processRegionalData = (campaigns: Campaign[]): ProcessedRegion[] => {
  const regionMap: { [key: string]: ProcessedRegion } = {};
  
  campaigns.forEach((campaign: Campaign) => {
    campaign.regional_performance.forEach((region: RegionalPerformance) => {
      if (!regionMap[region.region]) {
        regionMap[region.region] = {
          region: region.region,
          country: region.country,
          totalRevenue: 0,
          totalSpend: 0,
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0,
          roas: 0
        };
      }
      
      regionMap[region.region].totalRevenue += region.revenue;
      regionMap[region.region].totalSpend += region.spend;
      regionMap[region.region].totalImpressions += region.impressions;
      regionMap[region.region].totalClicks += region.clicks;
      regionMap[region.region].totalConversions += region.conversions;
    });
  });

  // حساب ROAS لكل منطقة
  Object.values(regionMap).forEach((region: ProcessedRegion) => {
    region.roas = region.totalSpend > 0 ? (region.totalRevenue / region.totalSpend) : 0;
  });
  
  return Object.values(regionMap);
};

export default function RegionView() {
  const regionalData = processRegionalData(campaignData.campaigns);
  const weeklyData = processWeeklyData(campaignData.campaigns);

  // بيانات الرسم البياني الخطي للإيرادات والإنفاق الأسبوعي
  const lineChartData = {
    labels: weeklyData.map(week => {
      const date = new Date(week.week);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Weekly Revenue',
        data: weeklyData.map(week => week.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Weekly Spend',
        data: weeklyData.map(week => week.spend),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // بيانات خريطة الفقاعات للمناطق
  const bubbleMapData = regionalData.map(region => ({
    id: region.region,
    name: region.region,
    country: region.country,
    value: region.totalRevenue,
    spend: region.totalSpend,
    revenue: region.totalRevenue,
    impressions: region.totalImpressions,
    clicks: region.totalClicks,
    conversions: region.totalConversions,
    roas: region.totalSpend > 0 ? (region.totalRevenue / region.totalSpend) : 0
  }));

  // إعداد بيانات الرسم البياني الشريطي للمناطق
  const barChartData = regionalData
    .sort((a: ProcessedRegion, b: ProcessedRegion) => b.totalRevenue - a.totalRevenue)
    .slice(0, 7)
    .map((region: ProcessedRegion) => ({
      label: region.region,
      value: region.totalRevenue,
      color: region.region === 'Abu Dhabi' ? '#10B981' : 
             region.region === 'Dubai' ? '#3B82F6' : 
             region.region === 'Sharjah' ? '#F59E0B' : 
             region.region === 'Riyadh' ? '#EF4444' : 
             region.region === 'Doha' ? '#8B5CF6' : 
             '#6B7280'
    }));

  // إعداد أعمدة الجدول
  const tableColumns = [
    {
      key: 'region',
      header: 'Region',
      width: '20%',
      sortable: true,
      sortType: 'string' as const
    },
    {
      key: 'country',
      header: 'Country',
      width: '15%',
      sortable: true,
      sortType: 'string' as const
    },
    {
      key: 'totalRevenue',
      header: 'Revenue',
      width: '15%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => (
        <span className="text-green-400 font-medium">
          {value.toLocaleString()} SAR
        </span>
      )
    },
    {
      key: 'totalSpend',
      header: 'Spend',
      width: '15%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => (
        <span className="text-red-400 font-medium">
          {value.toLocaleString()} SAR
        </span>
      )
    },
    {
      key: 'roas',
      header: 'ROAS',
      width: '12%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => (
        <span className={`font-bold ${
          value > 10 ? 'text-green-400' : 
          value > 5 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {value.toFixed(1)}x
        </span>
      )
    },
    {
      key: 'totalConversions',
      header: 'Conversions',
      width: '12%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'totalClicks',
      header: 'Clicks',
      width: '11%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => value.toLocaleString()
    }
  ];

  // بيانات البطاقات الإحصائية
  const topRegion = regionalData.sort((a: ProcessedRegion, b: ProcessedRegion) => b.totalRevenue - a.totalRevenue)[0];
  const totalROAS = campaignData.marketing_stats.total_spend > 0 
    ? (campaignData.marketing_stats.total_revenue / campaignData.marketing_stats.total_spend) 
    : 0;

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Region View
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Marketing campaign performance analysis by geographic regions
              </p>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <CardMetric
              title="Total Revenue"
              value={campaignData.marketing_stats.total_revenue.toLocaleString()}
              className="border-l-4 border-l-green-500"
            />
            <CardMetric
              title="Total Spend"
              value={campaignData.marketing_stats.total_spend.toLocaleString()}
              className="border-l-4 border-l-red-500"
            />
            <CardMetric
              title="Average ROAS"
              value={`${totalROAS.toFixed(1)}x`}
              className="border-l-4 border-l-blue-500"
            />
            <CardMetric
              title="Top Performing Region"
              value={topRegion?.region || 'N/A'}
              className="border-l-4 border-l-yellow-500"
            />
          </div>

          {/* Line Chart and Regional Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Line Chart */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Weekly Trends - Revenue vs Spend</h2>
              <div className="h-80">
                <LineChart data={lineChartData} />
              </div>
            </div>

            {/* Regional Performance */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Top Performing Regions</h2>
              <div className="space-y-4">
                {regionalData
                  .sort((a: ProcessedRegion, b: ProcessedRegion) => b.totalRevenue - a.totalRevenue)
                  .slice(0, 5)
                  .map((region: ProcessedRegion, index: number) => (
                    <div key={region.region} className="flex items-center justify-between p-3 bg-gray-750 rounded-lg">
                      <div className="flex items-center">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                          index === 0 ? 'bg-yellow-500 text-gray-900' :
                          index === 1 ? 'bg-gray-400 text-gray-900' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-white font-medium">{region.region}</p>
                          <p className="text-gray-400 text-sm">{region.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-lg">
                          {(region.totalRevenue / 1000).toFixed(0)}K
                        </p>
                        <p className="text-gray-400 text-sm">
                          ROAS: {region.roas.toFixed(1)}x
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Bubble Map */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Campaign Distribution by Region</h2>
            <p className="text-gray-400 mb-4">
              Bubble size represents revenue amount in each region
            </p>
            <div className="h-96">
              <BubbleMap data={bubbleMapData} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Revenue by Region</h2>
            <BarChart
              title=""
              data={barChartData}
              height={300}
              formatValue={(value: number) => `${(value / 1000).toFixed(0)}K`}
            />
          </div>

          {/* Detailed Data Table */}
          <Table
            title="Detailed Regional Analysis"
            columns={tableColumns}
            data={regionalData}
            showIndex={true}
            maxHeight="500px"
            defaultSort={{ key: 'totalRevenue', direction: 'desc' }}
            className="mt-6"
          />

          {/* Additional Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Impressions Distribution</h3>
              <div className="space-y-3">
                {regionalData
                  .sort((a: ProcessedRegion, b: ProcessedRegion) => b.totalImpressions - a.totalImpressions)
                  .slice(0, 4)
                  .map((region: ProcessedRegion) => (
                    <div key={region.region} className="flex justify-between items-center">
                      <span className="text-gray-300">{region.region}</span>
                      <span className="text-gray-400">
                        {(region.totalImpressions / 1000).toFixed(0)}K
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Conversion Rates</h3>
              <div className="space-y-3">
                {regionalData
                  .filter((region: ProcessedRegion) => region.totalClicks > 0)
                  .map((region: ProcessedRegion) => ({
                    ...region,
                    conversionRate: (region.totalConversions / region.totalClicks) * 100
                  }))
                  .sort((a: any, b: any) => b.conversionRate - a.conversionRate)
                  .slice(0, 4)
                  .map((region: any) => (
                    <div key={region.region} className="flex justify-between items-center">
                      <span className="text-gray-300">{region.region}</span>
                      <span className="text-green-400 font-medium">
                        {region.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Spending Efficiency</h3>
              <div className="space-y-3">
                {regionalData
                  .sort((a: ProcessedRegion, b: ProcessedRegion) => b.roas - a.roas)
                  .slice(0, 4)
                  .map((region: ProcessedRegion) => (
                    <div key={region.region} className="flex justify-between items-center">
                      <span className="text-gray-300">{region.region}</span>
                      <span className={`font-medium ${
                        region.roas > 15 ? 'text-green-400' :
                        region.roas > 8 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {region.roas.toFixed(1)}x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}