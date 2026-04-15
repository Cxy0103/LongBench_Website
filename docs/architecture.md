# LongBench Website Architecture

## 当前改造

这个目录已经从单个 `index.html` 拆成静态前端项目：

- `index.html`: 页面结构、提交表单和 leaderboard。
- `assets/css/styles.css`: 全站样式。
- `assets/js/app.js`: 表单提交、本地评测模拟、leaderboard 渲染和导出。
- `data/leaderboard.js`: 官方初始榜单数据。
- `docs/architecture.md`: 后续接真实服务端的接口边界。

当前仍然可以直接打开 `index.html` 运行。提交数据和模拟评测结果会保存在浏览器 `localStorage` 中。

## 推荐线上架构

真实提交文件和 leaderboard 更新不应该只靠前端完成。建议按下面边界拆：

- Frontend: 静态页面，负责表单校验、提交和榜单展示。
- API Server: 接收 multipart 表单、创建评测任务、提供 leaderboard 查询接口。
- Object Storage: 保存上传的模型文件，例如 S3、MinIO 或学校服务器目录。
- Database: 保存 submissions、evaluation jobs、leaderboard rows 和 audit logs。
- Worker: 从队列读取任务，调用 LongBench evaluation，写回分数和日志。
- Auth: 如果后续增加后台系统，再限制榜单发布、隐藏或重跑等操作。

## 数据表建议

### submissions

- `id`
- `name`
- `affiliation`
- `email`
- `api_support`
- `policy_name`
- `server_ip`
- `server_port`
- `open_source`
- `will_email`
- `notes`
- `model_file_uri`
- `status`: `queued | running | failed | completed | published`
- `created_at`
- `updated_at`

### leaderboard_rows

- `id`
- `submission_id`
- `policy_name`
- `average`
- `open_source`
- `source_label`
- `is_published`
- `created_at`
- `updated_at`

### evaluation_jobs

- `id`
- `submission_id`
- `status`
- `worker_id`
- `log_uri`
- `started_at`
- `finished_at`

## API Contract

### `POST /api/submissions`

Content type: `multipart/form-data`

Fields:

- `name`
- `affiliation`
- `email`
- `apiSupport`
- `policyName`
- `serverIp`
- `serverPort`
- `modelFile`
- `openSource`
- `willEmail`
- `notes`

Response:

```json
{
  "submissionId": "sub_123",
  "status": "queued"
}
```

### `GET /api/submissions/:id`

Response:

```json
{
  "id": "sub_123",
  "policyName": "my_policy",
  "status": "running",
  "leaderboardRowId": null
}
```

### `GET /api/leaderboard`

Response:

```json
{
  "updatedAt": "2026-04-15T00:00:00.000Z",
  "rows": [
    {
      "id": "row_123",
      "policyName": "pi0",
      "average": 61.829,
      "openSource": "Yes",
      "sourceLabel": "Official"
    }
  ]
}
```

## 前端接 API 的替换点

当前 `assets/js/app.js` 里这些函数是本地存储适配层：

- `getLocalRows`
- `saveLocalRows`
- `getSubmissions`
- `saveSubmissions`
- `handleSubmit`

接后端时，把这些函数替换为 `fetch` 调用即可。页面渲染逻辑可以保留。
