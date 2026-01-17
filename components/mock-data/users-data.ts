 // Giả sử types nằm trong file này

 import { UserRole } from "@/constaints/enum";
import { UserResponse } from "@/dtos/user";

export const MOCK_USERS: UserResponse[] = [
    {
        userId: "u1",
        fullName: "Nguyễn Văn Hoà",
        email: "hoa.nv@university.edu.vn",
        role: UserRole.DepartmentHead,
        createdAt: "2024-01-15T08:30:00Z"
    },
    {
        userId: "u2",
        fullName: "Trần Thị Lan",
        email: "lan.tt@university.edu.vn",
        role: UserRole.FacilityManager,
        createdAt: "2024-01-20T09:15:00Z"
    },
    {
        userId: "u3",
        fullName: "Khoa Công nghệ Thông tin",
        email: "it.dept@university.edu.vn",
        role: UserRole.Department,
        createdAt: "2023-12-01T10:00:00Z"
    },
    {
        userId: "u4",
        fullName: "Lê Văn Tám",
        email: "tam.lv@university.edu.vn",
        role: UserRole.Lecturer,
        createdAt: "2024-02-10T14:20:00Z"
    },
    {
        userId: "u5",
        fullName: "Phạm Minh Tuấn",
        email: "tuan.pm@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-05T07:45:00Z"
    },
    {
        userId: "u6",
        fullName: "Hoàng Thị Mai",
        email: "mai.ht@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-05T08:00:00Z"
    },
    {
        userId: "u7",
        fullName: "Ngô Quốc Bảo",
        email: "bao.nq@university.edu.vn",
        role: UserRole.Lecturer,
        createdAt: "2024-03-12T11:30:00Z"
    },
    {
        userId: "u8",
        fullName: "Đặng Thu Thảo",
        email: "thao.dt@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-06T09:10:00Z"
    },
    {
        userId: "u9",
        fullName: "Bùi Anh Đức",
        email: "duc.ba@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-06T10:20:00Z"
    },
    {
        userId: "u10",
        fullName: "Vũ Thị Ngọc",
        email: "ngoc.vt@university.edu.vn",
        role: UserRole.Lecturer,
        createdAt: "2024-05-20T15:00:00Z"
    },
    {
        userId: "u11",
        fullName: "Khoa Kinh tế",
        email: "economics.dept@university.edu.vn",
        role: UserRole.Department,
        createdAt: "2023-11-15T08:00:00Z"
    },
    {
        userId: "u12",
        fullName: "Phan Thanh Tùng",
        email: "tung.pt@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-07T13:45:00Z"
    },
    {
        userId: "u13",
        fullName: "Đỗ Thị Hồng",
        email: "hong.dt@university.edu.vn",
        role: UserRole.FacilityManager,
        createdAt: "2024-06-18T10:30:00Z"
    },
    {
        userId: "u14",
        fullName: "Trịnh Gia Bình",
        email: "binh.tg@university.edu.vn",
        role: UserRole.DepartmentHead,
        createdAt: "2024-02-25T09:00:00Z"
    },
    {
        userId: "u15",
        fullName: "Lý Mạch Dương",
        email: "duong.lm@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-08T16:20:00Z"
    },
    {
        userId: "u16",
        fullName: "Mai Xuân Hiếu",
        email: "hieu.mx@university.edu.vn",
        role: UserRole.Lecturer,
        createdAt: "2024-07-01T08:15:00Z"
    },
    {
        userId: "u17",
        fullName: "Nguyễn Bích Phương",
        email: "phuong.nb@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-09T11:00:00Z"
    },
    {
        userId: "u18",
        fullName: "Đinh Văn Mạnh",
        email: "manh.dv@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-10T14:30:00Z"
    },
    {
        userId: "u19",
        fullName: "Trần Bảo Nam",
        email: "nam.tb@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-11T09:50:00Z"
    },
    {
        userId: "u20",
        fullName: "Võ Thị Sáu",
        email: "sau.vt@student.edu.vn",
        role: UserRole.Student,
        createdAt: "2025-09-12T10:10:00Z"
    }
];