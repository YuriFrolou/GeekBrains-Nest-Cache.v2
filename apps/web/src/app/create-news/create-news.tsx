import styles from './create-news.module.css';
import Comments, {CommentsProps} from "../comments/comments";
import {useEffect, useState} from "react";

/* eslint-disable-next-line */
export interface CreateNewsProps {}

export function CreateNews(props: CreateNewsProps) {

  const [title,setTitle]=useState<string>('');
  const [description,setDescription]=useState<string>('');
  const [userId,setUserId]=useState<string>(String(sessionStorage.getItem('userId')));
  const [cover,setCover]=useState<File>();


  // const addNews = async(event:any) => {
  //   event.preventDefault();
  //   if(sessionStorage.getItem('userId')){
  //     const res=await fetch(`http://localhost:3001/api/news`,{
  //       method:'POST',
  //       headers:{
  //         'Content-Type':'multipart/form-data'
  //       },
  //       body:JSON.stringify({
  //         userId:sessionStorage.getItem('userId'),
  //         title:title,
  //         description:description,
  //         cover:cover
  //       })
  //     });
  //     if (!res.ok) {
  //       throw new Error();
  //     }
  //     const news = await res.json();
  //     console.log(news);
  //     window.location.href="/";
  //   }
  //   else{
  //     alert('Новости могут создавать только авторизованные пользователи');
  //   }
  // };
  // const onAdd=(event:any)=>{
  //   event.preventDefault();
  //   addNews(event).catch(error => {
  //     console.log(error.message)
  //   });
  // }

  return (
    <div>
    <h1 className="text-center mb-3">Создание новости</h1>
  <div className='row'>
    <div className="col-lg-6 mx-auto">
      <form target="_blank" name="form" method="POST" action="http://localhost:3001/api/news" encType="multipart/form-data">
        <input type="text" className="form-control" name="userId" value={userId} onChange={(e)=>{
          setUserId(e.target.value)
        }} hidden={true}/>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Заголовок новости</label>
          <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="title"
                 placeholder="Enter title" onChange={(e)=>{
                setTitle(e.target.value)
          }}/>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Содержание новости</label>
          <textarea className="form-control" placeholder="Enter your text"  name="description" id="exampleInputPassword1" onChange={(e)=>{
            setDescription(e.target.value)
          }}></textarea>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="exampleFormControlFile1">Выберите обложку новости</label>
          <input type="file" className="form-control-file" id="exampleFormControlFile1" name="cover"
                 onChange={(e:any)=>{setCover(e.target.files[0])}}/>
        </div>
        <button  type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
  </div>

  );
}

export default CreateNews;
