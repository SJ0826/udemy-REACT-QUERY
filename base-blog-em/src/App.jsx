import { Posts } from "./Posts";
import "./App.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// QueryClient: 캐시와 기본 옵션을 자녀 컴포넌트도 사용할 수 있다.
const qeuryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    <QueryClientProvider client={qeuryClient}>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

// stale Time: 데이터를 허용하는 최대 시간, 데이터가 만료되었다고 만료될때까지 허용하는 최대시간
// 데이터는 만료되었을 때만 리페칭이 가능하다.
// 왜 기본값이 0이지? 데이터는 항상 만료상태이므로 서버에서 다시 가져와야 한다는 것을 가정한다. -> 만료된 ㅣ데이터를 클라이언트에게 제공할 가능성이 줄어든다.

// stateTime vs cachㄷTime
// stateTime: 리페칭시 고려할 사항
// cache: 나중에 다시 사용할 수도 있는 데이터
// useQuery가 활성화되어 있지 않으면, 쿼리는 cold storage로 간다.
// cache data는 cacheTime(기본 5분)이후 만료된다.
// 캐시가 만료되면 가비시 컬렉션이 실행되고 클라이언트는 데이터를 사용할 수 없다.
// 데이터가 캐시에 있는 동안 데이터 페칭에 사용할 수 있다.
