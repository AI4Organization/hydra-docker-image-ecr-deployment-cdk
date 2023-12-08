# Use the specified image as the base
FROM ghcr.io/hydradatabase/hydra:latest

# Define arguments that can be passed at build time
ARG POSTGRES_USER
ARG POSTGRES_DB_NAME
ARG POSTGRES_PASSWORD
ARG POSTGRES_PORT
ARG POSTGRES_BASE_VERSION

# Set environment variables from the arguments
ENV POSTGRES_USER=${POSTGRES_USER:-postgres} \
    POSTGRES_DB_NAME=${POSTGRES_DB_NAME:-hydra} \
    POSTGRES_PORT=${POSTGRES_PORT:-5432} \
    POSTGRES_BASE_VERSION=${POSTGRES_BASE_VERSION:-16.1} \
    POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}

# Copy the configuration file into the image
COPY ./files/postgres/postgresql.conf /etc/postgresql/postgresql.conf

# Expose the port (this does not publish the port; it's for documentation purposes)
# Expose the port the app runs on
EXPOSE ${POSTGRES_PORT}

# Set the command to run PostgreSQL with the custom configuration file
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
