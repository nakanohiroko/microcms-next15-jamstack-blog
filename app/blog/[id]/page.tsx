import { client } from '../../../libs/microcms';
import styles from './page.module.css';
import dayjs from 'dayjs';

// ブログ記事の型定義
type Props = {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  category: { name: string };
};

// microCMSから特定の記事を取得する関数
async function getBlogPost(id: string): Promise<Props> {
  const data = await client.get({
    endpoint: `blog/${id}`,
  });
  return data;
}

// 記事詳細ページの生成
export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // IDを取得
  const post = await getBlogPost(id); // microCMSから特定の記事データを取得

  // dayjsを使ってpublishedAtをYY.MM.DD形式に変換
  const formattedDate = dayjs(post.publishedAt).format('YY.MM.DD');

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{post.title}</h1> {/* タイトルを表示 */}
      <div className={styles.date}>{formattedDate}</div> {/* 日付を表示 */}
      <div className={styles.category}>カテゴリー：{post.category && post.category.name}</div>
      <div className={styles.post} dangerouslySetInnerHTML={{ __html: post.body }} /> {/* 記事本文を表示 */}
    </main>
  );
}

// 静的パスを生成
export async function generateStaticParams() {
  const data = await client.get({
    endpoint: 'blog',
    queries: { fields: 'id' }, // 取得するフィールドを指定
  });

  return data.contents.map((post: Props) => ({
    id: post.id, // 各記事のIDをパラメータとして返す
  }));
}