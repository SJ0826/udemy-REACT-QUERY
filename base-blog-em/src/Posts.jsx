import { useState } from "react";
import { useQuery } from "react-query"; // 서버에서 데이터를 가져올 때 사용하는 훅

import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery("posts", fetchPosts, {
    staleTime: 2000,
  }); // 인자 1: 쿼리 키, 인자 2: 쿼리 함수 (비동기)
  if (isLoading) return <h3>Loading...</h3>;
  // 리액트 쿼리는 기본적으로 세번 로딩 시도 후 안되면 에러라고 판단.
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  // isFetching과 isLoading의 차이점
  // isFetching: 비동기 쿼리가 해결되지 않았음
  // isLoading: isFetching의 하위집합, 데이터를 가져오는 중, 표시할 캐시가 없음

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
