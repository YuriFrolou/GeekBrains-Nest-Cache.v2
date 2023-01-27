import styles from './news.module.css';
import {JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useState} from "react";
import {NavLink} from "react-router-dom";

/* eslint-disable-next-line */
export interface NewsProps {
  id: number;
  title: string;
  description: string;
  cover:string;
  createdAt: Date;
  updatedAt: Date;
  user: any;
  comments: any;
}
let eTag: string | null;
let cashNews: NewsProps[]=[];

export function News() {
  const [news, setNews] = useState<Array<NewsProps>>();
  const getNews = async () => {
    const res = await fetch(`http://localhost:3001/api/news`, {
      headers: {'If-None-Match': eTag as any}
    });
     if (res.status === 304 && cashNews.length!==0) {
      setNews(cashNews);
     } else if (res.ok) {
      eTag = res.headers.get('etag');
      const data = await res.json();
      console.log(data);
      setNews(data);
      cashNews = [...data];
     }else{
       throw new Error('Ошибка получения данных с сервера');
     }
  }

  useEffect(() => {
    getNews().catch(error => {
      throw new Error('Ошибка получения данных с сервера');
    });
  }, []);

  return (
    <div>
      {news?.length!==0 ? <div className="container-fluid">
          <h1>Список новостей</h1>
          <div className='row d-flex flex-wrap'>
            {news?.map((item: any) => {
              return (
                <div className="col-lg-3 mb-3" key={item.id}>
                  <div className="card mb-1">
                    <img src={"http://localhost:3001/" + item['cover']} className="card-img-top" alt="cat"/>
                    <div className="card-body">
                      <h3 className="card-title">{item['title']}</h3>
                      <h6 className="card-subtitle mb-2 text-muted">{item.user['lastName']} {item.user['firstName']}</h6>
                      <p className="card-text">{item['description']}</p>
                    </div>
                  </div>
                  <NavLink type="button" className="btn btn-outline-info" to={{
                    pathname: "/detail/" + item.id,
                  }}>Подробнее</NavLink>
                </div>
              )
            })}
          </div>
        </div>
        : <h1>Список новостей пуст</h1>
      }
    </div>
  );
}

export default News;



