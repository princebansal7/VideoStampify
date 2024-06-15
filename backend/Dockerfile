# Stage 1: Build the Python app
FROM python:3.9.9-slim-buster as python_app
WORKDIR /app
COPY app.py requirements.txt /app/
RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6 libx11-xcb1
RUN pip install -r requirements.txt

# Stage 2: Use the nvidia/cuda image as the base image
# FROM nvidia/cuda:11.8.0-runtime-ubuntu18.04
# WORKDIR /app
# COPY --from=python_app /app /app

# all network bind to port 5000 for gunicorn server
CMD ["gunicorn", "--timeout", "1000", "-b", "0.0.0.0:5000", "app:app"]
