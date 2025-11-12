"use client";
import { useState, useMemo } from 'react';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { Table} from '../../src/components/ui/table'; 
import { CardMetric} from '../../src/components/ui/card-metric'; 
import { BarChart } from '../../src/components/ui/bar-chart'; 
// تعريف الأنواع
interface DevicePerformance {
  device: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  conversion_rate: number;
  percentage_of_traffic: number;
}

interface Campaign {
  device_performance: DevicePerformance[];
}

// بيانات المثال
const campaignData = {
  "message": "Amana Marketing campaign data retrieved successfully",
  "company_info": {
    "name": "Amana Marketing",
    "founded": "2019",
    "headquarters": "Abu Dhabi, UAE",
    "industry": "Digital Marketing"
  },
  "marketing_stats": {
    "total_campaigns": 26,
    "active_campaigns": 21,
    "total_spend": 100360.77,
    "total_revenue": 2266087,
    "total_conversions": 7476,
    "total_impressions": 4543345,
    "total_clicks": 119245
  },
  "campaigns": [
    {
      "id": 1,
      "name": "Takchita Collection - Beautiful Designs",
      "device_performance": [
        {"device": "Mobile", "impressions": 78001, "clicks": 1559, "conversions": 162, "spend": 270.29, "revenue": 36288, "ctr": 2, "conversion_rate": 10.39, "percentage_of_traffic": 75},
        {"device": "Desktop", "impressions": 20800, "clicks": 416, "conversions": 43, "spend": 72.08, "revenue": 9676.8, "ctr": 2, "conversion_rate": 10.34, "percentage_of_traffic": 20},
        {"device": "Tablet", "impressions": 5200, "clicks": 104, "conversions": 11, "spend": 18.02, "revenue": 2419.2, "ctr": 2, "conversion_rate": 10.58, "percentage_of_traffic": 5}
      ]
    },
    {
      "id": 2,
      "name": "Kaftan Wedding Dresses - Elegant Styles",
      "device_performance": [
        {"device": "Mobile", "impressions": 160422, "clicks": 3198, "conversions": 25, "spend": 4858.86, "revenue": 4826.25, "ctr": 1.99, "conversion_rate": 0.78, "percentage_of_traffic": 75},
        {"device": "Desktop", "impressions": 42779, "clicks": 853, "conversions": 7, "spend": 1295.7, "revenue": 1287, "ctr": 1.99, "conversion_rate": 0.82, "percentage_of_traffic": 20},
        {"device": "Tablet", "impressions": 10695, "clicks": 213, "conversions": 2, "spend": 323.92, "revenue": 321.75, "ctr": 1.99, "conversion_rate": 0.94, "percentage_of_traffic": 5}
      ]
    },
    {
      "id": 3,
      "name": "Cotton Embroidered Abayas - Traditional Style",
      "device_performance": [
        {"device": "Mobile", "impressions": 67398, "clicks": 1915, "conversions": 65, "spend": 1331.97, "revenue": 26883, "ctr": 2.84, "conversion_rate": 3.39, "percentage_of_traffic": 75},
        {"device": "Desktop", "impressions": 17973, "clicks": 511, "conversions": 17, "spend": 355.19, "revenue": 7168.8, "ctr": 2.84, "conversion_rate": 3.33, "percentage_of_traffic": 20},
        {"device": "Tablet", "impressions": 4493, "clicks": 128, "conversions": 4, "spend": 88.8, "revenue": 1792.2, "ctr": 2.85, "conversion_rate": 3.13, "percentage_of_traffic": 5}
      ]
    },
    {
      "id": 4,
      "name": "Syrian Wedding Dresses - Quality & Style",
      "device_performance": [
        {"device": "Mobile", "impressions": 71893, "clicks": 2330, "conversions": 236, "spend": 375.79, "revenue": 99145.5, "ctr": 3.24, "conversion_rate": 10.13, "percentage_of_traffic": 75},
        {"device": "Desktop", "impressions": 19172, "clicks": 621, "conversions": 63, "spend": 100.21, "revenue": 26438.8, "ctr": 3.24, "conversion_rate": 10.14, "percentage_of_traffic": 20},
        {"device": "Tablet", "impressions": 4793, "clicks": 155, "conversions": 16, "spend": 25.05, "revenue": 6609.7, "ctr": 3.23, "conversion_rate": 10.32, "percentage_of_traffic": 5}
      ]
    },
    {
      "id": 5,
      "name": "Kaftan Bridesmaid Collection",
      "device_performance": [
        {"device": "Mobile", "impressions": 175028, "clicks": 3914, "conversions": 101, "spend": 3502.31, "revenue": 28341, "ctr": 2.24, "conversion_rate": 2.58, "percentage_of_traffic": 75},
        {"device": "Desktop", "impressions": 46674, "clicks": 1044, "conversions": 27, "spend": 933.95, "revenue": 7557.6, "ctr": 2.24, "conversion_rate": 2.59, "percentage_of_traffic": 20},
        {"device": "Tablet", "impressions": 11669, "clicks": 261, "conversions": 7, "spend": 233.49, "revenue": 1889.4, "ctr": 2.24, "conversion_rate": 2.68, "percentage_of_traffic": 5}
      ]
    }
  ]
};

