import React, { useState } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  Layers,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import Badge from '../components/common/Badge';

const MODULES = [
  {
    id: 'closures',
    title: '1. JavaScript Closures',
    subtitle: 'Lexical Scope & Persistent Environment State',
    description:
      'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, closures give an inner function access to an outer function’s scope even after the outer function has finished executing.',
    code: `// Factory function demonstrating a closure
function createCounter(initialValue = 0) {
  let count = initialValue; // Private lexical variable

  return {
    increment: () => {
      count += 1;
      return count;
    },
    decrement: () => {
      count -= 1;
      return count;
    },
    getCount: () => count,
  };
}

const counterA = createCounter(10);
console.log(counterA.increment()); // 11
console.log(counterA.increment()); // 12
console.log(counterA.getCount());  // 12`,
    assessment: {
      question: 'Why does counterA remember the value of `count` across invocations?',
      options: [
        '`count` is a global variable accessible by all functions.',
        'The returned methods retain a reference to their enclosing lexical scope via closure.',
        'JavaScript automatically caches function return values on the window object.',
        'The variable is stored in the browser LocalStorage.',
      ],
      correctIndex: 1,
      explanation:
        'When `createCounter` executes, it creates a lexical environment. The returned object methods maintain a persistent reference to that environment on the heap.',
    },
  },
  {
    id: 'event-loop',
    title: '2. Event Loop & Microtasks',
    subtitle: 'Call Stack, Microtasks (Promises) & Macrotasks (Timers)',
    description:
      'JavaScript is single-threaded. The event loop continuously monitors the Call Stack, the Microtask Queue (Promises, queueMicrotask), and the Macrotask Queue (setTimeout, I/O). Microtasks have higher priority and run immediately after the current synchronous script completes.',
    code: `console.log("1. Synchronous START");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout 0ms)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise .then)");
});

console.log("2. Synchronous END");`,
    assessment: {
      question: 'What is the exact execution output order of the code snippet?',
      options: [
        '1, 4, 3, 2',
        '1, 2, 4, 3',
        '1, 2, 3, 4',
        '3, 1, 2, 4',
      ],
      correctIndex: 2,
      explanation:
        'Synchronous logs (1 & 2) finish first. Then the microtask queue is drained (3). Finally, the event loop picks the macrotask from the timers queue (4).',
    },
  },
  {
    id: 'hoisting',
    title: '3. Hoisting & Temporal Dead Zone',
    subtitle: 'var vs let/const & Function Declarations',
    description:
      'During the compilation phase, variable and function declarations are put into memory. `var` is hoisted and initialized to `undefined`. `let` and `const` are hoisted into the Temporal Dead Zone (TDZ) and throw a ReferenceError if accessed before declaration.',
    code: `// 1. var hoisting
console.log("var hoist:", typeof score); // undefined
var score = 100;

// 2. Function declaration hoisting
console.log("greet():", greet("Developer")); // Works!
function greet(name) {
  return "Hello, " + name;
}

// 3. Temporal Dead Zone (TDZ)
try {
  console.log(level); // ReferenceError: Cannot access 'level' before initialization
} catch (e) {
  console.log("TDZ Caught:", e.message);
}
let level = 5;`,
    assessment: {
      question: 'What occurs when accessing a `let` variable before its line of declaration?',
      options: [
        'Returns `undefined` like `var`.',
        'Throws a `ReferenceError` because it exists in the Temporal Dead Zone (TDZ).',
        'Returns `null`.',
        'Creates an empty string variable.',
      ],
      correctIndex: 1,
      explanation:
        '`let` and `const` are hoisted, but uninitialized. Accessing them between the start of the block and the declaration produces a ReferenceError.',
    },
  },
  {
    id: 'promises-callbacks',
    title: '4. Callbacks vs Promises vs Async/Await',
    subtitle: 'Evolution of Asynchronous Flow Control',
    description:
      'Callbacks frequently lead to nested "Callback Hell" and fragile error propagation. ES6 Promises provide chainable `.then()` and `.catch()` handlers. ES2017 `async`/`await` offers synchronous-style syntax over Promises with clean `try/catch` error handling.',
    code: `// Simulated async API call
const fetchUserData = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId) resolve({ id: userId, name: "Alex Chen", role: "Engineer" });
      else reject(new Error("Invalid User ID"));
    }, 400);
  });
};

// Async / Await consumption with try/catch
async function runAsyncWorkflow() {
  try {
    console.log("Fetching student profile...");
    const user = await fetchUserData("usr-1");
    console.log("Success:", user.name, "-", user.role);
  } catch (err) {
    console.error("Workflow failed:", err.message);
  }
}

runAsyncWorkflow();`,
    assessment: {
      question: 'What is the primary benefit of `async`/`await` over nested callback functions?',
      options: [
        'It makes asynchronous code execute in parallel on multi-core threads.',
        'It converts asynchronous code into purely synchronous blocking execution.',
        'It flattens deeply nested control flow and enables standard `try/catch` error handling.',
        'It eliminates the need for JavaScript Promises entirely.',
      ],
      correctIndex: 2,
      explanation:
        '`async`/`await` is syntactic sugar over Promises. It flattens the pyramid of doom (callback hell) and permits unified try/catch error management.',
    },
  },
];

