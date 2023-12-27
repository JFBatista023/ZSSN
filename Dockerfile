# Use a imagem base do Python
FROM python:3.10

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo requirements.txt para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências definidas no requirements.txt
RUN pip install -r requirements.txt

# Copia o restante do código fonte para o diretório de trabalho
COPY . .

# Comandos a serem executados ao iniciar o contêiner
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
