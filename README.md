## Introduction
This web-based application is a tool for users to record/upload an audio file and be given a rating in each of the following categories: Assertiveness, Enthusiasm, Engagement, and Clarity. The goal is for users to be able to practice their public speaking skills in the comfort of their own home/room, while giving an objective rating of their speaking skills

## Technical Architecture + Developers
- React-based Frontend: Aryan
- Django-based Backend: Maciek
- CNN Models: Ethan and Nisheet
  
## Running the Application
Be sure to have everything installed from requirements.txt
- Use "npm install" for the frontend portions
- Use "pip install" for the backend portions

### Frontend
Navigate to the frontend using 
```
cd speech_frontend
```
and type 
```
npm start
```
Open up the localhost in your preferred browser

### Backend
Navigate to the backend (from root) using
```
cd django
```
and type
```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```

## Project Instructions
Once everything is running, register and/or login and start recording audio clips!
