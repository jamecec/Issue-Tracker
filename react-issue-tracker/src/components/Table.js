import React, {useState, useEffect, useRef, useMemo} from 'react';
import Pagination from "./Pagination";
import IssueForm from "./IssueForm";
import Modal from "./Modal.js";
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

export default function Table({arr, perPage, users}){
  const { user } = useAuth0();
  const [sortField, setSortField] = useState();
  const prevSortField = useRef();
  const [sortIcon, setSortIcon] = useState();
  const [sortOrder, setSortOrder] = useState("asc");
  const [tableData, setTableData] = useState(arr);
  const [currentPage, setCurrentPage] = useState(1);
  const [issueIsOpen, setIssueIsOpen] = useState(false);
  const [issueFound, setIssueFound] = useState();
  const [issueId, setIssueId] = useState();
  const [modalStatus, setModalStatus] = useState();

  const closeIssueModal = () => {
    setIssueIsOpen(false);
  }

  const openIssue = async (id) =>{
    setIssueId(id);
    const findIssue = await axios.get(`http://localhost:5000/api/issues/${id}`);
    console.log("issue found");
    setIssueFound(findIssue.data);
    setIssueIsOpen(true);
  }

  const deleteIssue = (id) => {
      let currentUser = users.filter((item) => item.email === user.email);
      if(currentUser[0].role === "admin"){
        (async () => {
          await axios.delete(`http://localhost:5000/api/issues/${id}`, {_id: id});
          console.log("issue deleted");
          setModalStatus("Issue Deleted!");
        })();
        setTimeout(()=>{
          closeIssueModal();
          setModalStatus();
        }, 500);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
      else{
        alert("Admin Access Required");
      }
  }

  const editIssue = {action: "put", _id: issueId}

  useEffect(()=>{
      setTableData(arr);
  },[arr]);

let PageSize = perPage;

const currentTableData = useMemo(()=>{
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return tableData.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, tableData, perPage])

  const sortChange = (header) => {
    const order = header === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(header);
    setSortOrder(order);
    handleSorting(header, order);
  }

  const handleSorting = (header, order) => {
    const sorted = [...arr].sort((a,b) => {
      return(
        a[header].toString().localeCompare(b[header].toString(), "en", {
          numeric: true,
        }) * (order === "asc" ? 1 : -1)
      );
    });
    setTableData(sorted);
  };

  function tableHeaders(){
    const headers = Object.keys(tableData[0]);
    let filteredHeaders = headers.filter((item)=> item !== "__v" && item !== "Comments");
    return(
      <tr>
      {filteredHeaders.map((header) => {const cl = sortField === header && sortOrder == "asc" ? "fa-solid fa-caret-up" : sortField === header && sortOrder === "desc" ? "fa-solid fa-caret-down" : "";
      return(<th key={header} onClick={()=>sortChange(header)}>{header}<span key={header + " span"} className={cl}/></th>)})}
      </tr>
      )
    };

  function tableRows() {
    function getValues(obj, lengthLimit){
      const rows = [];
      for(var key in obj){
        if(key !== "Comments" && key !=="__v"){
        let rowValue = obj[key].length > lengthLimit ? (obj[key].substring(0, lengthLimit) + "...") : obj[key];
        rows.push(<td key={obj._id + key + obj[key]} label={key}>{rowValue}</td>)
      }
    }
      return(rows)
    }
    return(
      currentTableData.map((item) => <tr onClick={()=>openIssue(item._id)} key={item._id}>{getValues(item, 25)}</tr>)
    )
  };

  return(
    <div className = "table-container">
    <div className = "main-table">
    <table>
      <thead>
        {tableHeaders()}
      </thead>
      <tbody>
      {tableRows()}
      </tbody>
      </table>
      <Modal open={issueIsOpen} onClose={closeIssueModal} deleteItem={deleteIssue} issueId={issueId}>
      <div className="modal-div">
      <h1>Edit An Issue</h1>
      <IssueForm issueAction={editIssue} foundIssue={issueFound} closeIssueModal={closeIssueModal}/>
      {modalStatus}
      </div>
      </Modal>
      <Pagination
        className='pagination-bar'
        currentPage={currentPage}
        totalCount={tableData.length}
        pageSize={PageSize}
        onPageChange={page=> setCurrentPage(page)}
        />
        </div>
        </div>
  )
}
//assistance with sorting found here: https://blog.logrocket.com/creating-react-sortable-table/
