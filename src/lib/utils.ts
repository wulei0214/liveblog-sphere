
/**
 * 通用工具函数库
 * 
 * 提供整个应用程序通用的工具函数，如CSS类合并等
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并CSS类名工具函数
 * 
 * 使用clsx和twMerge合并多个类名，并智能处理Tailwind类名冲突
 * 
 * @param inputs 要合并的CSS类名或条件类名对象
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
