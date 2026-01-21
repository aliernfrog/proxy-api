# Proxy API
API used to proxy webhook requests from my apps such as [PF Tool](git remote add origin https://github.com/aliernfrog/pf-tool) and [LAC Tool](git remote add origin https://github.com/aliernfrog/lac-tool)

## Running
- Add following entries to `.env` file:
```
PORT=<value>
DISCORD_WEBHOOK_URL=<value>
```

- Install dependencies using `npm install`
- Run the app: `npm run start`

## Sending crash details
Do a POST request to `/crash-report` with the following JSON body:
```json
{
  "app": "App name / source name",
  "details": "Details of the crash a string, can also include other details"
}
```
This will send a message in the channel of the webhook, `app` in message content and `details` in attachment