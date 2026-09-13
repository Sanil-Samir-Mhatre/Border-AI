FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install system dependencies required by OpenCV and EasyOCR
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY Combined_App/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the repository
COPY . .

# Expose the port (Render sets this dynamically)
ENV PORT=10000
EXPOSE $PORT

# Run FastAPI with uvicorn
CMD uvicorn Combined_App.main:app --host 0.0.0.0 --port $PORT
