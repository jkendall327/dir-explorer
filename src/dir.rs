use std::{
    error::Error,
    path::{Path, PathBuf},
    sync::OnceLock,
};

pub struct Directory {
    path: PathBuf,
    files: Vec<String>,
}

impl Directory {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Directory, Box<dyn Error>> {
        if path.as_ref().is_dir() {
            let path_buf = path.as_ref().to_owned();

            let metadata = path.as_ref().metadata();
            let files = std::fs::read_dir(path)?;

            return Ok(Directory {
                path: path_buf,
                files: Vec::new(),
            });
        }

        todo!()
    }

    pub fn value(&self) -> &Path {
        &self.path
    }
}
