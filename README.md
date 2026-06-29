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

- USER table
This will be more useful post-MVP (e.g. for auth), but having it now sets up a good framework.
    - Columns: id, username

- RESUME table
    - Resumes can be inserted and update. For the MVP, there will just be a single resume. The user will create it and then possibly update. Later versions may need a resume-type column, e.g. for a single user who is applying for both tech and medical jobs.
    - Columns: id, user_id (FK), resume_text, create-date, update-date

- JOB_DESCRIPTION table
Jobs can be inserted and updated. For the MVP, there will be just one job
    - Columns: id, user_id, job_text, create-date, update-date

- ANALYSIS table
Stores the results of comparing a resume to a job description
    - Columns: id, resume_id (FK), job_description_id (FK), ai-results (structured JSON), create-date, model_metadata

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

