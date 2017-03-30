#!/usr/bin/env bash

set -u -e -o pipefail

# Setup environment
readonly thisDir=$(cd $(dirname $0); pwd)


# If the previous commands in the `script` section of .travis.yaml failed, then abort.
# The variable is not set in early stages of the build, so we default to 0 there.
# https://docs.travis-ci.com/user/environment-variables/
if [[ ${TRAVIS_TEST_RESULT=0} == 1 ]]; then
  echo "[ERROR]: fail because previous errors"
  exit 1;
fi


# Don't deploy if this is a PR build
if [[ ${TRAVIS_PULL_REQUEST} != "false" ]]; then
   echo "[INFO]: Skipping deploy because this is a PR build."
   exit 0
fi

if [[ ${TRAVIS_TAG} != "" ]]; then
  echo "=====> GENERATING GH-PAGES"
  echo "[INFO]: Skipping publish because this is git tag build."
  exit 0
fi

# Release a new version in npm and add to github
if [[ $TRAVIS_BRANCH != $RELEASE_BRANCH ]]; then
  echo "[INFO]: Skipping release because this isn't over $RELEASE_BRANCH branch."
  exit 0
fi

echo "********************** RELEASING NEW VERSION ***************************"

echo "=====> GENERATING NPM VERSION"
npm run semantic-release

