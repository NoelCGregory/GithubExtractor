use crate::models::file_model::File;
use analyzer_core::parser::p4_grammar;
use async_std::fs;
use std::path::Path;
pub async fn intel_test(value: &File) -> Option<(bool, bool)> {
    let isDir = Path::new(&format!("{}", value.url)).is_dir();
    let mut lexar = false;
    let mut parser_error = false;
    if (isDir == false) {
        //Reading contents
        let file_contents = fs::read(format!("{}", value.url)).await.unwrap();
        let contents = String::from_utf8_lossy(&file_contents).to_string(); //converting
        (lexar, parser_error) = p4_grammar::test_code(contents).unwrap();
    }

    Some((lexar, parser_error))
}
