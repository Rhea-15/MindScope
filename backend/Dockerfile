FROM python:3.11-slim

WORKDIR /app

# Temporarily fix Debian mirror "unexpected size" / "Mirror sync in progress" issues
RUN echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::Check-Valid-Until false;" >> /etc/apt/apt.conf.d/99custom

# Install system compiler tools needed for native extensions
# Added clean/update retries to handle transient mirror desyncs
RUN apt-get clean && \
    apt-get update -o Acquire::CompressionTypes::Order::=gz && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]