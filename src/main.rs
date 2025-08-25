use askama::Template;
use axum::{
    Router,
    response::{Html, IntoResponse},
    routing::get,
};
use tower_http::services::ServeDir;

#[derive(Template)]
#[template(path = "home.html")]
struct HomeTemplate<'a> {
    title: &'a str,
    items: Vec<&'a str>,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(home))
        .nest_service("/static", ServeDir::new("static"));

    let listener = tokio::net::TcpListener::bind(("0.0.0.0", 3000))
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn home() -> impl IntoResponse {
    let tmpl = HomeTemplate {
        title: "Hello from Rust",
        items: vec!["One", "Two", "Three"],
    };
    Html(tmpl.render().unwrap())
}
