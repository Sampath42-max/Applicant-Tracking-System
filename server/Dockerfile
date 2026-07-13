FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the server folder (where the FastAPI app is)
COPY server/ ./server/
COPY wkhtmltopdf/ ./wkhtmltopdf/  

WORKDIR /app/server

# Set environment
ENV PORT=8080

CMD exec uvicorn application:app --host 0.0.0.0 --port $PORT
