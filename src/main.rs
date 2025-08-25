use std::{error::Error, path::Path};

use askama::Template;
use axum::{
    Router,
    response::{Html, IntoResponse},
    routing::get,
};
use confy::ConfyError;
use serde::{Deserialize, Serialize};
use tower_http::{
    services::ServeDir,
    trace::{DefaultMakeSpan, DefaultOnRequest, DefaultOnResponse, TraceLayer},
};
use tracing::Level;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod dir;

#[derive(Template)]
#[template(path = "home.html")]
struct HomeTemplate<'a> {
    title: &'a str,
    items: Vec<&'a str>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let config = config::load()?;

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,tower_http=info,axum=info".into()),
        )
        .with(tracing_subscriber::fmt::layer().compact())
        .init();

    let trace = TraceLayer::new_for_http()
        .make_span_with(
            DefaultMakeSpan::new()
                .level(Level::INFO)
                .include_headers(false),
        )
        .on_request(DefaultOnRequest::new().level(Level::INFO))
        .on_response(DefaultOnResponse::new().level(Level::INFO));

    let app = Router::new()
        .route("/", get(home))
        .route("/health", get(health))
        .route("/directory", get(list_things))
        .layer(trace)
        .nest_service("/static", ServeDir::new("static"));

    let listener = tokio::net::TcpListener::bind((config.address, config.port)).await?;

    axum::serve(listener, app).await?;

    Ok(())
}

async fn home() -> impl IntoResponse {
    let tmpl = HomeTemplate {
        title: "Hello from Rust",
        items: vec!["One", "Two", "Three"],
    };
    Html(tmpl.render().unwrap())
}

async fn health() -> &'static str {
    "healthy"
}

#[derive(Deserialize)]
struct DirectoryQuery {
    path: String,
}

// This will parse query strings like `?page=2&per_page=30` into `Pagination`
// structs.
async fn list_things(pagination: axum::extract::Query<DirectoryQuery>) {
    let z = dir::Directory::new(Path::new(&pagination.path));
}
