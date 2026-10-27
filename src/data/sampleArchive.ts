import { ProjectAutopsyData } from '../types/archive';

export const SAMPLE_CASE_STUDY: ProjectAutopsyData = {
  projectName: 'HyperFlow Engine',
  tagline: 'High-throughput reactive DAG pipeline for real-time edge telemetry',
  repositoryUrl: 'https://github.com/archive-vault/hyperflow-engine',
  primaryLanguage: 'Rust / TypeScript',
  detectedLicense: 'Apache-2.0 License',
  licenseSourceFile: 'LICENSE-APACHE (Detected in repository root)',
  analysisDate: '2026-10-24 16:42 UTC',
  isPreloadedSample: true,
  modelIdentifierUsed: 'Gemma 2 9B (Precomputed Archeological Case Study)',

  purposeSummary: 'HyperFlow was designed as a zero-copy asynchronous directed acyclic graph (DAG) scheduler built to ingest, transform, and aggregate high-velocity sensor streams on edge hardware with strict sub-millisecond p99 latency targets.',
  intendedAudience: 'Distributed systems engineers, IoT gateway developers, and telemetry data pipeline maintainers needing low-memory stream processing.',
  techStack: ['Rust (Core Engine)', 'Tokio 0.2 async runtime', 'TypeScript (Dashboard Client)', 'Crossbeam-channel', 'FlatBuffers serialization'],
  architectureOverview: 'A master worker pool managing node task executors connected via lock-free ring buffers. Node stages communicate through ring-buffer channels with planned adaptive backpressure algorithms.',
  whyAbandonedAnalysis: 'Commit momentum halted abruptly in mid-2024 following the merged PR #42 ("Initial RingBuffer abstraction"). The primary maintainer relocated to a proprietary infrastructure team, leaving the adaptive backpressure module 60% complete with failing integration tests on Tokio 0.2-to-1.0 migration.',

  findings: [
    {
      id: 'f-1',
      title: 'Adaptive Backpressure Ring Buffer Dropped Mid-Implementation',
      category: 'unfinished_feature',
      evidenceType: 'verified',
      explanation: 'The backpressure controller specifies a dynamic hysteresis threshold, but the actual rate limiter method `throttle_upstream` contains an explicit unwrap and panic stub rather than returning a backoff backpressure signal.',
      confidenceScore: 0.98,
      confidenceExplanation: 'Verified directly in source file src/engine/backpressure.rs lines 142–158. The function body is stubbed with a panic message.',
      evidence: {
        filename: 'src/engine/backpressure.rs',
        lineStart: 142,
        lineEnd: 158,
        codeSnippet: `pub fn throttle_upstream(&mut self, node_id: NodeId, watermark: HighWatermark) -> Result<BackpressureSignal, FlowError> {
    // TODO(maintainer): finish credit-based flow control protocol
    // Currently will cause cascade thread panic under high volume!
    if watermark.saturation_ratio() > 0.85 {
        log::warn!("Watermark breached for node {:?}", node_id);
        // FIXME: Replace with token bucket return
        todo!("Implement dynamic token decrement handshake");
    }
    Ok(BackpressureSignal::Continue)
}`,
        contextDescription: 'Defines how upstream producer nodes should be slowed when ring buffer saturation breaches 85%.',
        uncertaintyNotes: 'Evidence proves the method is incomplete; whether downstream consumers were designed for lossy or lossless shedding remains an open design question.'
      }
    },
    {
      id: 'f-2',
      title: 'Deadlock Vulnerability in Tokio 0.2 Legacy Async Mutex Pin',
      category: 'security_risk',
      evidenceType: 'verified',
      explanation: 'The project Cargo.toml pins the legacy `tokio = "0.2.22"`. In `src/dispatcher/pool.rs`, a synchronous std::sync::Mutex is held across an async await boundary, known to trigger worker thread starvation.',
      confidenceScore: 0.95,
      confidenceExplanation: 'Direct source inspection confirms std::sync::Mutex held during executor await inside async fn dispatch_task.',
      evidence: {
        filename: 'src/dispatcher/pool.rs',
        lineStart: 88,
        lineEnd: 104,
        codeSnippet: `pub async fn dispatch_task(&self, task: TaskEnvelope) -> DispatchResult {
    let mut lock = self.active_nodes.lock().unwrap(); // STD MUTEX HELD
    let executor = lock.get_mut(&task.target_node).ok_or(FlowError::NodeNotFound)?;
    
    // BUG: Await point holding std synchronous mutex blocks OS thread!
    let ack = executor.process_frame(task.payload).await?;
    lock.update_heartbeat(task.target_node);
    Ok(ack)
}`,
        contextDescription: 'Task dispatcher worker pool managing active DAG node handles.',
        uncertaintyNotes: 'Under light load (single thread) this passed unit tests, which explains why the maintainer likely did not notice the hang before abandon.'
      }
    },
    {
      id: 'f-3',
      title: 'Inferred Intention for Distributed Multi-Node Clustering',
      category: 'architecture',
      evidenceType: 'interpretation',
      explanation: 'The README mentions only "Single-node high throughput", but internal proto schemas in `proto/cluster.proto` and dangling structs in `src/cluster/raft_stub.rs` suggest the author intended to evolve HyperFlow into a Raft-replicated cluster before shelving.',
      confidenceScore: 0.82,
      confidenceExplanation: 'Extracted from presence of proto/cluster.proto containing RaftRPC message schemas, coupled with an empty src/cluster/ directory with uncompiled modules.',
      evidence: {
        filename: 'proto/cluster.proto',
        lineStart: 12,
        lineEnd: 29,
        codeSnippet: `syntax = "proto3";
package hyperflow.cluster;

message AppendEntriesRequest {
  uint64 term = 1;
  string leader_id = 2;
  uint64 prev_log_index = 3;
  uint64 prev_log_term = 4;
  repeated bytes entries = 5;
  uint64 leader_commit = 6;
}

// NOTE: Not yet wired to src/main.rs`,
        contextDescription: 'Protobuf definition for consensus messages between cluster peers.',
        uncertaintyNotes: 'The code does not indicate whether distributed replication was intended for data partitions or merely control-plane metadata.'
      }
    },
    {
      id: 'f-4',
      title: 'Outdated Benchmark Claims in README with Zero Reproducible Fixtures',
      category: 'missing_docs',
      evidenceType: 'verified',
      explanation: 'The README claims "Over 4.2 Million events/sec with zero allocations", but the `benches/` directory only contains a single mocked micro-benchmark running on synthetic loopback with 1KB payloads and no contention.',
      confidenceScore: 0.90,
      confidenceExplanation: 'Verified by comparing README claim against benches/bench_throughput.rs test code.',
      evidence: {
        filename: 'benches/bench_throughput.rs',
        lineStart: 31,
        lineEnd: 46,
        codeSnippet: `fn bench_synthetic_ring(c: &mut Criterion) {
    let mut ring = RingBuffer::with_capacity(1024);
    c.bench_function("raw_ring_push_pop", |b| {
        // Warning: This tests in-memory push without Tokio scheduling overhead
        b.iter(|| {
            ring.push(black_box(42));
            ring.pop();
        })
    });
}`,
        contextDescription: 'Criterion benchmark suite in benches/ directory.',
        uncertaintyNotes: 'The hardware on which the 4.2M/sec number was measured is never specified in the commit log or docs.'
      }
    },
    {
      id: 'f-5',
      title: 'Unreferenced TypeScript Dashboard Protocol in web/ Package',
      category: 'dead_code',
      evidenceType: 'interpretation',
      explanation: 'The `web/` subfolder contains a React+Vite canvas UI that listens on port 9002 for WebSocket metrics, but the Rust server has no WebSocket server initialized in its entrypoint.',
      confidenceScore: 0.78,
      confidenceExplanation: 'Inferred from matching message types in web/src/types.ts and Rust telemetry events, but missing ws::bind in src/main.rs.',
      evidence: {
        filename: 'src/main.rs',
        lineStart: 64,
        lineEnd: 74,
        codeSnippet: `// TODO: Start embedded warp/axum telemetry server on port 9002
// let ws_server = telemetry::serve_metrics(9002);
// tokio::spawn(ws_server);

log::info!("HyperFlow engine started (headless mode)");`,
        contextDescription: 'Server startup sequence in src/main.rs.',
        uncertaintyNotes: 'It is possible the maintainer ran telemetry out-of-process via a sidecar exporter, but no config files verify this.'
      }
    },
    {
      id: 'f-6',
      title: 'Unknown Deployment Target & Hardware Memory Caps',
      category: 'architecture',
      evidenceType: 'unknown',
      explanation: 'While the comments cite "embedded and edge hardware", no cross-compilation Dockerfile, target triplet (.cargo/config), or explicit RAM constraints exist in the repository.',
      confidenceScore: 0.40,
      confidenceExplanation: 'Absence of target configuration files. We cannot determine whether target was ARM Cortex-A Linux, Raspberry Pi, or x86 edge servers.',
      evidence: {
        filename: 'Cargo.toml',
        lineStart: 1,
        lineEnd: 15,
        codeSnippet: `[package]
name = "hyperflow"
version = "0.3.1"
edition = "2021"

[dependencies]
tokio = { version = "0.2.22", features = ["full"] }
crossbeam-channel = "0.5"
log = "0.4"
env_logger = "0.9"`,
        contextDescription: 'Project root manifest file.',
        uncertaintyNotes: 'No CI workflow file exists in .github/workflows to confirm target architecture.'
      }
    }
  ],

  timeline: [
    {
      id: 't-1',
      title: 'Initial Architecture & RingBuffer Abstraction',
      description: 'Repository initialized with lock-free atomic pointer queue and baseline node trait.',
      dateStr: '2023-09-14',
      commitHash: 'a718f4c',
      isAiInferred: false,
      evidenceReference: 'git log commit a718f4c2918 ("feat: core ring buffer data structure")',
      category: 'commit'
    },
    {
      id: 't-2',
      title: 'Release v0.2.0: Multi-stage Pipeline Support',
      description: 'Added support for fan-out and fan-in DAG topologies with Tokio 0.2 async runner.',
      dateStr: '2023-11-28',
      commitHash: 'e39b201',
      isAiInferred: false,
      evidenceReference: 'git tag v0.2.0 with release notes in CHANGELOG.md',
      category: 'release'
    },
    {
      id: 't-3',
      title: 'Backpressure Experimentation Branch Created',
      description: 'Branch feat/adaptive-backpressure created to prevent buffer overflows under 100k msg/s bursts.',
      dateStr: '2024-02-10',
      commitHash: '7c89012',
      isAiInferred: false,
      evidenceReference: 'git branch ref tracking in .git/refs/heads/feat/adaptive-backpressure',
      category: 'ghost_branch'
    },
    {
      id: 't-4',
      title: 'Maintainer Strategic Pivot toward Raft Clustering',
      description: 'AI Inferred: The commit history diverges here. Rather than completing backpressure, maintainer began drafting cluster.proto specs, suggesting an ambition pivot toward distributed orchestration.',
      dateStr: '2024-04-18',
      isAiInferred: true,
      uncertaintyLabel: 'AI Interpretation — Inferred from timestamp correlation of unmerged proto files',
      evidenceReference: 'Correlated commit message "draft cluster proto" with stagnation on backpressure.rs',
      category: 'inferred_pivot'
    },
    {
      id: 't-5',
      title: 'Final Commit & Sudden Repository Freeze',
      description: 'Commit message: "WIP: fix borrow checker in throttle_upstream (will revisit weekend)". No further commits occurred.',
      dateStr: '2024-05-02',
      commitHash: 'f419c8d',
      isAiInferred: false,
      evidenceReference: 'git log HEAD commit f419c8d32b1 ("WIP: fix borrow checker in throttle_upstream")',
      category: 'abandonment'
    }
  ],

  graphNodes: [
    { id: 'n-core', label: 'RingBuffer Engine', type: 'module', status: 'verified', description: 'Zero-copy lock-free ring buffer queue.', filename: 'src/engine/ring.rs', x: 280, y: 150 },
    { id: 'n-backpressure', label: 'Adaptive Backpressure', type: 'feature', status: 'incomplete', description: 'Hysteresis watermark rate limiter (Contains unwrap panic).', filename: 'src/engine/backpressure.rs', x: 520, y: 140 },
    { id: 'n-dispatcher', label: 'Task Dispatcher Pool', type: 'module', status: 'verified', description: 'Worker thread pool managing DAG node handles.', filename: 'src/dispatcher/pool.rs', x: 280, y: 290 },
    { id: 'n-tokio', label: 'Tokio 0.2 Dependency', type: 'dependency', status: 'blocked', description: 'Outdated async runtime causing mutex deadlock risk.', filename: 'Cargo.toml', x: 100, y: 280 },
    { id: 'n-raft', label: 'Raft Consensus Stub', type: 'proposal', status: 'uncertain', description: 'Unwired cluster replication protocol definitions.', filename: 'proto/cluster.proto', x: 680, y: 260 },
    { id: 'n-dashboard', label: 'Telemetry Web UI', type: 'doc', status: 'incomplete', description: 'Orphaned React dashboard without bound WebSocket listener.', filename: 'web/src/App.tsx', x: 500, y: 390 },
    { id: 'n-bench', label: 'Synthetic Benchmark', type: 'file', status: 'uncertain', description: 'Micro-benchmark measuring loopback instead of live concurrency.', filename: 'benches/bench_throughput.rs', x: 140, y: 140 }
  ],

  graphEdges: [
    { id: 'e-1', source: 'n-core', target: 'n-backpressure', label: 'feeds into', relationType: 'intends' },
    { id: 'e-2', source: 'n-dispatcher', target: 'n-core', label: 'orchestrates', relationType: 'imports' },
    { id: 'e-3', source: 'n-tokio', target: 'n-dispatcher', label: 'blocks upgrade', relationType: 'blocks' },
    { id: 'e-4', source: 'n-backpressure', target: 'n-raft', label: 'intended replication', relationType: 'intends' },
    { id: 'e-5', source: 'n-dispatcher', target: 'n-dashboard', label: 'metrics hook', relationType: 'intends' }
  ],

  revivalTasks: [
    {
      id: 'task-1',
      title: 'Upgrade Runtime to Tokio 1.x & Eliminate std::sync::Mutex across Await',
      category: 'fix_first',
      priority: 'P0',
      reason: 'The current code holds a synchronous blocking mutex across an async await point, causing worker thread hangs under real network traffic.',
      supportingEvidence: 'src/dispatcher/pool.rs line 88 & Cargo.toml line 7.',
      suggestedSteps: [
        'Update Cargo.toml to tokio = { version = "1.38", features = ["full"] }',
        'Replace std::sync::Mutex with tokio::sync::Mutex or RwLock',
        'Refactor dispatch_task so the lock guard is dropped before calling executor.process_frame().await'
      ],
      expectedOutcome: 'Zero thread starvation and compatibility with modern Rust async ecosystem.',
      acceptanceCriteria: [
        'cargo check passes on Rust stable 1.78+',
        'Integration test simulates 100 concurrent task dispatches without blocking thread pool'
      ],
      estimatedDifficulty: 'Moderate',
      dependencies: ['Cargo.toml', 'src/dispatcher/pool.rs'],
      status: 'pending'
    },
    {
      id: 'task-2',
      title: 'Complete Dynamic Token-Bucket Backpressure in throttle_upstream',
      category: 'complete_feature',
      priority: 'P0',
      reason: 'Breaching 85% buffer capacity currently invokes todo!() which crashes the entire pipeline.',
      supportingEvidence: 'src/engine/backpressure.rs line 148',
      suggestedSteps: [
        'Remove todo!() macro call in throttle_upstream',
        'Implement an exponential backoff pause duration based on watermark ratio',
        'Return BackpressureSignal::Throttle(Duration::from_millis(backoff_ms)) to producer'
      ],
      expectedOutcome: 'Upstream producers smoothly throttle rather than inducing panic crashes.',
      acceptanceCriteria: [
        'Unit test pushes 200% burst volume into ring buffer and verifies backpressure signal without panic'
      ],
      estimatedDifficulty: 'Moderate',
      dependencies: ['src/engine/backpressure.rs'],
      status: 'pending'
    },
    {
      id: 'task-3',
      title: 'Wire Embedded WebSocket Telemetry Server to Main Entrypoint',
      category: 'complete_feature',
      priority: 'P1',
      reason: 'The web/ dashboard cannot display metrics because the backend WebSocket server initialization was commented out.',
      supportingEvidence: 'src/main.rs lines 64-67 & web/src/types.ts',
      suggestedSteps: [
        'Uncomment the telemetry server initialization in src/main.rs',
        'Implement broadcast channel sending NodeStats snapshots every 500ms',
        'Verify web dashboard connects to ws://localhost:9002/telemetry'
      ],
      expectedOutcome: 'Live visual monitoring of ring buffer saturation and task execution latency.',
      acceptanceCriteria: [
        'Running cargo run -- --telemetry-port 9002 streams valid JSON packets to browser'
      ],
      estimatedDifficulty: 'Easy',
      dependencies: ['src/main.rs', 'web/'],
      status: 'pending'
    },
    {
      id: 'task-4',
      title: 'Add Realistic Multi-Threaded Contention Benchmarks',
      category: 'add_tests',
      priority: 'P1',
      reason: 'The current 4.2M/sec claim comes from single-threaded synthetic loopback with no real Tokio concurrency.',
      supportingEvidence: 'benches/bench_throughput.rs line 31',
      suggestedSteps: [
        'Create benches/bench_concurrent_dag.rs with Criterion',
        'Simulate 8 producer threads and 16 worker consumer tasks',
        'Measure latency percentiles (p50, p95, p99) under sustained 100k events/sec'
      ],
      expectedOutcome: 'Honest, verifiable performance baseline published to repository README.',
      acceptanceCriteria: [
        'Benchmark runs via cargo bench --bench bench_concurrent_dag with repeatable variance < 5%'
      ],
      estimatedDifficulty: 'Complex',
      dependencies: ['benches/'],
      status: 'pending'
    },
    {
      id: 'task-5',
      title: 'Clarify Architecture Boundary & Archive Unused Raft Protobufs',
      category: 'improve_architecture',
      priority: 'P2',
      reason: 'Dangling proto/cluster.proto confuses new contributors by implying clustering is operational when only single-node runs.',
      supportingEvidence: 'proto/cluster.proto lines 12–29',
      suggestedSteps: [
        'Move proto/cluster.proto into docs/rfcs/0001-distributed-clustering.md',
        'Document the RFC status as "Proposed / Suspended"',
        'Update README Architecture section with clear Single-Node Scope statement'
      ],
      expectedOutcome: 'Clear boundaries for contributors without false expectations of distributed consensus.',
      acceptanceCriteria: [
        'README explicitly distinguishes core single-node runtime from planned distributed RFC'
      ],
      estimatedDifficulty: 'Easy',
      status: 'pending'
    },
    {
      id: 'task-6',
      title: 'Provide Quickstart Docker Compose Environment for Contributors',
      category: 'good_first_issue',
      priority: 'P2',
      reason: 'Zero deployment files exist in the repo, creating high friction for prospective open-source contributors.',
      supportingEvidence: 'Absence of Dockerfile or container configuration in repository root',
      suggestedSteps: [
        'Create multi-stage Dockerfile compiling Rust engine with cargo-chef caching',
        'Create docker-compose.yml launching engine and web dashboard together',
        'Add a one-line curl | bash testing script in docs/quickstart.md'
      ],
      expectedOutcome: 'New contributors can run the entire pipeline in under 2 minutes.',
      acceptanceCriteria: [
        'docker compose up successfully boots engine and web UI with zero host dependencies'
      ],
      estimatedDifficulty: 'Easy',
      status: 'pending'
    }
  ]
};
