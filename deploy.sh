#!/bin/bash

# A simple script to automate pushing changes to GitHub

# Check if the user provided a commit message
if [ -z "$1" ]
then
  echo "Error: No commit message provided."
  echo "Usage: ./deploy.sh \"Your commit message here\""
  exit 1
fi

# Add all changes to staging
git add .

# Commit the changes with the provided message
git commit -m "$1"

# Push the changes to the main branch on GitHub
git push origin main

# Provide feedback to the user
echo "Changes have been pushed to GitHub successfully."
