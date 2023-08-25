use crate::models::file_model::File;
use async_process::Command;
use std::str;

pub async fn p4c_test(value: &File) -> Option<(bool, String)> {
    let mut p4c = true;
    let output = Command::new("p4test")
        .arg(format!("{}", value.url))
        .output()
        .await;

    match output {
        Ok(x) => {
            let mut error = String::new();
            if (x.stderr.len() > 0) {
                let text = str::from_utf8(&x.stderr).unwrap();
                if (text.contains("syntax error")) {
                    error.push_str(text);
                    if let Some(start_index) = text.find('(') {
                        if let Some(end_index) = text[start_index + 1..].find(')') {
                            error.push_str(",:,");
                            error.push_str(&text[start_index + 1..start_index + end_index + 1]);
                        }
                    }
                    p4c = false;
                } else if (text.contains("error")) {
                    println!("{}", text);
                }
            }
            
            return Some((p4c, error));
        }
        Err(e) => None,
    }
}
