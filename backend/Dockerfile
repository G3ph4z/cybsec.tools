FROM python:3.10
WORKDIR /app
COPY flask-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY flask-api/ /app/
ENV FLASK_APP=api.py
#ENV FLASK_RUN_HOST=0.0.0.0
EXPOSE 5000
CMD ["flask", "run"]
