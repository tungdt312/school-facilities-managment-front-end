import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {SortingState} from "@tanstack/react-table";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const parseStringify =  (input: unknown) => {
  return JSON.parse(JSON.stringify(input))
}

export function formatISODate(isoString: string) {
  const date = new Date(isoString);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const day = date.getDate().toString().padStart(2, '0');

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export const formatNumber = (num: number) => {
  // Sử dụng locale 'en-US' để có dấu phẩy (1,000,000)
  // Hoặc 'vi-VN' nếu bạn muốn dấu chấm theo chuẩn VN (1.000.000)
  return num.toLocaleString('vi-VN');
};
export const getSortString = (sorting: SortingState) => {
  if (!sorting || sorting.length === 0) return undefined;

  // Áp dụng đúng quy tắc: [tên trường] + [dấu "-" nếu là giảm dần]
  return sorting
      .map(s => `${s.id}${s.desc ? '-' : ''}`)
      .join(','); // Nối các trường bằng dấu phẩy
};