export default function LearnConceptsPage() {
  const [activeTab, setActiveTab] = useState('closures');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Closure interactive counter state
  const [closureCount, setClosureCount] = useState(10);
  const [closureHistory, setClosureHistory] = useState(['Counter initialized with 10']);

  // Assessment question state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  const currentModule = MODULES.find((m) => m.id === activeTab) || MODULES[0];

  const handleTabChange = (id) => {
    setActiveTab(id);
    setConsoleOutput('');
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('Executing in sandboxed environment...\n');

    setTimeout(() => {
      if (activeTab === 'closures') {
        setConsoleOutput(
          `[LOG]: 11\n[LOG]: 12\n[LOG]: 12\n\n>> Output verified: count retained in closure environment.`
        );
      } else if (activeTab === 'event-loop') {
        setConsoleOutput(
          `[LOG]: 1. Synchronous START\n[LOG]: 2. Synchronous END\n[LOG]: 3. Microtask (Promise .then)\n[LOG]: 4. Macrotask (setTimeout 0ms)\n\n>> Call stack cleared -> Microtask queue drained -> Timer macrotask evaluated.`
        );
      } else if (activeTab === 'hoisting') {
        setConsoleOutput(
          `[LOG]: var hoist: undefined\n[LOG]: greet(): Hello, Developer\n[LOG]: TDZ Caught: Cannot access 'level' before initialization\n\n>> Demonstrated hoisting differences across var, function, and let.`
        );
      } else if (activeTab === 'promises-callbacks') {
        setConsoleOutput(
          `[LOG]: Fetching student profile...\n[LOG]: Success: Alex Chen - Engineer\n\n>> Resolved Promise via async/await with zero nesting.`
        );
      }
      setIsRunning(false);
    }, 450);
  };

  // Interactive closure counter actions
  const incrementClosure = () => {
    setClosureCount((prev) => {
      const next = prev + 1;
      setClosureHistory((h) => [`increment() invoked -> count is now ${next}`, ...h.slice(0, 4)]);
      return next;
    });
  };

  const decrementClosure = () => {
    setClosureCount((prev) => {
      const next = prev - 1;
      setClosureHistory((h) => [`decrement() invoked -> count is now ${next}`, ...h.slice(0, 4)]);
      return next;
    });
  };

  const resetClosure = () => {
    setClosureCount(10);
    setClosureHistory(['Counter reset to initial value 10']);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            Interactive CS Lab
          </Badge>
          <span className="text-xs text-text-muted">4 Core Modules</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-text-primary mt-1">
          JavaScript & Full-Stack Learning Lab
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Execute and inspect runtime behavior for Closures, Event Loop mechanics, Hoisting, and Asynchronous Flow Control.
        </p>
      </div>

      {/* Module Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        {MODULES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => handleTabChange(mod.id)}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium transition ${
              activeTab === mod.id
                ? 'bg-primary text-white shadow-sm'
                : 'border border-border bg-card text-text-secondary hover:bg-zinc-800 hover:text-text-primary'
            }`}
          >
            {mod.title}
          </button>
        ))}
      </div>

      {/* Active Module View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Concept Explanation & Code Box */}
        <div className="lg:col-span-7 space-y-5">
          {/* Theory Card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h2 className="text-base font-bold text-text-primary">{currentModule.title}</h2>
            <p className="text-xs font-medium text-primary-light">{currentModule.subtitle}</p>
            <p className="text-xs text-text-secondary leading-relaxed pt-1">
              {currentModule.description}
            </p>
          </div>

          {/* Interactive Closure Counter Demo (Specific to Closures module) */}
          {activeTab === 'closures' && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-text-primary">
                    Live Closure State Demonstration
                  </h3>
                  <p className="text-[11px] text-text-muted">
                    This counter retains private lexical state across executions.
                  </p>
                </div>
                <div className="rounded-xl border border-primary/40 bg-zinc-900 px-4 py-2 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted block">Count</span>
                  <span className="text-xl font-mono font-bold text-primary-light">
                    {closureCount}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={incrementClosure}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
                >
                  increment()
                </button>
                <button
                  onClick={decrementClosure}
                  className="rounded-lg border border-border bg-zinc-900 px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-zinc-800"
                >
                  decrement()
                </button>
                <button
                  onClick={resetClosure}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-text-muted hover:text-text-primary"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="rounded-lg bg-zinc-950 p-2.5 text-[11px] font-mono text-zinc-400 space-y-1">
                {closureHistory.map((h, i) => (
                  <div key={i} className="truncate">
                    &gt; {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Example Card */}
          <div className="rounded-xl border border-border bg-zinc-950 overflow-hidden shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
              <span className="flex items-center gap-2 text-xs font-mono text-text-secondary">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                code-example.js
              </span>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500 transition active:scale-95 disabled:opacity-50"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Example'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
              <code>{currentModule.code}</code>
            </pre>
          </div>
        </div>

        {/* Right Column: Simulated Terminal & Assessment */}
        <div className="lg:col-span-5 space-y-5">
          {/* Terminal Console Output */}
          <div className="rounded-xl border border-border bg-zinc-950 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2">
              <span className="flex items-center gap-2 text-xs font-mono text-text-muted">
                <Terminal className="h-3.5 w-3.5" />
                Console Output
              </span>
              {consoleOutput && (
                <button
                  onClick={() => setConsoleOutput('')}
                  className="text-[11px] text-text-muted hover:text-text-primary"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="p-4 min-h-[160px] font-mono text-xs text-emerald-400 whitespace-pre-wrap">
              {consoleOutput || (
                <span className="text-zinc-600">
                  Click "Run Example" to evaluate code and stream outputs here...
                </span>
              )}
            </div>
          </div>

          {/* Self-Assessment Quiz */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <HelpCircle className="h-4 w-4 text-secondary" />
              <h3 className="text-xs font-semibold text-text-primary">Concept Check</h3>
            </div>

            <p className="text-xs font-medium text-text-primary leading-relaxed">
              {currentModule.assessment.question}
            </p>

            <div className="space-y-2">
              {currentModule.assessment.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentModule.assessment.correctIndex;

                let optionStyle = 'border-border bg-zinc-900/50 hover:bg-zinc-800 text-text-secondary';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-primary bg-primary/10 text-primary-light font-medium';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!isAnswerSubmitted) setSelectedAnswer(idx);
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-lg border p-3 text-left text-xs transition ${optionStyle}`}
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-[10px]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {!isAnswerSubmitted ? (
              <button
                disabled={selectedAnswer === null}
                onClick={() => setIsAnswerSubmitted(true)}
                className="w-full rounded-lg bg-primary py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <div
                  className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs ${
                    selectedAnswer === currentModule.assessment.correctIndex
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  }`}
                >
                  {selectedAnswer === currentModule.assessment.correctIndex ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                  )}
                  <p>{currentModule.assessment.explanation}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAnswer(null);
                    setIsAnswerSubmitted(false);
                  }}
                  className="w-full rounded-lg border border-border bg-zinc-900 py-1.5 text-xs text-text-secondary hover:bg-zinc-800"
                >
                  Retry Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
