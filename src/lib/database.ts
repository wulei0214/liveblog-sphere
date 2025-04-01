
import { Tables } from './databaseSchema';

/**
 * 简单的本地存储数据库实现
 * 使用localStorage存储数据
 */

// 获取表数据
const getTableData = <T>(table: Tables): T[] => {
  try {
    const data = localStorage.getItem(table);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`获取表${table}数据失败:`, error);
    return [];
  }
};

// 保存表数据
const saveTableData = <T>(table: Tables, data: T[]): void => {
  try {
    localStorage.setItem(table, JSON.stringify(data));
  } catch (error) {
    console.error(`保存表${table}数据失败:`, error);
  }
};

/**
 * 获取所有记录
 * @param table 表名
 * @returns 记录数组
 */
export const getAll = <T>(table: Tables): T[] => {
  return getTableData<T>(table);
};

/**
 * 按ID获取单个记录
 * @param table 表名
 * @param id 记录ID
 * @returns 记录对象或null
 */
export const getById = <T extends { id: string }>(table: Tables, id: string): T | null => {
  const records = getTableData<T>(table);
  return records.find(record => record.id === id) || null;
};

/**
 * 创建新记录
 * @param table 表名
 * @param data 记录数据
 * @returns 创建的记录
 */
export const create = <T extends { id: string }>(table: Tables, data: T): T => {
  const records = getTableData<T>(table);
  // 确保记录有ID
  if (!data.id) {
    throw new Error('记录必须有ID');
  }
  
  // 添加记录
  records.push(data);
  saveTableData(table, records);
  return data;
};

/**
 * 批量创建记录
 * @param table 表名
 * @param dataArray 记录数据数组
 * @returns 创建的记录数组
 */
export const createMany = <T extends { id: string }>(table: Tables, dataArray: T[]): T[] => {
  const records = getTableData<T>(table);
  
  // 验证所有记录都有ID
  dataArray.forEach(data => {
    if (!data.id) {
      throw new Error('所有记录必须有ID');
    }
  });
  
  // 添加记录
  const newRecords = [...records, ...dataArray];
  saveTableData(table, newRecords);
  return dataArray;
};

/**
 * 更新记录
 * @param table 表名
 * @param id 记录ID
 * @param data 更新数据
 * @returns 更新后的记录或null
 */
export const update = <T extends { id: string }>(table: Tables, id: string, data: Partial<T>): T | null => {
  const records = getTableData<T>(table);
  const index = records.findIndex(record => record.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // 更新记录
  records[index] = { ...records[index], ...data };
  saveTableData(table, records);
  return records[index];
};

/**
 * 删除记录
 * @param table 表名
 * @param id 记录ID
 * @returns 是否成功
 */
export const remove = <T extends { id: string }>(table: Tables, id: string): boolean => {
  const records = getTableData<T>(table);
  const filteredRecords = records.filter(record => record.id !== id);
  
  if (filteredRecords.length === records.length) {
    return false;
  }
  
  saveTableData(table, filteredRecords);
  return true;
};

/**
 * 查询记录
 * @param table 表名
 * @param filter 过滤函数
 * @returns 符合条件的记录数组
 */
export const query = <T>(table: Tables, filter: (record: T) => boolean): T[] => {
  const records = getTableData<T>(table);
  return records.filter(filter);
};

/**
 * 清空表
 * @param table 表名
 */
export const clearTable = (table: Tables): void => {
  saveTableData(table, []);
};
