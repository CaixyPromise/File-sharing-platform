export interface ColumnData
{
    label : string,
    key: string
}

// 定义一个类型，这个类型是一个函数，它接受任何类型的数据和键，并返回一个React节点
export type CustomRenderFunction<T> = (data: T, key: string) => React.ReactNode;
export type CustomCallbackFunction = React.MouseEvent<HTMLElement>;

export interface Action 
{
  type: ActionType;
  content: string;
  onClick?: (event: CustomCallbackFunction) => void;
}


// 单元格数据类型，包含数据和键值
export interface CellData<T> {
  key: string;
  data: T;
  actions?: Action[]; // 可以有多个动作
  render?: CustomRenderFunction<T>; // 可选的自定义渲染函数
}

// 行数据类型，是单元格数据类型的数组
export type RowData<T> = CellData<T>[];


export class TableStruct<T> 
{
  private headerName: string;
  private columns: ColumnData[];
  private rowsData: RowData<T>[];

  constructor(rowsData: RowData<T>[], 
              columns: ColumnData[], 
              headerName: string,
              ) 
  {
    this.columns = columns;
    this.rowsData = rowsData;
    this.headerName = headerName;
  }


  getRowsData(): RowData<T>[] {
    return this.rowsData;
  }

  getColumnsData(): ColumnData[] {
    return this.columns;
  }

  getRowsCount(): number {
    return this.rowsData.length;
  }
  
  getHeaderName(): string {
    return this.headerName;
  }
}

export type searchColumnsType = string[];
export type GenericEventHandler<T extends HTMLElement> = (event: React.MouseEvent<T>) => void;


export interface PrettyTableProps<T> 
{
  table_data: TableStruct<T>;
  // styles: { [key: string]: string };
  description?: string;
  searchColumns? : searchColumnsType;
}
