use crate::models::attribute_model::Attribute;
use crate::models::file_model::File;
use crate::UrlExtrator::Repo;
use sqlx::postgres::types;
use sqlx::postgres::PgRow;
use sqlx::{Connection, Row};
use std::error::Error;
pub async fn get_repo_url() -> Result<Vec<Vec<String>>, Box<dyn Error>> {
    let url = "postgres://postgres:Chungath@localhost:5432/postgres";
    let mut conn = sqlx::postgres::PgConnection::connect(url).await?;
    let query = "SELECT * FROM Repo";
    let mut array: Vec<Vec<String>> = Vec::new();
    let res: Vec<PgRow> = sqlx::query(query).fetch_all(&mut conn).await?;
    for i in res.iter() {
        let mut temp: Vec<String> = Vec::new();
        temp.push(i.get("url"));
        temp.push(i.get::<i32, _>("repoid").to_string());

        array.push(temp);
    }
    Ok(array)
}

pub async fn get_repo_contents() -> Result<Vec<Vec<String>>, Box<dyn Error>> {
    let url = "postgres://postgres:Chungath@localhost:5432/postgres";
    let mut conn = sqlx::postgres::PgConnection::connect(url).await?;
    let query = "SELECT * FROM repocmp";
    let mut array: Vec<Vec<String>> = Vec::new();
    let res: Vec<PgRow> = sqlx::query(query).fetch_all(&mut conn).await?;
    for i in res.iter() {
        let mut temp: Vec<String> = Vec::new();

        temp.push(i.get("reponame"));
        temp.push(i.get("hashcode"));

        array.push(temp);
    }
    Ok(array)
}

pub async fn add_repo_details(repo: &Repo) -> Result<(), Box<dyn Error>> {
    let url = "postgres://postgres:Chungath@localhost:5432/postgres";
    let mut conn = sqlx::postgres::PgConnection::connect(url).await?;
    let query = "INSERT INTO repo(repoid,reponame,numlines,rate,forks,url)
    SELECT $1, $2, $3,$4,ARRAY[";
    let mut array = repo
        .fork
        .iter()
        .map(|x| x.id.to_string())
        .collect::<Vec<_>>()
        .join(",");
    if (array.len() == 0) {
        array = String::from("0");
    }

    let result = format!(
        "{}{}],$5
    WHERE
    NOT EXISTS (
    SELECT repoid FROM repo WHERE repoid = $6
    );",
        query, array
    );

    let res = sqlx::query(&result)
        .bind(&repo.id)
        .bind(&repo.repo_name)
        .bind(&repo.num_lines)
        .bind(0.0)
        .bind(&repo.repo_url)
        .bind(&repo.id)
        .fetch_all(&mut conn)
        .await?;
    Ok(())
}

pub async fn add_file(data: &str) -> Result<(), Box<dyn Error>> {
    let url = "postgres://postgres:Chungath@localhost:5432/postgres";
    let mut conn = sqlx::postgres::PgConnection::connect(url).await?;
    let mut query = String::from("INSERT INTO repocmp(reponame,hashcode) values ");
    query.push_str(data);
    let res = sqlx::query(&query).fetch_all(&mut conn).await?;
    Ok(())
}

pub async fn add_file_details(query_str: String) -> Result<(), Box<dyn Error>> {
    let url = "postgres://postgres:Chungath@localhost:5432/postgres";
    let mut conn = sqlx::postgres::PgConnection::connect(url).await?;
    let mut query = String::from("INSERT INTO files(file_name,subset,hashcode,p4c,tree_sitter,error,num_similar,number_constant,number_parser,number_declaration,number_control,number_if,url,error_p4c,intel_lexar,intel_parser) values");
    query.push_str(&query_str);

    let res = sqlx::query(&query).fetch_all(&mut conn).await?;
    Ok(())
}
