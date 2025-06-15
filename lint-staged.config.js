module.exports = {
  "frontend/**/*.{js,jsx,ts,tsx}": [
    "sh -c 'cd frontend && npx eslint \"$@\"' --",
    "sh -c 'cd frontend && npx prettier --write \"$@\"' --"
  ],
  "backend/**/*.{js,jsx,ts,tsx}": [
    "sh -c 'cd backend && npx eslint \"$@\"' --",
    "sh -c 'cd backend && npx prettier --write \"$@\"' --"
  ]
};
