
use crate::models::file_model::File;
use crate::repo_files::file_builder::*;
use crate::repo_files::testing_benchmarks::intel_tester::intel_test;
use crate::repo_files::testing_benchmarks::p4c_tester;
use crate::Database::Dao;
use std::collections::HashMap;
use std::error::Error;

use crate::repo_files::testing_benchmarks::*;

pub async fn filter_files() -> Result<(), Box<dyn Error>> {
    //Getting Data from database
    let value = Dao::get_repo_contents().await?;
    let mut map: HashMap<String, HashMap<String, Vec<File>>> = HashMap::new();
    const MAX: usize = 100;
    let mut index = 0;
    //Iterate through rows
    for row in value {
        // println!("{:?}", row);
        if (index > MAX) {
            //  break;
        }
        index += 1;

        let url = row[0].split("/");
        let mut last = url.last().unwrap();
        match map.get_mut(last) {
            Some(temp_clone) => {
                if (temp_clone.contains_key(&row[1])) {
                    let mut temp1 = temp_clone.get_mut(&row[1]).unwrap();
                    let file_builder: FileBuilder =
                        Builder::new(last.to_string().clone(), row[1].clone(), row[0].clone());
                    let file = file_builder.build();
                    temp1.push(file);
                } else {
                    let file_builder: FileBuilder =
                        Builder::new(last.to_string().clone(), row[1].clone(), row[0].clone());
                    let file = file_builder.build();
                    temp_clone.insert(row[1].clone(), vec![file]);
                }
            }
            None => {
                let m = HashMap::new();
                map.insert(last.to_string(), m);
            }
        }
    }


    println!(" Size{}", map.len());
    let max = map.len();
    let mut value_str = String::new();
    let mut it = 0;
    for (key, mut value) in map {
        let mut i = 0;
        let flaot: f64 = (it as f64) / (max as f64);
        println!("Percent: {}", flaot);
        println!("Value: {} ", it);
        it += 1;
        for (key1, mut value1) in value {
            let mut tested = false;

            let mut result_p4c = false;
            let mut error_p4c = String::new();
            for item in value1 {
                if (tested == false) {
                    let (result, error) = p4c_tester::p4c_test(&item).await.unwrap();
                    error_p4c = error;
                    result_p4c = result;
                    tested = true;
                }
                let (lexar, parser) = intel_test(&item).await.unwrap();

                let (result_tree_sitter, attr) =
                    tree_sitter_tester::tree_sitter_test(&item).await.unwrap();
                let mut error = String::from("");
                for item in attr.error_array {
                    error.push_str(item.as_str());
                    error.push_str(",:,")
                }
                let mut file_builder = FileBuilder::new_file(&item);

                file_builder.add_p4c_state(result_p4c);
                file_builder.add_subset(i);
                file_builder.add_tree_sitter_state(result_tree_sitter);
                let new_value = file_builder.build();

                value_str.push_str(&format!(
                    "('{}',{},'{}',{},{},'{}',{},{},{},{},{},{},'{}','{}',{},{}),",
                    new_value.file_name,
                    new_value.subset,
                    new_value.hashcode,
                    new_value.p4c,
                    new_value.tree_sitter,
                    error.replace('"', "").replace("'", ""),
                    new_value.num_similar,
                    attr.number_constant,
                    attr.number_parser,
                    attr.number_declaration,
                    attr.number_control,
                    attr.number_if,
                    new_value.url,
                    error_p4c.replace('"', "").replace("'", ""),
                    lexar,
                    parser
                ));
            }
            i += 1;
        }
    }

    if (value_str.len() > 0) {
        value_str = value_str[0..value_str.len() - 1].to_string();
        value_str.push(';');
        let result = Dao::add_file_details(value_str).await;
        match result {
            Ok(ok) => print!("{:?}", ok),
            Err(E) => eprint!("{}", E),
        }
    }

    Ok(())
}
