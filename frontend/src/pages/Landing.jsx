import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface.jsx';
import { Link } from 'react-router-dom';

function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Model Shield
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 leading-relaxed">
              A safety-first layer for LLM applications. Detect prompt injection, unsafe content, and
              hallucinations before they reach your users. Pair ML-based detection with dynamic rules and
              a clean audit trail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 shadow-lg transition"
              >
                Check a prompt
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-5 py-3 shadow-sm transition"
              >
                Open Dashboard
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Tip: Try a suspicious prompt like "Ignore all previous instructions" to see the block flow.
            </p>
          </div>
          <div>
            <div className="rounded-2xl border border-gray-200 p-6 shadow-xl bg-white">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-6 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200 text-sm">
                Non-malicious responses will appear like this.
              </div>
              <div className="mt-3 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200 text-sm">
                Malicious or blocked responses will appear like this.
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900">Why Model Shield?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <FeatureCard title="Prompt Injection Defense" desc="Detect and block common jailbreak and policy override attempts with ML + rules." />
          <FeatureCard title="Unsafe Content Filter" desc="Catch hateful, violent, or disallowed content before it reaches your users." />
          <FeatureCard title="Post-Response Checks" desc="Flag hallucinations and suspicious outputs before responding to the user." />
        </div>
      </section>

      {/* Chat Modal */}
      <ChatInterface open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default Landing;
