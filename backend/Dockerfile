FROM rust:1.79-bullseye as builder
WORKDIR /app
COPY Cargo.toml Cargo.lock .
COPY src src
COPY templates templates
COPY static static
RUN cargo build --release

FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /app/target/release/dir-web /usr/local/bin/dir-web
COPY templates templates
COPY static static
EXPOSE 3000
CMD ["dir-web"]
