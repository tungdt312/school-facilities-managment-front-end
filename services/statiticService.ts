import {RoomBookingResponse} from "@/dtos/booking";
import {apiFetch, processResponse} from "@/services/baseService";
import {BorrowTrendDTO, DeviceStatisticDTO, SemesterCostDTO} from "@/dtos/statitic";

export async function getDeviceStatistic(): Promise<DeviceStatisticDTO> {
    const res = await apiFetch(`/statistics/devices`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getBorrowStatistic(from: string, to: string): Promise<BorrowTrendDTO> {
    const res = await apiFetch(`/statistics/borrows?from=${from}&to=${to}`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}

export async function getCostStatistic(): Promise<SemesterCostDTO> {
    const res = await apiFetch(`/statistics/costs`, true, {
        method: "GET",
        headers: {
            "accept": "application/json",
        },
    });
    if (!res.ok) throw new Error(res.statusText);
    return processResponse(res);
}