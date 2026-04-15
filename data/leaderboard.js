window.LONG_BENCH_CONFIG = {
  localRowsKey: "longbench_local_rows_v1",
  submissionsKey: "longbench_submissions_v1"
};

window.LONG_BENCH_TASK_GROUPS = [
  {
    key: "contextIndependent",
    label: "Context-Independent",
    averageKey: "contextIndependentAverage",
    tasks: [
      { key: "wasteSorting", label: "Waste Sorting", capabilities: ["IP"] },
      { key: "threadRope", label: "Thread Rope", capabilities: ["PD", "IP", "EA"] },
      { key: "pullDrawer", label: "Pull Drawer", capabilities: ["PD", "IP"] },
      { key: "stackBlock", label: "Stack Block", capabilities: ["PD", "IP", "EA"] },
      { key: "dynamicGrasping", label: "Dynamic Grasping", capabilities: ["PD", "TW"] }
    ],
    capabilities: [
      { key: "PD", label: "PD" },
      { key: "IP", label: "IP" },
      { key: "EA", label: "EA" },
      { key: "TW", label: "TW" }
    ]
  },
  {
    key: "contextDependent",
    label: "Context-Dependent",
    averageKey: "contextDependentAverage",
    tasks: [
      { key: "vaseSticks", label: "Vase Sticks", capabilities: ["CP", "CE"] },
      { key: "wipePlate", label: "Wipe Plate", capabilities: ["CT"] },
      { key: "repeatPlacement", label: "Repeat Placement", capabilities: ["CP", "CT"] },
      { key: "swapBlocks", label: "Swap Blocks", capabilities: ["SB"] },
      { key: "hideBlock", label: "Hide Block", capabilities: ["CP", "SB", "CE"] }
    ],
    capabilities: [
      { key: "CP", label: "CP" },
      { key: "CT", label: "CT" },
      { key: "SB", label: "SB" },
      { key: "CE", label: "CE" }
    ]
  }
];

window.LONG_BENCH_OFFICIAL_RESULTS = [
  {
    id: "official-pi0",
    policyName: "pi0",
    contextIndependentAverage: 86.3,
    contextDependentAverage: 37.3,
    average: 61.829,
    openSource: "Yes",
    sourceLabel: "Official",
    locked: true,
    updatedAt: "2026-03-07T00:00:00.000Z",
    scores: {
      wasteSorting: 100.0,
      threadRope: 72.0,
      pullDrawer: 95.0,
      stackBlock: 91.3,
      dynamicGrasping: 73.3,
      vaseSticks: 60.0,
      wipePlate: 65.0,
      repeatPlacement: 38.8,
      swapBlocks: 23.0,
      hideBlock: 0.0
    }
  },
  {
    id: "official-openvla-oft",
    policyName: "openvla-oft",
    contextIndependentAverage: 32.7,
    contextDependentAverage: 16.6,
    average: 24.634,
    openSource: "Yes",
    sourceLabel: "Official",
    locked: true,
    updatedAt: "2026-03-07T00:00:00.000Z",
    scores: {
      wasteSorting: 90.0,
      threadRope: 46.0,
      pullDrawer: 17.5,
      stackBlock: 10.0,
      dynamicGrasping: 0.0,
      vaseSticks: 56.6,
      wipePlate: 2.5,
      repeatPlacement: 23.8,
      swapBlocks: 0.0,
      hideBlock: 0.0
    }
  },
  {
    id: "official-smolvla",
    policyName: "smolvla",
    contextIndependentAverage: 46.6,
    contextDependentAverage: 42.6,
    average: 44.562,
    openSource: "Yes",
    sourceLabel: "Official",
    locked: true,
    updatedAt: "2026-03-07T00:00:00.000Z",
    scores: {
      wasteSorting: 83.3,
      threadRope: 62.0,
      pullDrawer: 48.8,
      stackBlock: 28.8,
      dynamicGrasping: 10.0,
      vaseSticks: 48.3,
      wipePlate: 43.8,
      repeatPlacement: 43.8,
      swapBlocks: 22.0,
      hideBlock: 55.0
    }
  },
  {
    id: "official-dp",
    policyName: "dp",
    contextIndependentAverage: 51.2,
    contextDependentAverage: 21.2,
    average: 36.205,
    openSource: "Yes",
    sourceLabel: "Official",
    locked: true,
    updatedAt: "2026-03-07T00:00:00.000Z",
    scores: {
      wasteSorting: 91.7,
      threadRope: 30.0,
      pullDrawer: 47.5,
      stackBlock: 73.8,
      dynamicGrasping: 13.3,
      vaseSticks: 16.6,
      wipePlate: 68.8,
      repeatPlacement: 7.5,
      swapBlocks: 9.0,
      hideBlock: 4.0
    }
  },
  {
    id: "official-memvla",
    policyName: "memvla",
    contextIndependentAverage: 49.1,
    contextDependentAverage: 45.3,
    average: 47.222,
    openSource: "Yes",
    sourceLabel: "Official",
    locked: true,
    updatedAt: "2026-03-07T00:00:00.000Z",
    scores: {
      wasteSorting: 81.6,
      threadRope: 64.0,
      pullDrawer: 62.5,
      stackBlock: 27.5,
      dynamicGrasping: 10.0,
      vaseSticks: 56.6,
      wipePlate: 82.5,
      repeatPlacement: 27.5,
      swapBlocks: 36.0,
      hideBlock: 24.0
    }
  },
  {
    id: "official-cronusvla",
    policyName: "cronusvla",
    contextIndependentAverage: 42.4,
    contextDependentAverage: 32.8,
    average: 37.616,
    openSource: "Yes",
    sourceLabel: "Official",
    locked: true,
    updatedAt: "2026-03-07T00:00:00.000Z",
    scores: {
      wasteSorting: 86.6,
      threadRope: 56.0,
      pullDrawer: 41.2,
      stackBlock: 15.0,
      dynamicGrasping: 13.3,
      vaseSticks: 50.0,
      wipePlate: 67.5,
      repeatPlacement: 12.5,
      swapBlocks: 14.0,
      hideBlock: 20.0
    }
  }
];
