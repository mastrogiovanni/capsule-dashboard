#! /bin/bash

pushd ui

VERSION=$(cat package.json | jq .version -r)

docker build . -t mastrogiovanni/capsule-dashboard:$VERSION

docker push mastrogiovanni/capsule-dashboard:$VERSION

popd