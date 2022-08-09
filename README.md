# README

This is a PoC for a [Capsule](https://github.com/clastix/capsule) dashboard.

# Run minikube

```
minikube start --nodes 1 --memory 24576 --cpus 6
```

# Install Capsule

```
helm install capsule clastix/capsule -n capsule-system --create-namespace --set manager.resources=null
```

Create a tenant:

```
kubectl create -f - << EOF
apiVersion: capsule.clastix.io/v1beta1
kind: Tenant
metadata:
  name: oil
spec:
  owners:
  - name: alice
    kind: User
EOF
```

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

