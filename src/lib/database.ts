
import { Tables } from './databaseSchema';
import { v4 as uuidv4 } from 'uuid';

/**
 * 数据库操作工具
 * 提供本地存储模拟的数据库CRUD操作
 * 未来可替换为真实数据库连接
 */

/**
 * 获取表中的所有记录
 * @param table 表名
 * @returns 表中的所有记录数组
 */
export const getAll = <T>(table: Tables): T[] => {
  const data = localStorage.getItem(table);
  if (!data) return [];
  try {
    return JSON.parse(data, (key, value) => {
      // 将日期字符串转换回Date对象
      if (key === 'createdAt' || key === 'updatedAt' || key === 'lastLogin') {
        return value ? new Date(value) : null;
      }
      return value;
    });
  } catch (error) {
    console.error(`解析${table}表数据失败`, error);
    return [];
  }
};

/**
 * 根据ID获取单条记录
 * @param table 表名
 * @param id 记录ID
 * @returns 找到的记录或undefined
 */
export const getById = <T extends { id: string }>(table: Tables, id: string): T | undefined => {
  const records = getAll<T>(table);
  return records.find(record => record.id === id);
};

/**
 * 根据条件查询记录
 * @param table 表名
 * @param where 查询条件函数
 * @returns 符合条件的记录数组
 */
export const query = <T>(table: Tables, where: (record: T) => boolean): T[] => {
  const records = getAll<T>(table);
  return records.filter(where);
};

/**
 * 创建新记录
 * @param table 表名
 * @param data 要创建的记录数据（不含ID）
 * @returns 创建后的完整记录（含自动生成的ID）
 */
export const create = <T extends { id?: string }>(table: Tables, data: Omit<T, 'id'>): T => {
  const records = getAll<T>(table);
  
  // 生成新记录，自动添加ID和时间戳
  const newRecord = {
    ...data,
    id: data.id || uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  } as unknown as T;
  
  // 添加到记录集并保存
  records.push(newRecord);
  localStorage.setItem(table, JSON.stringify(records));
  
  return newRecord;
};

/**
 * 批量创建记录
 * @param table 表名
 * @param dataArray 要创建的记录数据数组
 * @returns 创建后的完整记录数组
 */
export const createMany = <T extends { id?: string }>(
  table: Tables, 
  dataArray: Array<Omit<T, 'id'>>
): T[] => {
  const records = getAll<T>(table);
  
  // 生成新记录数组，自动添加ID和时间戳
  const newRecords = dataArray.map(data => ({
    ...data,
    id: data.id || uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date()
  } as unknown as T));
  
  // 添加到记录集并保存
  records.push(...newRecords);
  localStorage.setItem(table, JSON.stringify(records));
  
  return newRecords;
};

/**
 * 更新记录
 * @param table 表名
 * @param id 记录ID
 * @param data 要更新的字段
 * @returns 更新后的完整记录或null（未找到）
 */
export const update = <T extends { id: string }>(
  table: Tables, 
  id: string, 
  data: Partial<T>
): T | null => {
  const records = getAll<T>(table);
  const index = records.findIndex(record => record.id === id);
  
  if (index === -1) return null;
  
  // 更新记录，并更新时间戳
  records[index] = {
    ...records[index],
    ...data,
    updatedAt: new Date()
  };
  
  localStorage.setItem(table, JSON.stringify(records));
  return records[index];
};

/**
 * 删除记录
 * @param table 表名
 * @param id 记录ID
 * @returns 是否成功删除
 */
export const remove = (table: Tables, id: string): boolean => {
  const records = getAll(table);
  const initialLength = records.length;
  
  const filtered = records.filter(record => record.id !== id);
  
  if (filtered.length < initialLength) {
    localStorage.setItem(table, JSON.stringify(filtered));
    return true;
  }
  
  return false;
};

/**
 * 清空表
 * @param table 表名
 */
export const clear = (table: Tables): void => {
  localStorage.setItem(table, JSON.stringify([]));
};

/**
 * 检查表是否存在
 * @param table 表名
 * @returns 表是否存在
 */
export const tableExists = (table: Tables): boolean => {
  return localStorage.getItem(table) !== null;
};

/**
 * 初始化表（如果不存在）
 * @param table 表名
 */
export const initTable = (table: Tables): void => {
  if (!tableExists(table)) {
    localStorage.setItem(table, JSON.stringify([]));
  }
};

/**
 * 初始化所有表
 */
export const initAllTables = (): void => {
  Object.values(Tables).forEach(table => {
    initTable(table as Tables);
  });
};

// 确保所有表都被初始化
initAllTables();
