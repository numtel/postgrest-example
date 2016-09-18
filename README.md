## Common shell commands

```sh
# Start services
docker-compose up

# Restart and rebuild frontend server
docker-compose stop frontend && docker-compose build frontend && docker-compose up -d frontend

# Login to psql client
psql -h localhost -U postgrest test
```
