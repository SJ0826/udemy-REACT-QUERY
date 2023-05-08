import { useQuery } from "react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isError, error, isLoading } = useQuery(
    // 문자열 comment에 식별자 역할을 하는 post.id 추가
    ["comments", post.id],
    () => fetchComments(post.id)
  );
  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}

// 첫번째 게시글을 클릭해서 나온 댓글이 다른 게시물을 클릭해도 업데이트되지 않은 이유
// 쿼리 키 때문이다.
// 모든 쿼리가 commnets라는 쿼리키를 동일하게 사용했기 때문이다. -> 어떤 트리거가 있어야만 데이터를 리페칭한다.
// 트리거될 때
// 1. 컴포넌트 리마운트 2. 윈도우 리포커징 3. 리패칭함수 실행 4. 자동 리패칭 5. mutation 이후 쿼리 무효화
// 새 블로그 게시물 제목을 클릭해도 트리거가 발생하지 않았다. -> 따라서 데이터가 만료되어도 새 데이터를 가져오지 않는다.

// 방법 1: 새 블로글 게시물 제목을 클릭할 때마다 데이터를 무효화시키기 -> 간단하지 않음. 데이터를 제거하는 것은 좋지 않은 방안.
// 쿼리가 postID를 가지고 있기 때문에 쿼리 별로 데이터를 캐시할 수 있다.
// 각 게시물에 대한 쿼리에 라벨을 설정한다! -> 쿼리키를 배열로 작성하면 가능하다!

// 쿼리 키를 쿼리에 대한 의존성 배열로 취급한다.
// 리액트 쿼리는 쿼리의 의존성 배열이 다르다면 완전히 다른 것으로 간주한다.
