use confy::ConfyError;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Settings {
    pub port: u16,
    pub address: String,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            port: 3000,
            address: "0.0.0.0".to_owned(),
        }
    }
}

pub fn load() -> Result<Settings, ConfyError> {
    confy::load::<Settings>("myapp", None)
}
