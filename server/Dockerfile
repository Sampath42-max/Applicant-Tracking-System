# Use Python 3.11 base image
FROM python:3.11-slim

# Install Tesseract and other dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libmagic1 \
    && apt-get clean

# Set the working directory
WORKDIR /app

# Copy your app files
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the port
EXPOSE 10000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Start the app
CMD ["gunicorn", "server.app:app", "--bind", "0.0.0.0:5001"]
