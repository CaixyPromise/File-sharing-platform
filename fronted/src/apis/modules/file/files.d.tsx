interface RowData {
    id : number
    name : string
    file_type : string
    file_size : number
    add_time: string
    target_url : string
}

interface PublicFile {
    total: number,
    pageNo: number,
    size: number,
    row_data : RowData[]
}

interface TableState {
    data: PublicFile[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    isLoading: boolean;
    tableError: string | null;
    indexSet : number[]
}

export type{
    PublicFile,
    TableState
}