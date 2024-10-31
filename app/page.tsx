import Link from 'next/link';
import { client } from '../libs/microcms';

// ブログ記事の型定義
type Props = {
  id: string;
  title: string;
};

// microCMSからブログ記事を取得
async function getBlogPosts(): Promise<Props[]> {
  const data = await client.get<{ contents: Props[] }>({
    endpoint: 'blog', // 'blog'はmicroCMSのエンドポイント名
    queries: { fields: 'id,title'}, // idとtitleを取得
  });
  return data.contents;
}

export default async function Home() {
  const posts = await getBlogPosts(); // microCMSからブログ記事データを取得

  return (
    <main>
      <h1>ブログ記事一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.id}`}> {/* 記事へのリンクを生成 */}
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}