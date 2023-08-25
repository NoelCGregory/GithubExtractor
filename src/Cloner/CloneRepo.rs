
use git2::Repository;
use std::fs;
use walkdir::WalkDir;
pub async fn cloneRepo(array: &Vec<String>) {
    let repo_url = array[0].replace('"', "");
    let clone_dir = &format!("./output1/{}", array[1]).to_string();
    let file_extension = "p4";

    // Clone the repository
    let repo = match Repository::clone(repo_url.as_str(), clone_dir) {
        Ok(repo) => repo,
        Err(err) => {
            eprintln!("Failed to clone repository: {}", err);
            return;
        }
    };

    // Filter and delete unwanted files and directories
    let walker = WalkDir::new(clone_dir).into_iter();
    for entry in walker {
        if let Ok(entry) = entry {
            println!("Running");
            let path = entry.path();

            if path.extension().unwrap_or_default() != file_extension {
                if let Err(err) = fs::remove_file(path) {
                    eprintln!("Failed to delete file: {}", err);
                }
            }
        }
    }
}
