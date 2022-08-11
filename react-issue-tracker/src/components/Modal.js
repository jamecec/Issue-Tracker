import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({open, children, onClose, onSubmit, deleteItem, issueId, userId, enableButton}){
  if (!open) return null
  const deleteButton = !deleteItem || enableButton === false? (<div/>) : !userId ? (<button className="delete-button" onClick={()=>deleteItem(issueId)}>Delete Issue</button>) : (<button className="delete-button" onClick={()=>deleteItem(userId)}>Delete User</button>);
  const saveButton = !onSubmit  || enableButton === false ? (<div/>) : (<button className="modal-button" onClick={onSubmit}>Save</button>);

  return ReactDOM.createPortal(
    <>
    <div className = "overlay" />
    <div className = "modal">
    {children}
    <div className = "button-div">
    {saveButton}
    {deleteButton}
    <button className="modal-button" onClick={onClose}>Cancel</button>
    </div>
    </div>
    </>,
    document.getElementById('portal')
  )
}
 //reference: https://www.youtube.com/watch?v=LyLa7dU5tp8&t=15s
