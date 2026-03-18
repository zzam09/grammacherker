# Grammar Check Backend

A Deno-based backend service for grammar checking using JavaScript.

## Getting Started

### Prerequisites
- Deno runtime installed on your system

### Running the server

1. Start the development server:
```bash
deno task dev
```

2. Or run directly:
```bash
deno run --allow-net --allow-env src/main.js
```

The server will start on `http://localhost:8000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Grammar Check
- **POST** `/api/check`
- Request body: `{ "text": "Your text to check" }`
- Returns grammar suggestions and corrections

Example response:
```json
{
  "original": "your text",
  "suggestions": [
    {
      "type": "capitalization",
      "message": "Sentence should start with capital letter",
      "suggestion": "Capitalize the first letter"
    }
  ],
  "corrected": "Your text",
  "score": 90
}
```

## Development

The project uses Deno tasks defined in `deno.json`:
- `deno task dev` - Start with file watching
- `deno task start` - Start normally

## CORS

The API includes CORS headers to allow frontend integration.
