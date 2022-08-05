#!/bin/bash

kubectl delete -f k8s/

sleep 1

kubectl apply -f k8s/
