# Empty Encore TS Template

## Developing locally

When you have [installed Encore](https://encore.dev/docs/ts/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=ts/empty
```

## Running locally
```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!

## Testing

```bash
encore test
```


## Notes
curl http://localhost:4000/url -d '{"url": "https://encore.dev"}'  
{"url":"https://encore.dev","id":"FNZZoO_K"}                                                                                                                                       

curl http://localhost:4000/url/FNZZoO_K                      
{"url":"https://encore.dev","id":"FNZZoO_K"}.              

  Encore development server running!  
  Your API is running at:     http://127.0.0.1:4000   
  Development Dashboard URL:  http://127.0.0.1:9400/url-shortener-r442.   
  MCP SSE URL:                http://127.0.0.1:9900/sse?appID=url-shortener-r442. 