
export interface BorrowTrendDTO {
    date: string;
    count: number;
}

export interface DeviceStatisticDTO {
    totalDevices: number;
    byCategory: MetricDTO[];
    byStatus: MetricDTO[];
    byName: MetricDTO[];
}

export interface MetricDTO {
    label: string;
    count: number;
}

export interface SemesterCostDTO {
    semesterName: string;
    totalCost: number;
    percentage: number;
}