import {BookingStatus} from "@/constaints/enum";

export interface ApproveBookingRequest {
    isApproved: boolean; // True: Duyệt, False: Từ chối
    note?: string | null; // Lý do (dấu ? cho phép thuộc tính này không bắt buộc)
}

export interface UpdateBookingRequest {
    status: BookingStatus; // True: Duyệt, False: Từ chối
    note?: string | null; // Lý do (dấu ? cho phép thuộc tính này không bắt buộc)
}
export interface CreateBookingRequest {
    roomId: string;
    /** Thường được truyền dưới dạng ISO string: "2024-05-20T08:00:00Z" */
    startTime: string | Date;
    endTime: string | Date;
    /** Tối đa 500 ký tự */
    purpose: string;
}
export interface RoomBookingResponse {
    bookingId: string;
    roomId: string;
    roomName: string;
    borrowerId: string;
    borrowerName: string;
    startTime: string; // ISO string từ server trả về
    endTime: string;
    purpose: string;
    status: BookingStatus; // Xem lưu ý về Enum ở dưới
    createdAt: string;
    approvedByName?: string | null;
    note?: string | null;
}