// دالة لمعالجة بيانات الأجهزة
const processDeviceData = (campaigns: Campaign[]) => {
  const deviceMap: { [key: string]: any } = {};

  campaigns.forEach((campaign: Campaign) => {
    campaign.device_performance.forEach((device: DevicePerformance) => {
      if (!deviceMap[device.device]) {
        deviceMap[device.device] = {
          device: device.device,
          totalImpressions: 0,
          totalClicks: 0,
          totalConversions: 0,
          totalSpend: 0,
          totalRevenue: 0,
          totalCTR: 0,
          totalConversionRate: 0,
          totalTrafficPercentage: 0,
          campaignCount: 0
        };
      }

      deviceMap[device.device].totalImpressions += device.impressions;
      deviceMap[device.device].totalClicks += device.clicks;
      deviceMap[device.device].totalConversions += device.conversions;
      deviceMap[device.device].totalSpend += device.spend;
      deviceMap[device.device].totalRevenue += device.revenue;
      deviceMap[device.device].totalCTR += device.ctr;
      deviceMap[device.device].totalConversionRate += device.conversion_rate;
      deviceMap[device.device].totalTrafficPercentage += device.percentage_of_traffic;
      deviceMap[device.device].campaignCount += 1;
    });
  });

  // حساب المتوسطات
  Object.values(deviceMap).forEach((device: any) => {
    device.avgCTR = device.totalCTR / device.campaignCount;
    device.avgConversionRate = device.totalConversionRate / device.campaignCount;
    device.avgTrafficPercentage = device.totalTrafficPercentage / device.campaignCount;
    device.roas = device.totalSpend > 0 ? (device.totalRevenue / device.totalSpend) : 0;
  });

  return Object.values(deviceMap);
};

