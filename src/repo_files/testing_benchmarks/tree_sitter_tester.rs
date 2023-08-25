use crate::models::attribute_model::Attribute;
use crate::models::file_model::File;
use crate::repo_files::testing_benchmarks::extract_attr;
use async_std::fs;
use std::{fmt::format, path::Path};
use tree_sitter::{Node, Parser, Tree};
use tree_sitter_p4::language;

pub async fn tree_sitter_test(value: &File) -> Option<(bool, Attribute)> {
    let mut treeTest = true;
    let mut attr: Attribute = Attribute {
        number_constant: 0,
        number_parser: 0,
        number_declaration: 0,
        number_control: 0,
        number_if: 0,
        error_array: Vec::new(),
    };
    //Check if the file is a directory or not
    let isDir = Path::new(&format!("{}", value.url)).is_dir();
    if (isDir == false) {
        //Reading contents
        let file_contents = fs::read(format!("{}", value.url)).await.unwrap();
        let contents = String::from_utf8_lossy(&file_contents).to_string(); //converting
        let mut parser = Parser::new();
        parser.set_language(language()).unwrap();
        let tree_result: Option<Tree> = parser.parse(contents.clone(), None);
        let mut error_array: Vec<String> = Vec::new();

        if let Some(tree) = tree_result {
            let mut errorArray: Vec<String> = Vec::new();
            if (tree.root_node().has_error() == true) {
                let mut iterator = 0;
                error_array = get_error(tree.root_node(), contents.clone());
                treeTest = false;
            }

            attr = extract_attr::extract(tree.clone(), contents.clone(), error_array);
        }
    }
    return Some((treeTest, attr));
}

pub fn get_error(node: Node, contents: String) -> Vec<String> {
    let mut iterator = 0;
    let mut error_array: Vec<String> = Vec::new();

    let mut temp_child = node;
    while true {
        let cur = temp_child.child(iterator);
        let temp = match cur {
            Some(childd) => {
                if (childd.has_error()) {
                    temp_child = childd;
                    error_array.append(&mut get_error(childd, contents.clone()));
                    //errorArray.push(childd.utf8_text(contents.as_bytes()).unwrap().to_string());
                    //println!("{:?}", childd.utf8_text(contents.as_bytes()))
                }
            }
            None => {
                let mut temp_str = temp_child
                    .utf8_text(contents.as_bytes())
                    .unwrap()
                    .to_string();
                let range_str = format!(
                    "[{}:{}]",
                    temp_child.range().start_point.row,
                    temp_child.range().end_point.row
                );
                temp_str.push_str(range_str.as_str());
                error_array.push(temp_str);
                break;
            }
        };
        iterator += 1;
    }
    return error_array;
}
