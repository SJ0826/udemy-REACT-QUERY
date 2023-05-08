import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query"; // 서버에서 데이터를 가져올 때 사용하는 훅

import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    // currentPage가 변경될 때마다 프리페칭 진행
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      keepPreviousData: true, // 쿼리키가 변경되어도, 새 데이터가 요청되는 동안 마지막으로 성공한 fetch data로 유지된다.
    }
  ); // 인자 1: 쿼리 키, 인자 2: 쿼리 함수 (비동기)
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
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previosValue) => previosValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          // onClick함수에 프리페칭 작업을 하지 않는 이유: setState함수는 비동기로 실행되기 때문에 현재 페이지가 무엇인지 정확히 알 방법이 없다.
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

// 리액트 쿼리를 이용해 프리페칭 하는 이유: 다음 페이지버튼을 눌렀을 때 로딩되고 있는 과정을 사용자가 경험하지 않고 바로 결과를 확인할 수 있게 하기 위해서. 데이터를 불러올 동안 사용자가 기다려야 한다.
// 페이지가 캐시에 없어서 다음 버튼을 눌렀을 때 페이지가 로딩되길 기다려야 했다.

// Prefetch?
// 추후에 사용자가 사용할 데이터를 미리 가져온다.
// 데이터를 미리 불러와 캐시에 데이터를 추가하여 저장하는 것
// 기본값으로 만료 상태가 된다.
// 캐시가 만료된 이후에 데이터를 다시 불러오면 로딩인디케이터가 나타나므로 캐시 타임을 적절히 설정해야 한다.
