use std::error::Error;

use askama::Template;
use axum::{
    Router,
    response::{Html, IntoResponse},
    routing::get,
};
use confy::ConfyError;
use serde::{Deserialize, Serialize};
use tower_http::services::ServeDir;

#[derive(Template)]
#[template(path = "home.html")]
struct HomeTemplate<'a> {
    title: &'a str,
    items: Vec<&'a str>,
}

#[derive(Serialize, Deserialize)]
struct Settings {
    port: u16,
    address: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            port: 3000,
            address: "0.0.0.0".to_owned(),
        }
    }
}

fn load() -> Result<Settings, ConfyError> {
    confy::load::<Settings>("myapp", None)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let config = load()?;

    let app = Router::new()
        .route("/", get(home))
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
