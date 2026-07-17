export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-neon-blue mb-8">Skate Judging System</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/judge"
            className="p-6 bg-gray-800 rounded-lg border border-neon-blue hover:border-neon-pink transition-colors"
          >
            <h2 className="text-2xl font-semibold text-neon-blue mb-2">Judge Panel</h2>
            <p className="text-gray-400">Score single tricks and combos</p>
          </a>
          <a
            href="/leaderboard"
            className="p-6 bg-gray-800 rounded-lg border border-neon-blue hover:border-neon-pink transition-colors"
          >
            <h2 className="text-2xl font-semibold text-neon-blue mb-2">Leaderboard</h2>
            <p className="text-gray-400">Real-time MC view</p>
          </a>
          <a
            href="/scoreboard"
            className="p-6 bg-gray-800 rounded-lg border border-neon-blue hover:border-neon-pink transition-colors"
          >
            <h2 className="text-2xl font-semibold text-neon-blue mb-2">Public Scoreboard</h2>
            <p className="text-gray-400">Fullscreen display</p>
          </a>
        </div>
      </div>
    </main>
  )
}
