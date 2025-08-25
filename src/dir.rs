use std::{
    error::Error,
    path::{Path, PathBuf},
};

pub struct Directory(PathBuf);

impl Directory {
    pub fn new<P: AsRef<Path>>(path: P) -> Result<Directory, Box<dyn Error>> {
        if path.as_ref().is_dir() {
            let dir = Directory(path.as_ref().to_owned());
            return Ok(dir);
        }

        todo!()
    }

    pub fn value(&self) -> &Path {
        self.0.as_path()
    }
}
