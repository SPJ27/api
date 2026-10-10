# API

A small personal API service for the general-purpose endpoints I reuse across my web apps: fetching my Hackatime stats, calling AI models, uploading files to the Hack Club CDN, and more.

Right now only one endpoint is live. As I add endpoints that expose sensitive data, I'll restrict public usage.

## Stack

- [Next.js](https://nextjs.org/)
- [Better Auth](https://www.better-auth.com/) with GitHub sign-in
- [Tailwind CSS](https://tailwindcss.com/)

## Authentication

Generate the key at [api.sakshamjain.dev](https://api.sakshamjain.dev).
Send the key in the `x-api-key` header on every request:

```bash
curl -H "x-api-key: YOUR_API_KEY" https://api.sakshamjain.dev/api/hackatime/stats
```

Requests without a valid, unexpired key are rejected.

## Endpoints

### `GET /api/hackatime/stats`

Returns my all-time Hackatime coding stats.

**Headers**

| Header      | Required | Description  |
| ----------- | -------- | ------------ |
| `x-api-key` | * yes      | Your API key |

**Response** (languages list shortened)

```json
{
  "data": {
    "username": "spj",
    "user_id": "24056",
    "is_coding_activity_visible": true,
    "is_other_usage_visible": true,
    "status": "ok",
    "start": "2016-10-09T15:52:42Z",
    "end": "2026-10-09T23:59:59Z",
    "range": "all_time",
    "human_readable_range": "All Time",
    "total_seconds": 983821,
    "daily_average": 269,
    "human_readable_total": "273h 17m 1s",
    "human_readable_daily_average": "4m 29s",
    "languages": [
      {
        "name": "TypeScript",
        "total_seconds": 260354,
        "text": "72h 19m",
        "hours": 72,
        "minutes": 19,
        "percent": 26.46,
        "digital": "72:19:14",
        "color": "#3178c6"
      }
    ],
    "streak": 3
  },
  "trust_factor": {
    "trust_level": "blue",
    "trust_value": 0
  }
}
```

`languages` is sorted by `total_seconds` (descending) and includes every language Hackatime has tracked.

## Roadmap

- [ ] AI model access
- [ ] File uploads to the Hack Club CDN
- [ ] Restrict public access for endpoints that return sensitive data