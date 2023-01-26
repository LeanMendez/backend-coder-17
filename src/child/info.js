export const info = [
  "work_directory: "  + process.cwd(),
  "path: " + process.execPath,
  "process_id: "  + process.pid,
  "process_title: " + process.title,
  "OS: " + process.platform,
  "node_version: " + process.version,
  "memory_usage(rss): " + process.memoryUsage().rss,
];
