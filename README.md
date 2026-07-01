This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### cp .env.example .env.local

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## postgres

The project depends on postgres. See ./docker-compose.yml. Make sure it's up and running with `docker compose up -d`.

## Local Database Workflow

The app uses two local Postgres databases:

- `jobzard_dev` for manual development
- `jobzard_test` for automated tests

Useful commands:

- `npm run db:reset` resets the development database
- `npm run db:test:reset` resets the test database
- `npm run test:run` runs the automated test suite

---

# jobzard

An AI knowledge base for job searches and resume tailoring.

## Description

The application should let a user upload or enter resumes, cover letters, job descriptions, notes, and other job-search materials. It should become the user's knowlege base for job searching.

## Problem

Job searching can be overwhelming. The user needs guidance and help organizing her searches.

She is searching for jobs that fit her experience and skillset. She should be able to upload or enter her resume and job-search documents, such as descriptions of open positions. She should be able to search the uploaded documents from the current or past sessions. She should be able to ask questions about those documents; compare her resume to job descriptions; identify missing skills and weak matches; get help drafting cover letters; get suggestions for improving her resume; and maintain a searchable history of applications, job descriptions, and generated material.

## MVP User Stories

The user creates a resume in the app or pastes one in. Then she pastes in a job description. She clicks an Analyze Fit button and sees helpful results in a clearly laid-out UI, including a measure of how strong the fit is, missing skills, suggested resume bullet-point improvements, and risks/caveats. 

The user write part of a resume and then exits the app before completing it. When she restarts the app, she is able to continue working on the resume without having to start over. 

The user enters a resume and a job description then enters the app. When she restarts the app, she is able to see the resume and job description and click the Analyze Fit button.

A user has gotten analysis results. She can quit the app, start it up again, and see the results.

## Core Features

- A UI that allows the user to enter a resume and a job description as plain text.
- An action button that will trigger analysis. 
- Resume and description get saved to a postgres database. They get saved if the user closes out of the app. And they get saved when the user clicks the analyze button. 
- The user can also update and delete the documents--and they will get loaded back into the app on restart--so there should be the full range of CRUD operations. 
- Server side code will handle CRUD operations.
- Serve side code will handle communication with an LLM (for analysis).
- A UI will display the results of the AI analysis.
- A mock provider for tests.

NOTE: possibly if a user updates a resume or description, new record should be inserted into the DB instead of old ones being updated. That would allow for a change history and/or undos.

## Non-Goals for MVP

- Multiple resumes and job descriptions
- File uploads
- Multiple users
- Searching/filtering
- cover letter upload and help
- full end-to-end tests
- Token/cost logging
- Authentication
- Full application history
- Hosted deployment
- User notes

## Future AI/RAG Direction

The MVP will start with direct resume/job-description analysis: the app sends the selected resume and job description to an AI provider and stores the structured result.

Later versions may add document chunking, embeddings, pgvector, and semantic retrieval so the app can search across many job-search documents and answer questions using only relevant source material.

RAG is not required to analyze one resume against one job description. RAG becomes useful when the app has too much material to send everything to the model.

## Tech Stack

- NextJS
- React, Typescript, CSS, Material-UI
- Docker
- Postgres
- A local LLM (eventually a cheap cloud-based one)

## Architecture Overview

A nextjs app (client & server) that is backed by a postgres db. The app and the db should be running in Docker. There should also be an connection to an LLM api. 

## Data Model Draft

* `users`

  * Represents the local user of the app.
  * This will be more useful post-MVP, especially if authentication is added later, but having it now gives the schema a realistic shape.
  * Later versions may add columns such as `email`, `password_hash`, or external auth-provider IDs.
  * Columns: `id`, `username`, `created_at`

* `resumes`

  * Stores resume text entered or pasted by the user.
  * Resumes can be inserted and updated.
  * For the MVP, there will be a single resume, but the schema allows for more later.
  * Later versions may add a resume type or label, such as `software_engineering`, `management`, or `technical_writing`.
  * Columns: `id`, `user_id` FK, `resume_text`, `created_at`, `updated_at`

* `job_descriptions`

  * Stores job descriptions entered or pasted by the user.
  * Job descriptions can be inserted and updated.
  * For the MVP, there will be a single job description, but the schema allows for more later.
  * Columns: `id`, `user_id` FK, `job_text`, `created_at`, `updated_at`

* `analysis_runs`

  * Stores the result of comparing a resume to a job description.
  * Each analysis run references the specific resume and job description that were analyzed.
  * The AI result is stored as structured JSON.
  * Columns: `id`, `resume_id` FK, `job_description_id` FK, `ai_result_json`, `model_metadata`, `created_at`


### Open Question

For the MVP, resumes and job descriptions may be updated in place. A later version may add version history so previous drafts and analyses can be preserved.

## AI Provider Strategy

- There needs to be an abstraction layer so models can be swapped out.
- For the first pass, the LLM will be local
- For the second, it will be an cheap, hosted LLM

## Cost-Control Strategy

- use local and cheap online LLMs
- log token use and cost

## Testing Strategy

- Befor using a real LLM, mock a provider. 
- Unit tests where applicable. 
- End-to-end tests for non-MVP version

## Local Development Setup

- Docker
- Postgres
- Node + npm

## Initial Backlog

### 1. Project setup
- Create Next.js app with TypeScript
- Add basic folder structure
- Add Material UI
- Add environment-variable handling
- Add `.gitignore` entries for local secrets

### 2. Local database setup
- Add Docker Compose with Postgres
- Add `.env.local` with `DATABASE_URL`
- Confirm local connection with `psql`
- Add a small Node script to test the `pg` connection

### 3. Database schema and migrations
- Choose a lightweight migration approach for raw SQL
- Create initial schema for `users`, `resumes`, `job_descriptions`, and `analysis_runs`
- Add a first SQL migration for the MVP tables
- Seed one local development user

### 4. Database access layer
- Install and configure `pg`
- Add database connection helper
- Add small query functions for resumes, job descriptions, and analysis runs

### 5. Resume and job-description CRUD
- Create UI for editing one resume
- Create UI for editing one job description
- Save both to Postgres
- Reload saved data on app restart
- Allow updating existing saved text

### 6. AI provider abstraction
- Define an interface for analysis providers
- Implement a mock provider first
- Return fixed structured JSON for tests and UI development

### 7. Analyze Fit flow
- Add Analyze Fit button
- Send selected resume and job description to provider
- Save analysis result in `analysis_runs`
- Display result in the UI

### 8. Basic tests
- Test database utility functions where practical
- Test mock provider
- Test analysis result parsing/validation
- Add at least one component or integration test around the Analyze Fit flow
