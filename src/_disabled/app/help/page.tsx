'use client';

import { Card } from '@/components/ui/card';
import {
  Hash,
  LineChart,
  BarChart3,
  Table,
  PieChart as PieChartIcon,
  Database,
  Mail,
  ExternalLink,
} from 'lucide-react';
import NumberCard from '@/app/components/dashboard/widgets/number-card';
import LineChartWidget from '@/app/components/dashboard/widgets/line-chart';
import BarChartWidget from '@/app/components/dashboard/widgets/bar-chart';
import PieChartWidget from '@/app/components/dashboard/widgets/pie-chart';
import DataTableWidget from '@/app/components/dashboard/widgets/data-table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/app/components/dashboard/layout';

export default function HelpPage() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto">
        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to Debark.ai
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Debark.ai is your comprehensive analytics dashboard platform that helps you visualize
              and analyze your data with beautiful, interactive widgets. Create custom dashboards to
              track your key metrics and gain insights from your data sources.
            </p>
          </div>

          {/* Available Widget Types */}
          <section className="mb-12">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Available Widget Types
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Number Card */}
              <Card className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                    <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Number Card
                  </h4>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Display key metrics as large, prominent numbers with optional trend indicators.
                </p>
                <div className="h-48">
                  <NumberCard
                    title="Total Users"
                    value={1247}
                    change={12}
                    isPositive={true}
                    format="number"
                    widgetId="demo-number-card"
                  />
                </div>
              </Card>

              {/* Line Chart */}
              <Card className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                    <LineChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Line Chart
                  </h4>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Visualize trends and changes over time with smooth, interactive line charts.
                </p>
                <div className="h-64">
                  <LineChartWidget
                    title="Revenue Growth Over Time"
                    data={[
                      { name: 'Jan', value: 4000 },
                      { name: 'Feb', value: 3000 },
                      { name: 'Mar', value: 5000 },
                      { name: 'Apr', value: 4500 },
                      { name: 'May', value: 6000 },
                      { name: 'Jun', value: 5500 },
                    ]}
                    widgetId="demo-line-chart"
                  />
                </div>
              </Card>

              {/* Bar Chart */}
              <Card className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Bar Chart</h4>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Compare categories and values with intuitive vertical or horizontal bar charts.
                </p>
                <div className="h-64">
                  <BarChartWidget
                    title="Sales by Category"
                    data={[
                      { name: 'Electronics', value: 4000 },
                      { name: 'Clothing', value: 3000 },
                      { name: 'Books', value: 2000 },
                      { name: 'Home', value: 2780 },
                      { name: 'Sports', value: 1890 },
                    ]}
                    widgetId="demo-bar-chart"
                  />
                </div>
              </Card>

              {/* Pie Chart */}
              <Card className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-pink-100 p-2 dark:bg-pink-900">
                    <PieChartIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Pie Chart</h4>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Show proportional data using colorful pie slices.
                </p>
                <div className="h-64">
                  <PieChartWidget
                    title="Traffic Sources"
                    data={[
                      { name: 'Direct', value: 400 },
                      { name: 'Email', value: 300 },
                      { name: 'Social', value: 300 },
                      { name: 'Referral', value: 200 },
                    ]}
                    widgetId="demo-pie-chart"
                  />
                </div>
              </Card>

              {/* Data Table */}
              <Card className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                    <Table className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Data Table
                  </h4>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Display detailed tabular data with sorting, filtering, and pagination
                  capabilities.
                </p>
                <div className="h-96">
                  <DataTableWidget
                    title="Product Performance"
                    data={[
                      { name: 'Product A', value: 1234, change: '+5.2%', status: 'active' },
                      { name: 'Product B', value: 856, change: '-2.1%', status: 'pending' },
                      { name: 'Product C', value: 2341, change: '+12.3%', status: 'active' },
                      { name: 'Product D', value: 567, change: '-8.5%', status: 'inactive' },
                    ]}
                    widgetId="demo-data-table"
                  />
                </div>
              </Card>
            </div>
          </section>

          {/* Available Connections */}
          <section className="mb-12">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              Available Data Connections
            </h3>
            <Card className="p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900">
                  <Database className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">PostHog</h4>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                  Available Now
                </span>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Connect your PostHog analytics data to create powerful insights about your product
                usage, user behavior, and conversion funnels.
              </p>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Coming Soon:</strong> We're actively working on integrations with Shopify,
                  Google Ads, Stripe, and many more popular platforms. Stay tuned for updates!
                </p>
              </div>
            </Card>
          </section>

          {/* Pricing Tier */}
          <section className="mb-12">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Pricing Tiers</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border-2 border-blue-200 p-6 dark:border-blue-800">
                <div className="mb-4 text-center">
                  <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Free Beta
                  </h4>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">$0</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">per month</div>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Up to 5 dashboards
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Fixed number of credits
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    All widget types
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    PostHog integration
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Community support
                  </li>
                </ul>
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Currently Available
                </span>
              </Card>

              <Card className="relative overflow-hidden p-6">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-blue-500 px-3 py-1 text-xs font-medium text-white">
                  Coming Soon
                </div>
                <div className="mb-4 text-center">
                  <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Paid Beta
                  </h4>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">$XX</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">per month</div>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Unlimited dashboards
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Increased credit limits
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Advanced integrations
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Custom widgets
                  </li>
                </ul>
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  Pricing TBD
                </span>
              </Card>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-8">
            <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Get in Touch</h3>
            <Card className="p-6">
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Have questions, feedback, or need assistance? Our team is here to help! Reach out to
                us directly:
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">CEO</div>
                    <a
                      href="mailto:kian@debark.ai"
                      className="flex items-center space-x-1 text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <span>kian@debark.ai</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                    <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">CTO</div>
                    <a
                      href="mailto:sam@debark.ai"
                      className="flex items-center space-x-1 text-purple-600 hover:underline dark:text-purple-400"
                    >
                      <span>sam@debark.ai</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We typically respond within 24 hours during business days. For urgent technical
                  issues, please include detailed information about your setup and the specific
                  problem you're experiencing.
                </p>
              </div>
            </Card>
          </section>

          {/* Go to Dashboard Button */}
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 shadow-2xl">
              <h3 className="mb-4 text-2xl font-bold text-white">Ready to Get Started?</h3>
              <p className="mb-6 text-lg text-blue-100">
                Create your a dashboard and start visualizing your data
              </p>
              <Button
                onClick={handleGoToDashboard}
                size="lg"
                className="transform rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-100"
              >
                Go to Dashboard →
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2025 Debark.ai. Built with ❤️ for data-driven teams.
            </div>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
