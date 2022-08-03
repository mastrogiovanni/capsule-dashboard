# README

This is a PoC for a [Capsule](https://github.com/clastix/capsule) dashboard.

# Install

Install the dashboard with the following:

```
kubectl apply -f k8s/
```

Open connection to the frontend on the port 8080:

```
kubectl port-forward svc/capsule-dashboard-service 8080:80
```

Visit the URL: `http://localhost:8080`

