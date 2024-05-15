import React, { useEffect, useState } from 'react';
import { ColumnData } from './index.d';
import Loadings from "@/components/Loading";
import { PrettyTable } from '@/components/Table';
import { TableStruct, searchColumnsType, 
  GenericEventHandler, CustomCallbackFunction } from '@/components/Table/index.d';
import { useDispatch, useSelector } from 'react-redux'
import {fetchDataList} from "@/stores/modules/file"
import { set_LoadingState } from "@/stores/modules/file"
// 用户数据示例

const UserList: React.FC = () => 
{
    const [isLoading, setIsLoading] = useState(true);
    const dataList = useSelector((state: any) => state.table.data)
    const pageNo = useSelector((state: any) => state.table.currentPage) // 当前页码
    const pageSize = useSelector((state: any) => state.table.pageSize)  // 页面大小
    const dispatch = useDispatch();

    console.log(pageNo, pageSize);

    // 数据加载函数
    useEffect(() => {
      const loadData = async () => 
      {
        setIsLoading(true);
        dispatch<any>(set_LoadingState(true));
        try {
          console.log("ready for requests, data is:", pageNo, pageSize);

          await dispatch<any>(fetchDataList(pageNo, pageSize));
        } 
        catch (error) 
        {
          console.error('Error fetching data:', error);
        }
        finally {
          setIsLoading(false);
          dispatch<any>(set_LoadingState(false));
        }
      };

      loadData();
    }, [dispatch, pageNo, pageSize]);

    const transformedList = dataList.map((item: { [x: string]: any; }) => 
    {
      let row: any[] = [];
      Object.keys(item).forEach(key => 
      {
          let column:any = { key, data: item[key] };
          if (key === "targetUrl") 
          {
              column.actions = [{ type: "button", content: "下载", onClick: () => console.log(item[key]) }];
          }
          
          row.push(column);
      });
      return row;
    });

    console.log("transformedList: ", transformedList);

  
    const columns: ColumnData[] = [
        { label: '文件ID', key: 'fileId' },
        { label: '文件名', key: 'fileName' },
        { label: '文件类型', key: 'fileType' },
        { label: '文件大小', key: 'fileSize' },
        { label: '上传日期', key: 'createTime' },
        { label: '下载次数', key: 'downloadCount'},
        { label: '下载链接', key: 'targetUrl' }
    ];

    // 发送消息的函数
    const sendMessage: GenericEventHandler<HTMLElement>
       = (event: CustomCallbackFunction): void  => 
    {
        const username = event.currentTarget.dataset.username;
        // 实际的发送消息逻辑
    };

      const userTable = new TableStruct(transformedList, columns, "User Table");


      
    const searchColumnsKey: searchColumnsType = [
        'fileName',
    ]      


    return (
      <>
      {/* 数据加载时显示 Loading 组件 */}
      {isLoading && <Loadings />}

      {/* 数据加载完成后显示表格内容 */}
      {!isLoading && (
        <PrettyTable table_data={userTable}  description="caixypromise" searchColumns={searchColumnsKey}/>
      )}
      </>
        
    );
};

export {
    UserList
};