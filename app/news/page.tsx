export const revalidate = 3600;

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
}

async function fetchNews(query: string, pageSize = 9): Promise<Article[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      language: "en",
      sortBy: "publishedAt",
      pageSize: String(pageSize),
      apiKey: key,
    });
    const res = await fetch(`https://newsapi.org/v2/everything?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles as Article[]).filter(
      (a) => a.title && a.title !== "[Removed]" && a.url
    );
  } catch {
    return [];
  }
}

function timeAgo(iso: string) {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col overflow-hidden"
    >
      {article.urlToImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.urlToImage}
          alt={article.title}
          className="w-full aspect-video object-cover bg-slate-100"
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span className="font-medium text-indigo-600">{article.source.name}</span>
          <span>·</span>
          <span>{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-3 flex-1">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-slate-500 text-xs mt-2 line-clamp-2">{article.description}</p>
        )}
        <span className="text-indigo-600 text-xs font-medium mt-3">Read more →</span>
      </div>
    </a>
  );
}

export default async function NewsPage() {
  const [claudeNews, agentNews] = await Promise.all([
    fetchNews("Claude AI Anthropic", 9),
    fetchNews("agentic AI LLM agent coding assistant", 6),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">News & Research</h1>
        <p className="text-slate-500">
          Current developments in Claude, Anthropic, and the agentic AI space. Updated hourly.
        </p>
      </div>

      <section className="mb-14">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Claude & Anthropic</h2>
        {claudeNews.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>News loading — check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {claudeNews.map((a, i) => <ArticleCard key={i} article={a} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Agentic AI & LLM Development</h2>
        {agentNews.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>Articles loading — check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agentNews.map((a, i) => <ArticleCard key={i} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
