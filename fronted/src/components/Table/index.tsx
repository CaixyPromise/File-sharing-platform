import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { PrettyTableProps, Action, CellData } from './index.d';
import SearchIcon from "@/assets/search.png";
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataList, set_currentPage, set_pageSize } from '@/stores/modules/file';

const PrettyTable: React.FC<PrettyTableProps<any>> = ({ table_data, description, searchColumns }) => 
{
  const renderCellContent = (cell: CellData<any>) => 
  {
    return (
      <React.Fragment>
        {cell.actions ? cell.actions && cell.actions.map((action:Action, index:number) => 
        {
          switch (action.type)
          {
            case 'link':
              return <a href={action.content} key={index}>{cell.data}</a>;
            case 'button':
              return <p className={styles.button} onClick={action.onClick} key={index}>{action.content}</p>;
            default:
              return cell.data;
          }
        }) 
        : cell.data
        }
      </React.Fragment>
    );
  };
  const dispath = useDispatch();
  const setCurrentPage = (pageNo: number) =>
  {
    // dispath<any>(fetchDataList(pageNo, PerPageSize));
    dispath<any>(set_currentPage(pageNo));
  }
  const setUsersPerPage = (pageSize : number) =>
  {
    dispath<any>(set_pageSize(pageSize));
  }


  const tableData = table_data.getRowsData();
  const [highlightedRows, setHighlightedRows] = useState(new Set<number>());
  const [searchText, setSearchText] = useState("");

  // 当前页码
  const currentPage = useSelector((state: any) => state.table.currentPage);
  // 分页大小
  const PerPageSize = useSelector((state: any) => state.table.pageSize);
  // const [totalNum, settotalNum] = useState(table_data.getRowsCount());
  const totalNum = useSelector((state: any) => state.table.totalItems);
  const maxPageSize = Math.ceil(totalNum / PerPageSize);

  // 每页显示的数据量选项
  const perPageOptions = [10, 20, 50, 100];

  // 处理每页显示数据量变化
  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => 
  {
    setUsersPerPage(Number(event.target.value));
    setCurrentPage(1); // 重置为第一页
  };

  // 计算当前页显示的数据
  const indexOfLastUser = currentPage * PerPageSize;
  const indexOfFirstUser = indexOfLastUser - PerPageSize;
  const currentUsers = tableData.slice(indexOfFirstUser, indexOfLastUser);

  // 处理分页
  const paginate = (pageNumber:number) => 
  {
    if (pageNumber > maxPageSize)
    {
      setCurrentPage(maxPageSize);
      return;
    }
    if (pageNumber < 1)
    {
      setCurrentPage(1);
      return;
    }
    setCurrentPage(pageNumber)
  };
  const firstRowRef = useRef<HTMLTableRowElement>(null);

  // 处理搜索文本变化
  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => 
  {
    setSearchText(event.target.value);
  };

  const debouncedSearch = useRef(
    debounce((searchValue) => 
    {
        if (!searchValue.trim()) {
            // 如果搜索文本为空或只包含空格，清除所有高亮行
            setHighlightedRows(new Set());
            return;
        }
      const newHighlightedRows = new Set<number>();
      
      const columnsToSearch = searchColumns?.length ? searchColumns : table_data.getColumnsData().map(col => col.key);
      // console.log(columnsToSearch) 
      // 对每一行数据进行迭代
      table_data.getRowsData().forEach((row, rowIndex) => 
      {
        // 确保对每一个需要搜索的列键进行迭代
        const searchResults = columnsToSearch.map(key => 
        {
          // 找到对应列键的单元格数据
          const cellData = row.find(cell => cell.key === key);
          // console.log(cellData)
          // 如果单元格数据存在，并且其包含搜索值，则返回true
          return cellData?.data?.toString().toLowerCase().includes(searchValue.toLowerCase());
        });

        // 如果任何一个搜索结果为true，将行索引添加到高亮集合中
        if (searchResults.some(isMatch => isMatch)) 
        {
          newHighlightedRows.add(rowIndex);
        }
      });
      setHighlightedRows(newHighlightedRows);
    }, 300)
  ).current;

  // 监听搜索文本变化，执行搜索
  useEffect(() => 
  {
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  // 高亮行变化时滚动到第一个高亮的行
  useEffect(() => 
  {
    if (highlightedRows.size > 0 && firstRowRef.current) 
    {
      firstRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      console.log('length is:', highlightedRows.size)
    }
  }, [highlightedRows]);

  useEffect(() => 
  {
    // setCurrentPage(1);
    // settotalNum(table_data.getRowsCount());
  }, [searchText, setCurrentPage, table_data]);
  
  return (
    <main className={styles['pretty-table']}>
      <section className={styles['pretty-table__header']}>
        <div className={styles['header-content']}> {/* 添加一个新的 div 用于包裹标题和描述 */}
          <h1>{table_data.getHeaderName()}</h1>
          {description && <p className={styles['description']}>{description}</p>} {/* 条件渲染描述信息 */}
        </div>
        <div className={styles['pretty-table__header__input-group']}>
          <input type="search" placeholder={'Search for: '.concat(searchColumns?.length ? searchColumns.join(', ') : '请输入搜索内容', '...')} onChange={handleSearchTextChange} />
          <img src={SearchIcon} alt='搜索' onClick={() => searchText.trim() && debouncedSearch(searchText)} />
        </div>
      </section>
      <section className={styles['pretty-table__shell']}>
        <table>
          <thead>
            <tr>
              {table_data.getColumnsData().map(header => <th key={header.key}>{header.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((row, rowIndex) => (
              <tr key={rowIndex} ref={rowIndex === 0 ? firstRowRef : null}>
                {row.map((cell) => 
                (
                    <td key={cell.key} 
                        className={highlightedRows.has(rowIndex) ? styles.highlighted : ''}
                    >
                    {renderCellContent(cell)}
                    </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
       <footer className={styles['pretty-table__footer']}>
        <div className={styles['pretty-table__pagination']}>
        <div className={styles['pretty-table__pagination__info']}>
          Page {currentPage} of {maxPageSize}
          <span>  </span>
          {/* <select 
              onChange={handlePerPageChange}
              className={styles['pretty-table__pagination__select']}
            >
              {perPageOptions.map(option => (
                <option key={option} value={option} > 
                  {option} / page
                </option>
              ))}
            </select> */}
          Total number of data: {totalNum}
        </div>
        <div className={styles['pretty-table__pagination__controls']}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles['pretty-table__pagination__controls__button']}
          >
            上一页
          </button>
          
          {/* 输入跳转页数 */}
          <input
            type="number"
            className={styles['pretty-table__pagination__controls__input']}
            value={currentPage}
            onChange={(e) => paginate(Number(e.target.value))}
            
          />
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalNum / PerPageSize)}
            className={styles['pretty-table__pagination__controls__button']}
          >
            下一页
          </button>
        </div>
      </div>
        </footer>
    </main>
  );
};

export { PrettyTable };
