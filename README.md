# Plugin form playground
[Live Demo](https://2eha0.github.io/learn-jsonforms/)

### For local development
```
pnpm i
pnpm dev
```

### Update schemas
1. Start the Kong Gateway service
```shell
GW_IMAGE=kong/kong-gateway-dev:master docker compose -f ./kong-gateway.yml up -d
```
2. Run
```shell
pnpm run exec
```
