#!/bin/bash
cd /tmp/kavia/workspace/code-generation/simple-todo-application-3772623e/todo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

