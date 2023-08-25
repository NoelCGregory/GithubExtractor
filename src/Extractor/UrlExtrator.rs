use async_recursion::async_recursion;
use reqwest::{self, Response};
use serde_json::{json, Value};
use std::*;
use std::{fmt::format, time::Duration};
use tokio::time::sleep;

static APP_USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"),);
pub struct File {
    pub file_name: String,
    pub num_similar: i64,
    pub p4c: bool,
    pub tree_sitter: bool,
    pub comparisons: Vec<String>,
}
pub struct Repo {
    pub id: i64,
    pub repo_url: String,
    pub repo_name: String,
    pub rate: f64,
    pub num_lines: i64,
    pub fork: Vec<Repo>,
}

#[async_recursion]
pub async fn get_github_url(page: i64) -> Result<Vec<Repo>, Box<dyn std::error::Error>> {
    println!("Started Url");
    let mut result: Vec<Repo> = Vec::new();
    let client = reqwest::Client::builder()
        .user_agent(APP_USER_AGENT)
        .build()?;
    let mut response: Value = json!("");
    let resp = client
        .get(format!(
            "https://api.github.com/search/repositories?q=p4:language:p4&page={}",
            page
        ))
        .header("Accept", "application/json")
        .send()
        .await?;
    if resp.status() != reqwest::StatusCode::OK {
        println!(
            "https://api.github.com/search/repositories?q=p4:language:p4&page={}",
            page
        );
        eprintln!("didn't get OK status: {}", resp.status());
    }
    response = resp.json().await?;

    let mut pagEnd = false;
    if (response.to_string().len() > 2 && response["message"] != "Not Found") {
        //println!("{}", response.to_string());

        // println!("{}", response["message"] != "Not Found");
        let value = response["items"].as_array().unwrap();

        for i in 0..value.len() {
            println!("Finished {}", i);
            let fork_url: String = response["items"][i]["forks_url"]
                .to_string()
                .replace('"', "");
            if (!fork_url.contains("null")) {
                let forkVector = get_fork_url(&fork_url, 0).await?;
                let temp = Repo {
                    id: response["items"][i]["id"]
                        .to_string()
                        .parse::<i64>()
                        .unwrap(),
                    repo_url: response["items"][i]["html_url"].to_string(),
                    repo_name: response["items"][i]["full_name"].to_string(),
                    rate: 0.0,
                    num_lines: response["items"][i]["size"]
                        .to_string()
                        .parse::<i64>()
                        .unwrap(),
                    fork: forkVector,
                };

                println!("{}", response["items"][i]["full_name"].to_string());

                let value = crate::Dao::add_repo_details(&temp).await?;
                pagEnd = true;
                sleep(Duration::from_millis(320)).await;
                result.push(temp);
            }
        }
    }
    if (pagEnd) {
        //let mut tempVect = get_github_url(page + 1).await?;
        //result.append(&mut tempVect);
    }
    Ok(result)
}

#[async_recursion]
pub async fn get_fork_url(
    forkUrl: &String,
    page: i64,
) -> Result<Vec<Repo>, Box<dyn std::error::Error>> {
    let mut result: Vec<Repo> = Vec::new();
    let client = reqwest::Client::builder()
        .user_agent(APP_USER_AGENT)
        .build()?;
    let mut response: Value = json!("");
    let resp = client
        .get(format!("{}?&page={}",forkUrl,page))
        .header("Accept", "application/json")
        .bearer_auth("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")
        .send()
        .await?;
    println!("{}", resp.status());
    if resp.status() != reqwest::StatusCode::OK {
        println!("{}?&page={}", forkUrl, page);
        eprintln!("didn't get OK status: {}", resp.status());
    }
    response = resp.json().await?;

    let mut pagEnd = false;
    //println!("{}", response);
    if (response.to_string().len() > 2 && response["message"] != "Not Found") {
        //println!("{}", response.to_string());

        //println!("{}", response["message"] != "Not Found");
        let value = response.as_array().unwrap();
        //println!("{}", value.len());

        for j in 0..value.len() {
            let fork_url: String = response[j]["forks_url"].to_string().replace('"', "");

            println!("SubFinished {}", j);
            if (!fork_url.contains("null")) {
                let forkVector = get_fork_url(&fork_url, page).await?;
                let temp = Repo {
                    id: response[j]["id"].to_string().parse::<i64>().unwrap(),
                    repo_url: response[j]["html_url"].to_string(),
                    repo_name: response[j]["full_name"].to_string(),
                    rate: 0.0,
                    num_lines: response[j]["size"].to_string().parse::<i64>().unwrap(),
                    fork: forkVector,
                };
                if (response[j]["id"].to_string().parse::<i64>().unwrap() == 594890462) {
                    println!(
                        "-------------------------------------------------- : {} : {}:{}:{}",
                        forkUrl, fork_url, j, page
                    );
                }

                let value = crate::Dao::add_repo_details(&temp).await?;
                pagEnd = true;
                sleep(Duration::from_millis(400)).await;
                result.push(temp);
            }
        }
    }
    if (pagEnd) {
        let mut tempVect = get_fork_url(&forkUrl, page + 1).await?;
        result.append(&mut tempVect);
    }
    Ok(result)
}
/*
#[async_recursion]
pub async fn get_files_links(url: &String) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut result: Vec<String> = Vec::new();
    println!("Url: {}", url);
    let client = reqwest::Client::builder()
        .user_agent(APP_USER_AGENT)
        .build()?;
    let response = client
        .get(url)
        .header("Accept", "application/json")
        .bearer_auth("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")
        .send()
        .await?
        .json::<serde_json::Value>()
        .await?;

    //println!("{}", response);

    for i in 0..5 {
        // println!("{}/n====", response["tree"][i]);
        let fork_url: String = response["tree"][i]["url"].to_string().replace('"', "");
        if (!fork_url.contains("null")) {
            //println!("{}", fork_url);
            let forkVector: Vec<String> = get_files_links(&fork_url).await?;
            for i in forkVector.iter() {
                result.push(i.to_string());
            }
        }
        sleep(Duration::from_millis(1000)).await;
        if (response["tree"][i]["path"].to_string().contains(".p4")) {
            println!("Name: {}", response["tree"][i]["path"].to_string());
            //result.push(temp);
        }
    }
    Ok(result)
}

#[async_recursion]
pub async fn get_contents() -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut result: Vec<String> = Vec::new();
    let client = reqwest::Client::builder()
        .user_agent(APP_USER_AGENT)
        .build()?;
    let response = client
        .get("https://api.github.com/repos/p4lang/tutorials/contents?")
        .header("Accept", "application/json")
        .bearer_auth("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")
        .send()
        .await?
        .json::<serde_json::Value>()
        .await?;

    for i in 0..5 {
        let fork_url: String = response[i]["git_url"].to_string().replace('"', "");
        // println!("{}", fork_url);
        if (fork_url.contains("tree")) {
            let forkVector: Vec<String> = get_files_links(&fork_url).await?;
            for i in forkVector.iter() {
                result.push(i.to_string());
            }
        }

        sleep(Duration::from_millis(1000)).await;
        if (response[i]["name"].to_string().contains(".p4")) {
            //    print!("int");
            //result.push(temp);
        }
    }
    Ok(result)
}
*/
