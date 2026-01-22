"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import {format, subDays} from "date-fns"
import {CalendarIcon, RefreshCcw} from "lucide-react"
import {type DateRange} from "react-day-picker"

import {BorrowTrendDTO, DeviceStatisticDTO, MetricDTO, SemesterCostDTO} from '@/dtos/statitic';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../ui/card';
import {Button} from '../ui/button';
import {getBorrowStatistic, getCostStatistic, getDeviceStatistic} from '@/services/statiticService';
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";

export const MainDashboard = () => {
    // Mặc định xem dữ liệu trong 30 ngày qua
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    const [borrowTrend, setBorrowTrend] = useState<BorrowTrendDTO[]>([]);
    const [deviceStats, setDeviceStats] = useState<DeviceStatisticDTO | null>(null);
    const [costs, setCosts] = useState<SemesterCostDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAllStats = async () => {
        // Chỉ fetch khi có đủ ngày bắt đầu và kết thúc
        if (!dateRange?.from || !dateRange?.to) return;

        setLoading(true);
        try {
            const fromStr = format(dateRange.from, "yyyy-MM-dd");
            const toStr = format(dateRange.to, "yyyy-MM-dd");

            const [trendData, deviceData, costData] = await Promise.all([
                getBorrowStatistic(fromStr, toStr),
                getDeviceStatistic(),
                getCostStatistic()
            ]);

            setBorrowTrend(Array.isArray(trendData) ? trendData : []);
            setDeviceStats(deviceData);
            setCosts(Array.isArray(costData) ? costData : []);
        } catch (error) {
            toast.error("Failed to sync dashboard data");
        } finally {
            setLoading(false);
        }
    };

    // Gọi lại API mỗi khi dateRange thay đổi
    useEffect(() => {
        fetchAllStats();
    }, [dateRange]);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* Component chọn khoảng ngày */}
                    <CalendarDateRangePicker date={dateRange} setDate={setDateRange}/>
                    <Button onClick={fetchAllStats} size="sm" variant="outline">
                        <RefreshCcw className="mr-2 h-4 w-4"/> Refresh
                    </Button>
                </div>
            </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-3">
                        <DeviceStatusPieChart data={deviceStats?.byStatus || []}/>
                    </div>
                    <div className="col-span-3">
                        <SemesterCostChart data={costs}/>
                    </div>
                </div>

        </div>
    );
};

export const BorrowTrendChart = ({data}: { data: BorrowTrendDTO[] }) => {
    // Sắp xếp ngày tăng dần trước khi vẽ
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Borrowing Trends</CardTitle>
                <CardDescription>Frequency over selected period</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pr-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sortedData}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                        <XAxis
                            dataKey="date"
                            fontSize={11}
                            tickFormatter={(str) => format(new Date(str), "dd/MM")}
                            minTickGap={30}
                        />
                        <YAxis fontSize={12} allowDecimals={false}/>
                        <Tooltip
                            labelFormatter={(value) => format(new Date(value), "dd MMM yyyy")}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
export const DeviceStatusPieChart = ({data}: { data: MetricDTO[] }) => {
    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#6366f1'];
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] relative">
                {/* Overlay hiển thị tổng số ở giữa */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold">{total}</span>
                    <span className="text-muted-foreground text-xs">Devices</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="label"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
export const SemesterCostChart = ({data}: { data: SemesterCostDTO[] }) => {
    // Định dạng tiền tệ VND
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Procurement Cost</CardTitle>
                <CardDescription>Spending by Semester</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{top: 20}}>
                        <XAxis dataKey="semesterName" fontSize={12} axisLine={false} tickLine={false}/>
                        <YAxis hide/>
                        <Tooltip
                            cursor={{fill: '#f8fafc'}}
                            formatter={(value: number, name, props) => [
                                formatCurrency(value),
                                `Total (${props.payload.percentage}%)`
                            ]}
                        />
                        <Bar dataKey="totalCost" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40}>
                            {/* Label hiển thị ngay trên đầu cột */}
                            <LabelList
                                dataKey="totalCost"
                                position="top"
                                formatter={(val: number) => `${(val / 1000000).toFixed(1)}M`}
                                style={{fontSize: '11px', fontWeight: 'bold'}}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};


export function CalendarDateRangePicker({
                                            date,
                                            setDate,
                                            className,
                                        }: {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
    className?: string
}) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[260px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range" // Quan trọng: Chế độ chọn khoảng
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2} // Hiển thị 2 tháng cùng lúc để dễ chọn
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
