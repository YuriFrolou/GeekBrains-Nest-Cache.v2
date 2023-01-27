import styles from './comments.module.css';
import {useEffect, useState} from "react";

/* eslint-disable-next-line */
export interface CommentsProps {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  user: any;
  news: any;
}

export function Comments(props:any) {
  const [message,setMessage]=useState<string>('');
  const [deletedMessage,setDeletedMessage]=useState<number>();
  const [messages,setMessages]=useState<Array<CommentsProps>>([...props.comments]);
  const [updatedMessage,setUpdatedMessage]=useState<CommentsProps>();
  const [addedMessage,setAddedMessage]=useState<CommentsProps>();

  useEffect(()=>{
    setMessages(messages.filter((item)=>item.id!==deletedMessage));
  },[deletedMessage])

  useEffect(()=>{
    if(addedMessage){
      messages.push(addedMessage)
    }
    setMessages(messages);
  },[message])

  useEffect(()=>{
    setMessages(messages.map(item=>{
      if(item.id==updatedMessage?.id){
        item={...updatedMessage};
    }
    return item
    }));
  },[updatedMessage])

const getElementsVisible=(comment:any):any=>{
  return comment.user?.id==sessionStorage.getItem('userId')?{visibility:'visible'}:{visibility:'hidden'}
}

const getElementsInActive=(comment:any)=>{
  return comment.user?.id==sessionStorage.getItem('userId')?'inherit':'none'
}


const onChangeComment = (event:any) => {
  setMessage(event.currentTarget.value);
};

  const addComment = async(event:any) => {
    event.preventDefault();
    if(sessionStorage.getItem('userId')){
      const res=await fetch(`http://localhost:3001/api/comments`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          newsId: String(props.newsId),
          userId:sessionStorage.getItem('userId'),
          message:message
        })
      });
      if (!res.ok) {
        throw new Error();
      }
      const comment = await res.json();
      console.log(comment);
      setAddedMessage(comment);
    }
    else{
      alert('Комментарии могут оставлять только авторизованные пользователи');
    }
  };
  const onAdd=(event:any)=>{
    event.preventDefault();
    addComment(event).catch(error => {
      console.log(error.message)
    });
  }



  const updateComment = async(event:any) => {
  if(event.currentTarget.getAttribute('data-user')==sessionStorage.getItem('userId')){
    const res=await fetch(`http://localhost:3001/api/comments/${event.currentTarget.value}`,{
      method:'PATCH',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        id:event.currentTarget.previousElementSibling .getAttribute('data-id'),
        message:message
      })
    });
    if (!res.ok) {
       throw new Error();
    }
    const comment = await res.json();
    console.log(comment);
    setUpdatedMessage(comment);
  }
 else{
   alert('Вы не можете обновлять комментарии');
  }
};
  const onUpdate=(event:any)=>{
    updateComment(event).catch(error => {
      console.log(error.message)
    });
  }

const deleteComment = async (event:any) => {
  if(event.currentTarget.getAttribute('data-user')==sessionStorage.getItem('userId')) {
   const res= await fetch(`http://127.0.0.1:3001/api/comments/${event.currentTarget.value}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      throw new Error('Ошибка запроса');
    }
    const commentId = await res.json();
    console.log(commentId);
    setDeletedMessage(commentId);
  }else{
    alert('Вы не можете удалять комментарии');
  }
};
  const onDelete=(event:any)=>{
    deleteComment(event).catch(error => {
      console.log(error.message)
    });
  }
  return (
    <div>
      <h5 className="fw-bold lh-1 mb-3">Комментарии</h5>
      {messages? <div>{messages.map((comment:any) => {
        return (
          <div key={comment.id} className="mb-1">
            <div className="card-body d-flex justify-content-between"  style={{boxShadow:'inset 0 0 2px rgba(128,128,128,0.5)', padding:'10px 5px'}}>
              <div style={{minWidth: '90%'}}>
                <strong className="mb-1">{comment.user['lastName']} {comment.user['firstName']}</strong>
                <textarea className="form-control mb-1" placeholder={comment.message} name="updatedMessage" onChange={onChangeComment} data-id={comment.id} style={{pointerEvents:getElementsInActive(comment),minWidth:'100%'}}></textarea>
                <button onClick={onUpdate} value={comment.id} data-user={comment.user['id']} className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold"  style={getElementsVisible(comment)}>Fix comment</button>
              </div>
              <button type="button" onClick={onDelete} value={comment.id} data-user={comment.user['id']} className="close border-0 bg-transparent fs-3 sticky-top" aria-label="Close" style={getElementsVisible(comment)}>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        );
      })
        }</div>:<p>Коментариев нет</p>}

      <div>
        <h6 className="lh-1 mt-3">Форма добавления комментариев</h6>
        <div className="form-floating mb-1">
          <textarea className="form-control" placeholder="Leave a comment here"  name="message" onChange={onChangeComment}></textarea>
          <label htmlFor="floatingmessagearea2">Комментарий</label>
        </div>
        <button onClick={onAdd} className="btn btn-outline-info btn-sm px-4 me-sm-3 fw-bold">Send</button>
      </div>

  </div>
  );
}

export default Comments;