export default function DeviceView() {
  const deviceData = processDeviceData(campaignData.campaigns);
  const [selectedDevice, setSelectedDevice] = useState('Mobile');

  // بيانات البطاقات الإحصائية
  const totalRevenue = deviceData.reduce((sum, device) => sum + device.totalRevenue, 0);
  const totalSpend = deviceData.reduce((sum, device) => sum + device.totalSpend, 0);
  const totalConversions = deviceData.reduce((sum, device) => sum + device.totalConversions, 0);

  // بيانات الرسم البياني الشريطي
  const revenueChartData = deviceData.map(device => ({
    label: device.device,
    value: device.totalRevenue,
    color: device.device === 'Mobile' ? '#3B82F6' : 
           device.device === 'Desktop' ? '#10B981' : 
           '#F59E0B'
  }));

  const trafficChartData = deviceData.map(device => ({
    label: device.device,
    value: device.avgTrafficPercentage,
    color: device.device === 'Mobile' ? '#3B82F6' : 
           device.device === 'Desktop' ? '#10B981' : 
           '#F59E0B'
  }));

  // أعمدة الجدول
  const tableColumns = [
    {
      key: 'device',
      header: 'النوع',
      width: '20%',
      sortable: true,
      sortType: 'string' as const,
      render: (value: string) => (
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            value === 'Mobile' ? 'bg-blue-500' :
            value === 'Desktop' ? 'bg-green-500' : 'bg-yellow-500'
          }`} />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'totalRevenue',
      header: 'الإيرادات',
      width: '15%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => (
        <span className="text-green-400 font-medium">
          {value.toLocaleString()} ريال
        </span>
      )
    },
    {
      key: 'totalSpend',
      header: 'الإنفاق',
      width: '15%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => (
        <span className="text-red-400 font-medium">
          {value.toLocaleString()} ريال
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
      key: 'avgCTR',
      header: 'معدل النقر',
      width: '12%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => `${value.toFixed(2)}%`
    },
    {
      key: 'avgConversionRate',
      header: 'معدل التحويل',
      width: '13%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => `${value.toFixed(2)}%`
    },
    {
      key: 'avgTrafficPercentage',
      header: 'نسبة الزيارات',
      width: '13%',
      align: 'right' as const,
      sortable: true,
      sortType: 'number' as const,
      render: (value: number) => `${value.toFixed(1)}%`
    }
  ];

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
                Device View
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                تحليل أداء الحملات الإعلانية حسب نوع الجهاز
              </p>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* البطاقات الإحصائية */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <CardMetric
              title="إجمالي الإيرادات"
              value={totalRevenue.toLocaleString()}
              className="border-l-4 border-l-green-500"
            />
            <CardMetric
              title="إجمالي الإنفاق"
              value={totalSpend.toLocaleString()}
              className="border-l-4 border-l-red-500"
            />
            <CardMetric
              title="إجمالي التحويلات"
              value={totalConversions.toLocaleString()}
              className="border-l-4 border-l-blue-500"
            />
            <CardMetric
              title="عدد الحملات"
              value={campaignData.marketing_stats.total_campaigns}
              className="border-l-4 border-l-yellow-500"
            />
          </div>

          {/* الرسوم البيانية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <BarChart
              title="الإيرادات حسب نوع الجهاز"
              data={revenueChartData}
              height={300}
              formatValue={(value: number) => `${(value / 1000).toFixed(0)}K`}
            />
            <BarChart
              title="توزيع الزيارات حسب الجهاز"
              data={trafficChartData}
              height={300}
              formatValue={(value: number) => `${value.toFixed(1)}%`}
            />
          </div>

          {/* مقارنة الأداء */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">مقارنة معدل النقر</h3>
              <div className="space-y-4">
                {deviceData
                  .sort((a, b) => b.avgCTR - a.avgCTR)
                  .map((device) => (
                    <div key={device.device} className="flex justify-between items-center">
                      <span className="text-gray-300">{device.device}</span>
                      <span className="text-blue-400 font-medium">
                        {device.avgCTR.toFixed(2)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">مقارنة معدل التحويل</h3>
              <div className="space-y-4">
                {deviceData
                  .sort((a, b) => b.avgConversionRate - a.avgConversionRate)
                  .map((device) => (
                    <div key={device.device} className="flex justify-between items-center">
                      <span className="text-gray-300">{device.device}</span>
                      <span className="text-green-400 font-medium">
                        {device.avgConversionRate.toFixed(2)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">مقارنة العائد على الإنفاق</h3>
              <div className="space-y-4">
                {deviceData
                  .sort((a, b) => b.roas - a.roas)
                  .map((device) => (
                    <div key={device.device} className="flex justify-between items-center">
                      <span className="text-gray-300">{device.device}</span>
                      <span className={`font-medium ${
                        device.roas > 10 ? 'text-green-400' :
                        device.roas > 5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {device.roas.toFixed(1)}x
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* جدول البيانات التفصيلي */}
          <Table
            title="تحليل مفصل لكل نوع جهاز"
            columns={tableColumns}
            data={deviceData}
            showIndex={true}
            maxHeight="500px"
            defaultSort={{ key: 'totalRevenue', direction: 'desc' }}
            className="mt-6"
          />

          {/* رؤى وتحليلات */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">💡 الرؤى الرئيسية</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>الهواتف المحمولة تولد <strong>75%</strong> من إجمالي الزيارات</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>أجهزة الكمبيوتر لها أعلى معدل تحويل في المتوسط</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>الأجهزة اللوحية لديها أعلى عائد على الإنفاق (ROAS)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>الهواتف المحمولة تساهم بأكبر حصة في الإيرادات الإجمالية</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">🎯 التوصيات</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>زيادة الميزانية المخصصة للحملات الموجهة للهواتف المحمولة</span>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">✓</span>
                  <span>تحسين تجربة المستخدم على أجهزة الكمبيوتر لزيادة التحويلات</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span>تطوير إعلانات مخصصة للأجهزة اللوحية لتعزيز الأداء</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-2">✓</span>
                  <span>تحسين سرعة التحميل على جميع الأجهزة لتحسين التجربة</span>
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