use tokio;
mod Extractor;
mod models;
use crate::Extractor::UrlExtrator;
mod Database;
use crate::Database::Dao;
mod Cloner;
mod Comparator;
use crate::Comparator::CompareRepos;

mod repo_files;
use crate::repo_files::filter_file;
use futures::join;
#[tokio::main]
async fn main() {
    //Each step is to be done seperatelty as to get best result and less prone to errors

    //Get Url
    let value = UrlExtrator::get_github_url(0).await;
    let result = match value {
        Ok(file) => file,
        Err(E) => panic!("Error {}", E),
    };
    
    //Getting urls from databse (As sum may not have been fully succedded in retreival)
    let value = Dao::get_repo_url().await;
    let result = match value {
        Ok(file) => file,
        Err(E) => panic!("Error {}", E),
    };

    //Going throuhg the url and cloneing with 4 threads
    for i in (316..result.len() - 4).step_by(4) {
        let val1 = Cloner::CloneRepo::cloneRepo(&result[i]);

        let val2 = Cloner::CloneRepo::cloneRepo(&result[i + 1]);

        let val3 = Cloner::CloneRepo::cloneRepo(&result[i + 2]);

        let val4 = Cloner::CloneRepo::cloneRepo(&result[i + 3]);
        join!(val1, val2, val3, val4);
    }

    //Hashing each repo for later comaprision
    let val: Result<(), std::io::Error> = CompareRepos::get_file_hash().await;
    match val {
        Ok(i) => println!("{:?}", i),
        Err(e) => eprint!("{}", e),
    }
    
    //Filtering each file and exporting them
    let res = filter_file::filter_files().await;
    match res {
        Ok(i) => println!("{:?}", i),
        Err(e) => eprint!("{}", e),
    }
   
}

