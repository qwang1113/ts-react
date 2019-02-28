declare var process: {
  env: {
    NODE_ENV: string
    APP_ENV: string
    BASEURL: string
  }
}

// 数据基础格式
declare interface IDataRow {
  id?: number;
  createdAt?: string;
  updateAt?: string;
}

// 基础对象
declare interface IBaseObj {
  [propName: string]: any
}