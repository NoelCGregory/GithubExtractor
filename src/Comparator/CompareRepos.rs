use crate::Dao;
use async_fs;
use sha2::{Digest, Sha256};
use std::collections::hash_map::DefaultHasher;

use std::hash::{Hash, Hasher};
use std::io::{self, Read};
use std::path::Path;
use walkdir::WalkDir;
pub async fn get_file_hash() -> io::Result<()> {
    let value = Dao::get_repo_url().await;
    let result = value.unwrap();
    let mut overall = String::new();

    let mut hasher = Sha256::new();

    for dir in result {
        let walker = WalkDir::new(format!("./output1/{}", dir[1])).into_iter();
        for entry in walker {
       
            if let Ok(entry) = entry {

                let file_path = entry.path();

                let isDir = Path::new(file_path).is_dir();
                if file_path.extension().unwrap_or_default() == "p4" && isDir == false {
                    match async_fs::read_to_string(file_path).await {
                        Ok(file) => {
                            let val = calculate_hash(&file);
                            // Create the SHA-256 hasherx
                            let hash = format!("('{:?}','{:x}'),", file_path, val);
                            overall.push_str(&hash.replace('"', ""));
                        }
                        Err(E) => (),
                    }
                }
            }
        }
    }

    overall = overall[0..overall.len() - 1].to_string();
    overall.push(';');
    println!("{}", overall);
    let result = Dao::add_file(&overall.as_str()).await;
    match result {
        Ok(ok) => print!("{:?}", ok),
        Err(E) => eprint!("{}", E),
    }
    Ok(())

    // Open the file
}

fn calculate_hash<T: Hash>(t: &T) -> u64 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    s.finish()
}
