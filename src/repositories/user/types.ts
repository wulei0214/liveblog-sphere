
/**
 * 用户相关类型定义
 */
import { Tables } from '../../lib/databaseSchema';

/**
 * 用户角色枚举
 * 定义系统中可用的用户角色
 */
export enum UserRole {
  USER = 'user',     // 普通用户
  ADMIN = 'admin',   // 管理员用户
  EDITOR = 'editor'  // 编辑用户
}

/**
 * 用户类型定义
 * 包含用户的完整信息结构
 */
export interface User {
  id: string;          // 用户唯一标识
  username: string;    // 用户名/昵称
  password: string;    // 密码（实际应用中应该加密存储）
  createdAt: Date;     // 创建时间
  lastLogin?: Date;    // 最后登录时间
  email?: string;      // 电子邮件
  phone?: string;      // 手机号码
  avatar?: string;     // 头像URL
  bio?: string;        // 个人简介
  birthDate?: Date;    // 生日
  following?: string[]; // 关注的用户ID列表
  followers?: string[]; // 粉丝ID列表
  role?: UserRole;     // 用户角色
}

/**
 * 用户资料表单数据类型
 * 用于资料设置表单
 */
export interface UserProfileFormData {
  username: string;    // 用户昵称
  birthDate?: Date;    // 生日
  bio?: string;        // 个人简介
  avatar?: string;     // 头像URL
}
