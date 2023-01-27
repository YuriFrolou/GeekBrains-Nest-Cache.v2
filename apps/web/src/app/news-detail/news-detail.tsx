import styles from './news-detail.module.css';
import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import Comments from "../comments/comments";
import {NewsProps} from "../news/news";

/* eslint-disable-next-line */
export interface NewsDetailProps {
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
let cashNews: NewsProps={}as NewsProps;
export function NewsDetail() {
  const [news, setNews] = useState<NewsDetailProps>();
  const newsId = parseInt(window.location.href.split('/').reverse()[0]);
  const getNews = async () => {
    const res = await fetch(`http://localhost:3001/api/news/detail/${newsId}`,
      {
        headers: {'If-None-Match': eTag as any}
      });

    if (res.status === 304 && !!cashNews) {
      setNews(cashNews);
    } else if (res.ok) {
      eTag = res.headers.get('etag');
      const data = await res.json();
      setNews(data);
      cashNews = data;
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
      {news ? <div>
          <h1 className="text-center mb-3">Детальная страница новости</h1>
          <div className='row'>
            <div className="col-lg-6 mx-auto">
                  <div className="card mb-3">
                    <img src={"http://localhost:3001/"+news['cover']} className="card-img-top" alt="cat"/>
                    <div className="card-body">
                      <h3 className="card-title">{news['title']}</h3>
                      <h6 className="card-subtitle mb-2 text-muted">{news.user['lastName']} {news.user['firstName']}</h6>
                      <p className="card-text">{news['description']}</p>
                    </div>
                  </div>
              <Comments comments={news.comments} userId={news.user['id']} newsId={newsId}/>
                </div>

        </div>

        </div>
        :<h1>Новость не найдена</h1>}
    </div>
  );
}

export default NewsDetail;
