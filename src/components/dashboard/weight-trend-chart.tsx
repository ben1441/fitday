'use client';

import { TrendingUp } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { subDays, format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Generate mock data for the last 30 days
const generateChartData = () => {
  const data = [];
  let currentWeight = 186;
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    // Introduce some random fluctuations
    currentWeight += Math.random() * 0.8 - 0.4;
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      weight: parseFloat(currentWeight.toFixed(1)),
    });
  }
  return data;
};

const chartData = generateChartData();

const chartConfig = {
  weight: {
    label: 'Weight (lbs)',
    color: 'hsl(var(--primary))',
  },
};

const WeightTrendChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Trend</CardTitle>
        <CardDescription>Your weight progress over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60 sm:h-72 w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(new Date(value), 'MMM d')}
              interval={6} // Show a tick every 7 days
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent 
                labelFormatter={(label) => format(new Date(label), "eeee, MMM d")}
              />}
            />
            <Line
              dataKey="weight"
              type="monotone"
              stroke="var(--color-weight)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WeightTrendChart;
